export type ShiftColor = "blue" | "indigo" | "teal" | "purple";

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: ShiftColor;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
}

// assignments[employeeId][dayIndex] = shiftId | null (libur)
export type Assignments = Record<string, (string | null)[]>;

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export const SHIFT_COLOR_MAP: Record<ShiftColor, { bg: string; text: string; dot: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500", border: "border-teal-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" },
};

export interface WeekDay {
  name: string;
  date: number;
  fullDate: string;
  isToday: boolean;
}

export type ScheduleTab = "all" | "wfo" | "wfh" | "libur";

function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function getWeekDays(offset: number): WeekDay[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + offset * 7);

  return DAYS.map((name, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      name,
      date: d.getDate(),
      fullDate: toISO(d),
      isToday: d.getTime() === today.getTime(),
    };
  });
}

export function getShiftDuration(shift: ShiftTemplate): number {
  const [sh, sm] = shift.startTime.split(":").map(Number);
  const [eh, em] = shift.endTime.split(":").map(Number);
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes < 0) minutes += 24 * 60; // shift malam lewat tengah malam
  return minutes / 60;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
