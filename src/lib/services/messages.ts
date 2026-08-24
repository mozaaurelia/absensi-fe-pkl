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

export interface DmMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  employee_name?: string;
  employee_image?: string | null;
}

export interface DmConversation {
  id: string;
  name: string;
  image: string | null;
  role_name: string;
  last_message_body: string | null;
  last_message_at: string | null;
  last_message_sender_id: string | null;
  unread_count: number;
}

export async function getMyMessages(limit = 50): Promise<ChatMessage[]> {
  const data = await apiFetch<ChatMessage[]>(`/messages/me?limit=${limit}`);
  return Array.isArray(data) ? data : [];
}

export async function getDmConversations(): Promise<DmConversation[]> {
  const data = await apiFetch<DmConversation[]>("/messages/dm/conversations");
  return Array.isArray(data) ? data : [];
}

export async function getDmMessages(
  partnerId: string,
  limit = 50,
): Promise<DmMessage[]> {
  const data = await apiFetch<DmMessage[]>(
    `/messages/dm/${partnerId}/messages?limit=${limit}`,
  );
  return Array.isArray(data) ? data : [];
}

export async function markDmRead(partnerId: string): Promise<void> {
  await apiFetch(`/messages/dm/${partnerId}/read`, { method: "POST" });
}
