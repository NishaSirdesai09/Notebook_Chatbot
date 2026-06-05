/**
 * Typed API endpoints mirroring the planned NestJS routes.
 *
 *  Auth:       POST /auth/signup · POST /auth/login · POST /auth/logout
 *  Notebook:   GET /notebooks · POST /notebooks · GET /notebooks/:id · DELETE /notebooks/:id
 *  Upload:     POST /documents/upload · GET /documents/:id/status
 *  Chat:       POST /chat · GET /chat/history/:notebookId
 *  Summary:    POST /summaries/generate
 *  Quiz:       POST /quizzes/generate
 *  Canvas:     POST /canvas/connect · GET /canvas/courses · POST /canvas/sync
 *  References: POST /references · GET /references
 *
 * Each function currently returns mock data (USE_MOCK), but the signature and
 * route comment make swapping in `apiFetch` a one-line change per method.
 */
import { apiFetch, USE_MOCK } from "@/lib/api/client";
import { sleep } from "@/lib/utils";
import * as mock from "@/lib/mock-data";
import type {
  ChatMessage,
  Notebook,
  Role,
  Summary,
  User,
} from "@/lib/types";

export const api = {
  auth: {
    // POST /auth/signup
    async signup(input: { name: string; email: string; password: string; role: Role }): Promise<User> {
      if (USE_MOCK) {
        await sleep(700);
        return { id: "u_new", name: input.name, email: input.email, role: input.role };
      }
      return apiFetch<User>("/auth/signup", { method: "POST", body: input });
    },
    // POST /auth/login
    async login(input: { email: string; password: string }): Promise<User> {
      if (USE_MOCK) {
        await sleep(600);
        return { ...mock.currentUser, email: input.email };
      }
      return apiFetch<User>("/auth/login", { method: "POST", body: input });
    },
    // POST /auth/logout
    async logout(): Promise<void> {
      if (USE_MOCK) return;
      await apiFetch("/auth/logout", { method: "POST" });
    },
  },

  notebooks: {
    // GET /notebooks
    async list(): Promise<Notebook[]> {
      if (USE_MOCK) {
        await sleep(300);
        return mock.notebooks;
      }
      return apiFetch<Notebook[]>("/notebooks");
    },
    // POST /notebooks
    async create(input: Partial<Notebook>): Promise<Notebook> {
      if (USE_MOCK) {
        await sleep(800);
        return {
          id: `nb_${Date.now()}`,
          title: input.title ?? "Untitled Notebook",
          course: input.course ?? "",
          description: input.description ?? "",
          subject: input.subject ?? "General",
          visibility: input.visibility ?? "Private",
          files: 0,
          status: "Processing",
          updatedAt: new Date().toISOString(),
          color: "from-brand-500 to-accent-purple",
          questionsAsked: 0,
        };
      }
      return apiFetch<Notebook>("/notebooks", { method: "POST", body: input });
    },
    // GET /notebooks/:id
    async get(id: string): Promise<Notebook | undefined> {
      if (USE_MOCK) {
        await sleep(200);
        return mock.notebooks.find((n) => n.id === id);
      }
      return apiFetch<Notebook>(`/notebooks/${id}`);
    },
    // DELETE /notebooks/:id
    async remove(id: string): Promise<void> {
      if (USE_MOCK) {
        await sleep(400);
        return;
      }
      await apiFetch(`/notebooks/${id}`, { method: "DELETE" });
    },
  },

  documents: {
    // POST /documents/upload
    async upload(_file: { name: string; notebookId: string }): Promise<{ id: string }> {
      if (USE_MOCK) {
        await sleep(500);
        return { id: `d_${Date.now()}` };
      }
      return apiFetch("/documents/upload", { method: "POST", body: _file });
    },
    // GET /documents/:id/status
    async status(id: string): Promise<{ id: string; status: string }> {
      if (USE_MOCK) return { id, status: "ready" };
      return apiFetch(`/documents/${id}/status`);
    },
  },

  chat: {
    // POST /chat
    async ask(input: { notebookId: string; message: string }): Promise<ChatMessage> {
      if (USE_MOCK) {
        await sleep(400);
        return mock.chatHistory[1];
      }
      return apiFetch<ChatMessage>("/chat", { method: "POST", body: input });
    },
    // GET /chat/history/:notebookId
    async history(_notebookId: string): Promise<ChatMessage[]> {
      if (USE_MOCK) return mock.chatHistory;
      return apiFetch<ChatMessage[]>(`/chat/history/${_notebookId}`);
    },
  },

  summaries: {
    // POST /summaries/generate
    async generate(input: { notebookId: string; type: string }): Promise<Summary> {
      if (USE_MOCK) {
        await sleep(1200);
        return { ...mock.summaries[0], id: `s_${Date.now()}`, type: input.type };
      }
      return apiFetch<Summary>("/summaries/generate", { method: "POST", body: input });
    },
  },

  quizzes: {
    // POST /quizzes/generate
    async generate(input: { notebookId: string; count: number; difficulty: string; type: string }) {
      if (USE_MOCK) {
        await sleep(1400);
        return mock.quizQuestions;
      }
      return apiFetch("/quizzes/generate", { method: "POST", body: input });
    },
  },

  canvas: {
    // POST /canvas/connect
    async connect(_input: { token: string }) {
      if (USE_MOCK) {
        await sleep(900);
        return { connected: true };
      }
      return apiFetch("/canvas/connect", { method: "POST", body: _input });
    },
    // GET /canvas/courses
    async courses() {
      if (USE_MOCK) {
        await sleep(500);
        return mock.canvasCourses;
      }
      return apiFetch("/canvas/courses");
    },
    // POST /canvas/sync
    async sync(_input: { courseIds: string[] }) {
      if (USE_MOCK) {
        await sleep(1600);
        return { syncedAt: new Date().toISOString() };
      }
      return apiFetch("/canvas/sync", { method: "POST", body: _input });
    },
  },

  references: {
    // GET /references
    async list() {
      if (USE_MOCK) return mock.referenceLinks;
      return apiFetch("/references");
    },
    // POST /references
    async add(input: { url: string; title: string; category: string }) {
      if (USE_MOCK) {
        await sleep(700);
        return {
          id: `r_${Date.now()}`,
          ...input,
          status: "Indexing" as const,
          addedAt: new Date().toISOString(),
        };
      }
      return apiFetch("/references", { method: "POST", body: input });
    },
  },
};
