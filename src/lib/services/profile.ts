import { apiFetch } from "@/lib/api";

export interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone_number?: string | null;
  address?: string | null;
  avatar_url?: string | null;
  image?: string | null;
  employee_id?: string | null;
  employee_number?: string | null;
  nik?: string | null;
  position?: string | null;
  department?: string | null;
  join_date?: string | null;
  [key: string]: unknown;
}

export async function getMe(): Promise<Profile> {
  return apiFetch<Profile>("/auth/me");
}

export async function updateMyProfile(body: {
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  position?: string;
  nik?: string;
  image?: string;
}): Promise<Profile> {
  return apiFetch<Profile>("/employees/me/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function changeMyPassword(body: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
