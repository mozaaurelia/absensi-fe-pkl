import { apiFetch } from "@/lib/api";

export interface DashboardTodayAttendance {
  id?: string;
  clock_in_time?: string | null;
  clock_out_time?: string | null;
  status?: string | null;
  lat?: number | null;
  lng?: number | null;
  location_name?: string | null;
}

export interface LeaveQuotaBalance {
  leave_type_id?: string;
  leave_type_name?: string | null;
  total?: number;
  used?: number;
  remaining?: number;
}

export interface CurrentSchedule {
  date?: string | null;
  shift_name?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location_name?: string | null;
}

export interface DashboardEmployeeData {
  today_attendance?: DashboardTodayAttendance | null;
  leave_quota_balance?: LeaveQuotaBalance | null;
  current_schedule?: CurrentSchedule | null;
}

export async function getEmployeeDashboard(): Promise<DashboardEmployeeData> {
  return apiFetch<DashboardEmployeeData>("/dashboard/employee");
}

export interface AdminAttendanceBreakdown {
  present?: number;
  late?: number;
  absent?: number;
  total?: number;
  not_checked_in?: number;
}

export interface DashboardAdminData {
  total_active_employees?: number;
  today_attendance_breakdown?: AdminAttendanceBreakdown | null;
  pending_leave_count?: number;
  pending_overtime_count?: number;
}

export async function getAdminDashboard(): Promise<DashboardAdminData> {
  return apiFetch<DashboardAdminData>("/dashboard/admin");
}

export interface TeamAttendanceSummary {
  present?: number;
  late?: number;
  absent?: number;
  total?: number;
  not_checked_in?: number;
}

export interface DashboardSupervisorData {
  team_today?: TeamAttendanceSummary | null;
  pending_leave_count?: number;
}

export async function getSupervisorDashboard(): Promise<DashboardSupervisorData> {
  return apiFetch<DashboardSupervisorData>("/dashboard/supervisor");
}
