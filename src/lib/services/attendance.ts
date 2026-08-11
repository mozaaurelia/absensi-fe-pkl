import { apiFetch } from "@/lib/api";

export interface AttendanceRecord {
  id: string;
  date?: string | null;
  clock_in_time?: string | null;
  clock_out_time?: string | null;
  status?: string | null;
  late_minutes?: number | null;
  location_name?: string | null;
  employee_id?: string | null;
  employee_name?: string | null;
}

export async function getMyAttendance(): Promise<AttendanceRecord[]> {
  return apiFetch<AttendanceRecord[]>("/attendance/me");
}

export async function getTeamAttendance(): Promise<AttendanceRecord[]> {
  return apiFetch<AttendanceRecord[]>("/attendance/team");
}

export async function clockIn(lat: number, lng: number): Promise<AttendanceRecord> {
  return apiFetch<AttendanceRecord>("/attendance/clock-in", {
    method: "POST",
    body: JSON.stringify({ lat, lng, face_image: "" }),
  });
}

export async function clockOut(lat: number, lng: number): Promise<AttendanceRecord> {
  return apiFetch<AttendanceRecord>("/attendance/clock-out", {
    method: "POST",
    body: JSON.stringify({ lat, lng, face_image: "" }),
  });
}
