import { apiFetch } from "@/lib/api";

export interface Announcement {
  id: string;
  company_id?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return apiFetch<Announcement[]>("/announcements");
}

export async function createAnnouncement(body: {
  title: string;
  content: string;
}): Promise<Announcement> {
  return apiFetch<Announcement>("/announcements", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateAnnouncement(
  id: string,
  body: { title: string; content: string },
): Promise<Announcement> {
  return apiFetch<Announcement>(`/announcements/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteAnnouncement(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/announcements/${id}`, {
    method: "DELETE",
  });
}