import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sams_token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    if (
      json.error?.code === "NO_TOKEN" ||
      json.error?.code === "INVALID_TOKEN"
    ) {
      localStorage.removeItem("sams_token");
      const authError = new Error(json.error.message);
      (authError as any).code = "AUTH_EXPIRED";
      throw authError;
    }
    throw new Error(json.error?.message || "Terjadi kesalahan");
  }

  return json.data as T;
}
