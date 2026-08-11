import { apiFetch } from "@/lib/api";

export interface EmployeeSchedule {
  id: string;
  employee_id: string;
  shift_id: string;
  working_day_pattern_id?: string | null;
  location_id: string;
  start_date: string;
  end_date?: string | null;
  shift_name?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location_name?: string | null;
}

export async function getMySchedule(
  employeeId: string
): Promise<EmployeeSchedule | null> {
  return apiFetch<EmployeeSchedule | null>(`/schedules/employee/${employeeId}`);
}

export function toHHMM(value?: string | null): string | null {
  if (!value) return null;
  const p = value.split(":");
  return p.length >= 2 ? `${p[0]}:${p[1]}` : value;
}