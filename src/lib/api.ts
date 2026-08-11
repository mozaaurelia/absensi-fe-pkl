import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi");
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const session = await getSession();

  const accessToken = session?.user?.accessToken;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let json: ApiResponse<T> | null = null;
  try {
    json = JSON.parse(text) as ApiResponse<T>;
  } catch {
    json = null;
  }

  if (!response.ok || !json || !json.success) {
    throw new ApiError(
      json?.error?.code || "UNKNOWN_ERROR",
      json?.error?.message ||
        `Server returned HTTP ${response.status}. Check that the endpoint exists and the backend is running.`,
    );
  }

  return json.data;
}
