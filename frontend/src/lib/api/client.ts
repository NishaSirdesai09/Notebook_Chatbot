/**
 * API client — NestJS-ready.
 *
 * This is the single integration boundary between the Next.js frontend and the
 * future NestJS backend. Every method maps 1:1 to a backend route. Today the
 * methods resolve mock data so the UI is fully interactive; to go live, set
 * `NEXT_PUBLIC_API_URL` and flip `USE_MOCK` to false (or rely on the env check).
 *
 * Backend services to plug in later:
 *   - NestJS REST API (this client's baseUrl)
 *   - PostgreSQL (notebooks, users, references)
 *   - S3 (document storage)
 *   - Vector DB (embeddings / retrieval)
 *   - OpenAI / LangChain (chat, summaries, quizzes)
 *   - Canvas API (course sync)
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

/**
 * Low-level fetch wrapper used by the typed endpoints in `endpoints.ts`.
 * When USE_MOCK is true this is bypassed in favor of in-memory data.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, message || "Request failed");
  }
  return (await res.json()) as T;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
