# Notebook Chatbot — Repository Audit (Phase 1)

**Date:** August 2026  
**Scope:** Full-stack audit before Milestone 1 implementation

---

## Stack Summary

| Layer | Technology | Version / Location |
|-------|------------|-------------------|
| Frontend | Next.js (App Router) | 14.2.15 — `frontend/` |
| Backend | NestJS | 10.4.4 — `backend/` |
| ORM | Prisma | 5.22.0 — SQLite today → PostgreSQL (M1) |
| Vector DB | Qdrant | Docker :6333 |
| Embeddings | Ollama | `nomic-embed-text` (768d) |
| Chat LLM | DashLab / Ollama / OpenAI | `backend/config/llm.providers.json` |
| File storage | Local disk | `UPLOAD_DIR` |
| Tests | None | Jest script exists, 0 test files |
| Docker | Qdrant manual only | No compose / Dockerfiles |

---

## Working Core Flow

```
Sign up → Create notebook → Upload PDF/TXT → Index in Qdrant → Chat with citations
```

This path is **real and functional** when Qdrant, Ollama, and an LLM key are available.

---

## Frontend Routes

| Route | Status |
|-------|--------|
| `/`, `/signin`, `/signup`, `/onboarding` | Live / static |
| `/dashboard`, `/notebooks`, `/upload`, `/chat` | Wired to API |
| `/settings` | Partial (study prefs + misplaced LLM config) |
| `/analytics`, `/professor` | Hardcoded demo data |
| `/summaries`, `/quizzes`, `/flashcards`, `/canvas`, `/references` | “Coming soon” shells |

Nav: Dashboard, Notebooks, Upload, Chat, Settings only.

---

## Backend Endpoints (pre-M1)

| Method | Path | Guarded? |
|--------|------|----------|
| GET | `/health` | Public |
| POST | `/auth/signup`, `/login`, `/logout` | Public |
| CRUD | `/notebooks/*` | **No** |
| CRUD | `/documents/*` | **No** |
| POST/GET | `/chat/*` | **No** |
| GET/PATCH | `/settings/*` | **No** |
| POST | `/summaries/generate`, `/quizzes/generate` | Not implemented |
| Canvas, References | Various | Stub / in-memory |

---

## Database (SQLite → PostgreSQL in M1)

**Current models:** User, UserSettings, Notebook, Document, ChatMessage, Citation, Summary, QuizQuestion, ReferenceLink, CanvasCourse

**Unused tables:** Summary, QuizQuestion, ReferenceLink, CanvasCourse (no writes)

**Gaps vs target schema:** ChatSession, DocumentChunk, IngestionJob, proper citation FK to Document — planned Milestones 2–3.

---

## Critical Security Issues (M1 fixes)

1. **Plaintext passwords** — `auth.service.ts`
2. **Fake tokens** — `token.{userId}`, no JWT
3. **No route guards** — all APIs public
4. **Client-supplied userId** — trusted on chat, notebooks, settings
5. **No notebook ownership checks**
6. **Student API keys in Settings** — wrong product boundary

---

## Architectural Risks

| Risk | Impact |
|------|--------|
| Sync ingestion in upload handler | Timeouts on large PDFs (M2: BullMQ) |
| Approximate PDF page split | Wrong citation pages (M2: page-aware extraction) |
| No streaming chat | Poor UX (M4: SSE) |
| SQLite | Not production-ready (M1: PostgreSQL) |
| No tests | Regressions undetected (M5) |
| README drift | Onboarding confusion |

---

## Prioritized Task List

### Critical (Milestone 1 — in progress)

- [x] Repository audit
- [ ] bcrypt password hashing
- [ ] JWT access + refresh tokens
- [ ] Auth guards on all protected routes
- [ ] Service-layer ownership authorization
- [ ] PostgreSQL migration + docker-compose
- [ ] Remove LLM/API keys from student Settings
- [ ] Frontend session restore via `GET /auth/me`
- [ ] Clean `.env.example`

### High Priority (Milestone 2)

- Redis + BullMQ ingestion worker
- Storage abstraction (local + S3-compatible)
- Page-aware PDF extraction
- IngestionJob model + progress stages
- Retry / idempotent Qdrant indexing

### High Priority (Milestone 3)

- Retrieval service (threshold, dedup, filters)
- Citation markers [S1], [S2]
- Grounded refusal enforcement
- Chat sessions model

### High Priority (Milestone 4)

- SSE streaming chat
- PDF viewer + citation navigation
- Notebook workspace UX

### Medium Priority (Milestone 5)

- Structured logging + health/ready endpoints
- Rate limiting
- Unit + integration + E2E tests
- Dockerfiles + deployment docs

### Future (Milestone 6+)

- Cited summaries, quizzes, flashcards
- Canvas integration
- Admin configuration panel

---

## Milestone 1 Files to Modify

**Backend:** `auth/*`, `common/guards/*`, `common/decorators/*`, `notebooks/*`, `documents/*`, `chat/*`, `settings/*`, `prisma/schema.prisma`, `.env.example`, `app.module.ts`

**Frontend:** `AuthContext.tsx`, `api/endpoints.ts`, `api/client.ts`, `settings/page.tsx`, contexts removing userId query params

**Infra:** `docker-compose.yml`, `docs/AUDIT.md`

---

## Product Rules (unchanged)

1. Answers from uploaded materials only  
2. Citations from retrieved chunks only  
3. Page numbers from document processing, not LLM  
4. Retrieval scoped to user + notebook  
5. No API keys in frontend  
6. No placeholder data presented as real  
