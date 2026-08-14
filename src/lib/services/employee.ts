import { apiFetch } from "@/lib/api";

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;

  join_date: string;
  status: "active" | "inactive" | "resigned";

  role_id: string | null;
  role_name: string | null;

  department_id: string | null;
  department_name: string | null;

  position_id: string | null;
  position_name: string | null;

  supervisor_id: string | null;
  supervisor_name: string | null;

  company_id: string;
  company_name: string;
  image: string | null;
}

export async function getMyProfile(): Promise<EmployeeProfile> {
  return apiFetch<EmployeeProfile>("/employees/me/profile");
}

export interface UpdatedEmployeeProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export async function updateMyProfile(
  name: string,
  image?: string,
): Promise<UpdatedEmployeeProfile> {
  return apiFetch<UpdatedEmployeeProfile>("/employees/me/profile", {
    method: "PUT",
    body: JSON.stringify({
      name,
      image,
    }),
  });
}
