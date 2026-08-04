const TARGET_WEEKLY_HOURS = 40;

function getDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getWeekDays() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function getDayMinutes(date) {
  const key = getDateKey(date);
  const checkinStr = localStorage.getItem(`checkin_${key}`);
  const checkoutStr = localStorage.getItem(`checkout_${key}`);

  if (!checkinStr) return 0;

  const checkin = parseInt(checkinStr, 10);
  const checkout = checkoutStr ? parseInt(checkoutStr, 10) : Date.now();

  const diffMs = checkout - checkin;
  if (diffMs < 0) return 0;

  return diffMs / 60000;
}

function formatHours(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}j`;
  return `${h}j ${m}m`;
}

function formatHoursEn(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getWeeklyStats() {
  const days = getWeekDays();
  const targetMinutes = TARGET_WEEKLY_HOURS * 60;

  const dailyMinutes = days.map((d) => getDayMinutes(d));
  const totalMinutes = dailyMinutes.reduce((sum, m) => sum + m, 0);
  const totalHours = totalMinutes / 60;
  const progress = Math.min(Math.round((totalMinutes / targetMinutes) * 100), 100);

  const maxMinutes = Math.max(...dailyMinutes, 1);

  const dailyPercentages = dailyMinutes.map((m) =>
    Math.round((m / maxMinutes) * 100)
  );

  return {
    days,
    dailyMinutes,
    dailyPercentages,
    totalMinutes,
    totalHours,
    progress,
    targetHours: TARGET_WEEKLY_HOURS,
  };
}

export {
  getWeeklyStats,
  formatHours,
  formatHoursEn,
  TARGET_WEEKLY_HOURS,
  getWeekDays,
  getDateKey,
};
