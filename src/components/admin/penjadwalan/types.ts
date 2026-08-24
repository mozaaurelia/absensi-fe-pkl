import type {
  AdminEmployee,
  OfficeLocation,
  Shift,
  WorkingDayPattern,
} from "@/lib/services/admin";
import type { EmployeeSchedule } from "@/lib/services/schedule";

export type { AdminEmployee, OfficeLocation, Shift, WorkingDayPattern, EmployeeSchedule };

export interface EmployeeRow {
  id: string;
  name: string;
  department: string;
}

export interface EmployeeWithSchedule extends EmployeeRow {
  schedule: EmployeeSchedule | null;
}

export function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function isoDayNumber(iso: string): number {
  return (new Date(`${iso}T00:00:00`).getDay() + 6) % 7 + 1;
}

// Backend serializes pg DATE as UTC midnight-shifted ISO datetime, so it must
// be converted back through the local timezone before reading the calendar day.
export function normalizedDatePart(value?: string | null): string | null {
  if (!value) return null;
  return toISODate(new Date(value));
}

export interface ScheduleOnDate {
  works: boolean;
  shiftName: string;
  startTime: string;
  endTime: string;
  locationName: string;
}

export function getScheduleOnDate(
  sched: EmployeeSchedule | null,
  isoDate: string
): ScheduleOnDate {
  if (!sched) return { works: false, shiftName: "", startTime: "", endTime: "", locationName: "" };
  const start = normalizedDatePart(sched.start_date);
  const end = normalizedDatePart(sched.end_date);
  if (!start || isoDate < start || (end && isoDate > end)) {
    return { works: false, shiftName: "", startTime: "", endTime: "", locationName: "" };
  }
  return {
    works: true,
    shiftName: sched.shift_name ?? "-",
    startTime: sched.start_time ?? "",
    endTime: sched.end_time ?? "",
    locationName: sched.location_name ?? "-",
  };
}

export function isWorkingDayFor(
  sched: EmployeeSchedule | null,
  patterns: WorkingDayPattern[],
  isoDate: string
): boolean {
  if (!sched) return false;
  const onDate = getScheduleOnDate(sched, isoDate);
  if (!onDate.works) return false;
  if (sched.working_day_pattern_id) {
    const pat = patterns.find((p) => p.id === sched.working_day_pattern_id);
    if (pat) return pat.active_days.includes(isoDayNumber(isoDate));
  }
  return true;
}
