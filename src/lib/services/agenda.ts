import { apiFetch } from "@/lib/api";

export interface PersonalAgenda {
  id: string;
  agenda_date: string;
  title: string;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  created_at?: string;
}

export async function getUpcomingAgendas(): Promise<PersonalAgenda[]> {
  return apiFetch<PersonalAgenda[]>("/personal-agendas/me?upcoming=true");
}

export async function createPersonalAgenda(payload: {
  agenda_date: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}): Promise<PersonalAgenda> {
  return apiFetch<PersonalAgenda>("/personal-agendas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deletePersonalAgenda(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/personal-agendas/${id}`, {
    method: "DELETE",
  });
}