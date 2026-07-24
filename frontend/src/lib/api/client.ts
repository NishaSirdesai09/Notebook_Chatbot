/**
 * API client — all requests go to the NestJS backend.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "nc_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  formData?: FormData;
  /** Internal: skip refresh retry */
  _retry?: boolean;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, formData, _retry } = options;
  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(formData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData ?? (body ? JSON.stringify(body) : undefined),
    cache: "no-store",
  });

  if (res.status === 401 && !_retry && !path.startsWith("/auth/")) {
    const refreshed = await tryRefreshToken();
    if (refreshed) return apiFetch<T>(path, { ...options, _retry: true });
  }

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, message || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function tryRefreshToken(): Promise<boolean> {
  const { getRefreshToken, clearRefreshToken, setRefreshToken } = await import("@/lib/refresh-token");
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearRefreshToken();
      clearAccessToken();
      return false;
    }
    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return true;
  } catch {
    clearRefreshToken();
    clearAccessToken();
    return false;
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
