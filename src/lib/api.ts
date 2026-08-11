import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";

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
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${safeEndpoint}`, {
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
  } catch (error) {
    throw new ApiError(
      "NETWORK_ERROR",
      `Tidak dapat terhubung ke backend. Pastikan server backend berjalan di ${API_URL}.`,
    );
  }

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
