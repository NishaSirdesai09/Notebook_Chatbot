import { apiFetch, setAccessToken, clearAccessToken } from "@/lib/api/client";
import type {
  ChatMessage,
  Document,
  LlmCatalog,
  Notebook,
  Role,
  User,
  UserSettings,
} from "@/lib/types";

export const api = {
  auth: {
    async signup(input: { name: string; email: string; password: string; role: Role }) {
      const res = await apiFetch<{ user: User; accessToken: string }>("/auth/signup", {
        method: "POST",
        body: input,
      });
      setAccessToken(res.accessToken);
      return res.user;
    },
    async login(input: { email: string; password: string }) {
      const res = await apiFetch<{ user: User; accessToken: string }>("/auth/login", {
        method: "POST",
        body: input,
      });
      setAccessToken(res.accessToken);
      return res.user;
    },
    async logout() {
      clearAccessToken();
      await apiFetch("/auth/logout", { method: "POST" });
    },
  },

  notebooks: {
    list(userId?: string) {
      const q = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      return apiFetch<Notebook[]>(`/notebooks${q}`);
    },
    create(input: Partial<Notebook> & { userId?: string }) {
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
      return apiFetch<{ id: string; status: string; errorMessage?: string }>(`/documents/${id}/status`);
    },
    remove(id: string) {
      return apiFetch(`/documents/${id}`, { method: "DELETE" });
    },
  },

  chat: {
    ask(input: {
      notebookId: string;
      message: string;
      userId?: string;
      llmProviderId?: string;
      llmModelId?: string;
    }) {
      return apiFetch<ChatMessage>("/chat", { method: "POST", body: input });
    },
    history(notebookId: string) {
      return apiFetch<ChatMessage[]>(`/chat/history/${notebookId}`);
    },
  },

  settings: {
    llmCatalog() {
      return apiFetch<LlmCatalog[]>("/settings/llm/catalog");
    },
    get(userId: string) {
      return apiFetch<UserSettings>(`/settings/${userId}`);
    },
    update(userId: string, input: Partial<UserSettings> & { llmApiKey?: string }) {
      return apiFetch<UserSettings>(`/settings/${userId}`, { method: "PATCH", body: input });
    },
  },
};
