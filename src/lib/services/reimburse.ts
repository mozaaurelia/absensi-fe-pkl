import { apiFetch } from "@/lib/api";

export interface ReimburseItem {
  id: string;
  employee_id?: string | null;
  employee_name?: string | null;
  department_name?: string | null;
  title: string;
  category: string;
  expense_date: string;
  amount: number;
  description?: string | null;
  attachment_url?: string | null;
  status: string;
  approval_note?: string | null;
  created_at?: string;
}

export async function getAllReimburseRequests(): Promise<ReimburseItem[]> {
  return apiFetch<ReimburseItem[]>("/reimburse/requests");
}

export async function getMyReimburseRequests(): Promise<ReimburseItem[]> {
  return apiFetch<ReimburseItem[]>("/reimburse/requests/me");
}

export async function getTeamReimburseRequests(): Promise<ReimburseItem[]> {
  return apiFetch<ReimburseItem[]>("/reimburse/requests/team");
}

export async function createReimburseRequest(body: {
  title: string;
  category: string;
  expense_date: string;
  amount: number;
  description?: string;
  attachment?: string;
  employee_id?: string;
}): Promise<ReimburseItem> {
  return apiFetch<ReimburseItem>("/reimburse/requests", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function approveReimburseRequest(
  id: string,
  approvalNote: string,
): Promise<ReimburseItem> {
  return apiFetch<ReimburseItem>(`/reimburse/requests/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ approval_note: approvalNote }),
  });
}

export async function rejectReimburseRequest(
  id: string,
  approvalNote: string,
): Promise<ReimburseItem> {
  return apiFetch<ReimburseItem>(`/reimburse/requests/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ approval_note: approvalNote }),
  });
}