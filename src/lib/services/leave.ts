import { apiFetch } from "@/lib/api";

export interface LeaveType {
  id: string;
  name: string;
  quota_days?: number | null;
}

export interface LeaveRequest {
  id: string;
  employee_id?: string | null;
  employee_name?: string | null;
  leave_type_id?: string | null;
  leave_type_name?: string | null;  start_date?: string | null;
  end_date?: string | null;
  reason?: string | null;
  status?: string | null;
  total_days?: number | null;
  duration_days?: number | null;
  approval_note?: string | null;
  attachment_url?: string | null;
  department_name?: string | null;
}

export interface LeaveQuota {
  leave_type_id?: string;
  leave_type_name?: string | null;
  total?: number;
  used?: number;
  remaining?: number;
}

export async function getLeaveTypes(): Promise<LeaveType[]> {
  return apiFetch<LeaveType[]>("/leave/types");
}

export async function createLeaveRequest(body: {
  leave_type_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment: string;
}): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>("/leave/requests", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMyLeaveRequests(): Promise<LeaveRequest[]> {
  return apiFetch<LeaveRequest[]>("/leave/requests/me");
}

export async function getLeaveQuota(
  employeeId: string,
): Promise<LeaveQuota | LeaveQuota[]> {
  return apiFetch<LeaveQuota | LeaveQuota[]>("/leave/quota/" + employeeId);
}

export async function getTeamLeaveRequests(): Promise<LeaveRequest[]> {
  return apiFetch<LeaveRequest[]>("/leave/requests/team");
}

export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  return apiFetch<LeaveRequest[]>("/leave/requests");
}

export async function approveLeaveRequest(
  id: string,
  approvalNote: string,
): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>(`/leave/requests/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ approval_note: approvalNote }),
  });
}

export async function rejectLeaveRequest(
  id: string,
  approvalNote: string,
): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>(`/leave/requests/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ approval_note: approvalNote }),
  });
}
