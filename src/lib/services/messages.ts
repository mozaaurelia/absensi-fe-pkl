import { apiFetch } from "@/lib/api";

export interface ChatMessage {
  id: string;
  company_id?: string;
  employee_id: string;
  body: string;
  created_at: string;
  employee_name: string;
  employee_image: string | null;
}

export async function getMyMessages(limit = 50): Promise<ChatMessage[]> {
  const data = await apiFetch<ChatMessage[]>(`/messages/me?limit=${limit}`);
  return Array.isArray(data) ? data : [];
}
