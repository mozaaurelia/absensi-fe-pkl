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

export async function clockIn(lat: number, lng: number, faceImage?: string): Promise<AttendanceRecord> {
  return apiFetch<AttendanceRecord>("/attendance/clock-in", {
    method: "POST",
    body: JSON.stringify({ lat, lng, face_image: faceImage ?? "" }),
  });
}

export async function clockOut(lat: number, lng: number): Promise<AttendanceRecord> {
  return apiFetch<AttendanceRecord>("/attendance/clock-out", {
    method: "POST",
    body: JSON.stringify({ lat, lng, face_image: "" }),
  });
}

export interface OvertimeRequest {
  id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  category?: string | null;
  reason?: string | null;
  status: string;
  created_at?: string;
}

export async function createOvertimeRequest(payload: {
  overtime_date: string;
  start_time: string;
  end_time: string;
  category: string;
  reason: string;
}): Promise<OvertimeRequest> {
  return apiFetch<OvertimeRequest>("/overtime", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyOvertimeRequests(): Promise<OvertimeRequest[]> {
  return apiFetch<OvertimeRequest[]>("/overtime/me");
}

export interface OvertimeTeamRequest extends OvertimeRequest {
  employee_name?: string | null;
}

export async function getTeamOvertimeRequests(): Promise<OvertimeTeamRequest[]> {
  return apiFetch<OvertimeTeamRequest[]>("/overtime/team");
}

export async function approveOvertimeRequest(id: string): Promise<OvertimeTeamRequest> {
  return apiFetch<OvertimeTeamRequest>(`/overtime/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}

export async function rejectOvertimeRequest(
  id: string,
  note: string
): Promise<OvertimeTeamRequest> {
  return apiFetch<OvertimeTeamRequest>(`/overtime/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ approval_note: note }),
  });
}
