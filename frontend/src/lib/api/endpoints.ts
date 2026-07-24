import { apiFetch, setAccessToken, clearAccessToken } from "@/lib/api/client";
import { setRefreshToken, clearRefreshToken } from "@/lib/refresh-token";
import type {
  ChatMessage,
  Document,
  Notebook,
  Role,
  User,
  UserPreferences,
} from "@/lib/types";

type AuthResponse = { user: User; accessToken: string; refreshToken: string };

function storeAuth(res: AuthResponse) {
  setAccessToken(res.accessToken);
  setRefreshToken(res.refreshToken);
}

export const api = {
  auth: {
    async signup(input: { name: string; email: string; password: string; role: Role }) {
      const res = await apiFetch<AuthResponse>("/auth/signup", { method: "POST", body: input });
      storeAuth(res);
      return res.user;
    },
    async login(input: { email: string; password: string }) {
      const res = await apiFetch<AuthResponse>("/auth/login", { method: "POST", body: input });
      storeAuth(res);
      return res.user;
    },
    async me() {
      return apiFetch<User>("/auth/me");
    },
    async logout() {
      const { getRefreshToken } = await import("@/lib/refresh-token");
      const refreshToken = getRefreshToken();
      clearAccessToken();
      clearRefreshToken();
      if (refreshToken) {
        await apiFetch("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => undefined);
      }
    },
  },

  notebooks: {
    list() {
      return apiFetch<Notebook[]>("/notebooks");
    },
    create(input: Partial<Notebook>) {
      return apiFetch<Notebook>("/notebooks", { method: "POST", body: input });
    },
    get(id: string) {
      return apiFetch<Notebook>(`/notebooks/${id}`);
    },
    remove(id: string) {
      return apiFetch(`/notebooks/${id}`, { method: "DELETE" });
    },
  },

  documents: {
    upload(file: File, notebookId: string, type?: string) {
      const form = new FormData();
      form.append("file", file);
      form.append("notebookId", notebookId);
      if (type) form.append("type", type);
      return apiFetch<Document>("/documents/upload", { method: "POST", formData: form });
    },
    listByNotebook(notebookId: string) {
      return apiFetch<Document[]>(`/documents/notebook/${notebookId}`);
    },
    status(id: string) {
      return apiFetch<{
        id: string;
        status: string;
        progress?: number;
        stage?: string;
        errorMessage?: string;
      }>(`/documents/${id}/status`);
    },
    retry(id: string) {
      return apiFetch(`/documents/${id}/retry`, { method: 'POST' });
    },
    remove(id: string) {
      return apiFetch(`/documents/${id}`, { method: "DELETE" });
    },
  },

  chat: {
    ask(input: { notebookId: string; message: string }) {
      return apiFetch<ChatMessage>("/chat", { method: "POST", body: input });
    },
    history(notebookId: string) {
      return apiFetch<ChatMessage[]>(`/chat/history/${notebookId}`);
    },
  },

  preferences: {
    get() {
      return apiFetch<UserPreferences>("/preferences/me");
    },
    update(input: Partial<UserPreferences>) {
      return apiFetch<UserPreferences>("/preferences/me", { method: "PATCH", body: input });
    },
  },
};
