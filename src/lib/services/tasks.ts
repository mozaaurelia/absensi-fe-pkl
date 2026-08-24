import { apiFetch } from "@/lib/api";

export interface TaskItem {
  id: string;
  company_id?: string;
  employee_id?: string;
  task_date: string;
  title: string;
  done: boolean;
  created_at?: string;
}

export async function getMyTasks(date?: string): Promise<TaskItem[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const data = await apiFetch<TaskItem[]>(`/tasks/me${query}`);
  return Array.isArray(data) ? data : [];
}

export async function createTask(title: string, taskDate: string): Promise<TaskItem> {
  return apiFetch<TaskItem>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, task_date: taskDate }),
  });
}

export async function updateTask(
  id: string,
  payload: { done?: boolean; title?: string },
): Promise<TaskItem> {
  return apiFetch<TaskItem>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<{ message: string }>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
