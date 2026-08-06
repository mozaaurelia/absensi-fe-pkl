const TARGET_WEEKLY_HOURS = 40;
const DAILY_TARGET_MINUTES = 8 * 60;

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getWeekDays(): Date[] {
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

function getDayMinutes(date: Date) {
  const key = getDateKey(date);
  const checkinStr = localStorage.getItem(`checkin_${key}`);
  if (!checkinStr) return 0;

  const checkin = parseInt(checkinStr, 10);
  const checkoutStr = localStorage.getItem(`checkout_${key}`);

  let end;
  if (checkoutStr) {
    end = parseInt(checkoutStr, 10);
  } else {
    const now = new Date();
    const dayEnd = new Date(date);
    dayEnd.setHours(17, 0, 0, 0);
    end = Math.min(now.getTime(), dayEnd.getTime());
  }

  const diffMs = end - checkin;
  if (diffMs < 0) return 0;

  return Math.min(diffMs / 60000, DAILY_TARGET_MINUTES);
}

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}j`;
  return `${h}j ${m}m`;
}

function formatHoursEn(minutes: number) {
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

  const dailyPercentages = dailyMinutes.map((m) =>
    Math.min(Math.round((m / DAILY_TARGET_MINUTES) * 100), 100)
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
};
