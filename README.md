# Notebook Chatbot

An AI-powered educational platform where students upload textbooks, PDFs, lecture
notes, Canvas course materials, and reference links, then **chat with that content**
like a personal study assistant. Every answer is grounded in the user's own
materials and cites the exact page, chapter, or slide it came from.

This repository is a monorepo with two independent apps:

```
Chatbot-Book/
├── frontend/   # Next.js + TypeScript + Tailwind CSS (SaaS dashboard UI)
└── backend/    # NestJS + TypeScript REST API
```

## Quick Start

**Full audit and roadmap:** see [`docs/AUDIT.md`](docs/AUDIT.md).

You need **4 things** running (each in its own terminal unless noted):

| # | Service | Port | Purpose |
|---|---------|------|---------|
| 1 | **Qdrant** (Docker) | 6333 | Vector search over uploaded PDFs |
| 2 | **Ollama** | 11434 | Free local embeddings (no OpenAI key) |
| 3 | **Backend** (NestJS) | 4000 | API, auth, RAG pipeline |
| 4 | **Frontend** (Next.js) | 3000 | Web UI |

Open **http://localhost:3000** in your browser (not a file path).

### One-time setup

```bash
# 1. Start infrastructure (PostgreSQL, Qdrant, Redis)
docker compose up postgres qdrant redis -d

# 2. Install dependencies (from repo root)
cd backend && npm install
cd ../frontend && npm install

# 3. Environment files
cp backend/.env.example backend/.env          # add DASHLAB_API_KEY
cp frontend/.env.example frontend/.env.local

# 4. Database (PostgreSQL — requires docker compose postgres)
cd backend
npx prisma migrate dev

# 4. Ollama (free local embeddings — one-time model download)
# Install from https://ollama.com then:
ollama pull nomic-embed-text
# Ollama runs in the background after install (tray icon on Windows)
```

### Every time you run the project

**Terminal 1 — Infrastructure** (PostgreSQL + Qdrant + Redis):

```bash
docker compose up postgres qdrant redis -d
```

**Terminal 2 — Backend**:

```bash
cd backend
npm run start:dev
# → http://localhost:4000/health should return {"status":"ok"}
```

**Terminal 3 — Frontend**:

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### API keys (`backend/.env`)

| Variable | Required? | Used for |
|----------|-----------|----------|
| `DASHLAB_API_KEY` | Yes (for chat) | GLM / Gemma answers via dashlab.studio |
| `OPENAI_API_KEY` | No | Only if you switch embeddings back to OpenAI |
| `DATABASE_URL` | Auto | SQLite file at `backend/prisma/dev.db` |
| `JWT_SECRET` | Yes | Auth tokens |

You can also save your DashLab key in the app: **Sign in → Settings → AI Preferences**.

### Troubleshooting

- **Unstyled HTML / ChunkLoadError**: delete `frontend/.next`, restart frontend, hard-refresh (`Ctrl+Shift+R`).
- **Port already in use**: stop old Node processes on 3000 or 4000, then restart.
- **Qdrant warning in backend logs**: start Docker Desktop, then run the Qdrant docker command above.
- **Upload/index fails**: ensure Ollama is running and `nomic-embed-text` is pulled.

See [`backend/RAG.md`](backend/RAG.md) for the full RAG pipeline details.

---

## Legacy quick start (minimal — chat only, no upload search)

```bash
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev
```

Or from the repo root: `npm run install:all` then `npm run dev`.

By default the frontend calls the backend at `http://localhost:4000`. Copy
`frontend/.env.example` to `frontend/.env.local` if you need a different API URL.

## What's Inside

### Frontend (`frontend/`)
Landing page, auth + onboarding, and a full authenticated app: dashboard,
notebooks, upload pipeline, 3-pane chat with citations and a document viewer,
summaries, quizzes, flashcards, Canvas sync, references, analytics, settings, and
a professor dashboard — backed by a consistent design system. See
[`frontend/README.md`](frontend/README.md).

### Backend (`backend/`)
NestJS REST API with modules for auth, notebooks, documents, chat, summaries,
quizzes, canvas, and references. Runnable with in-memory seed data and structured
to integrate PostgreSQL, S3, a vector database, an OpenAI/LangChain pipeline, and
the Canvas API. See [`backend/README.md`](backend/README.md).

## Architecture

The frontend talks to the backend through a single boundary
(`frontend/src/lib/api/`). Each method maps 1:1 to a NestJS route, so switching
from mock mode to live requests is a single environment variable.

Planned production integrations: **PostgreSQL** (data), **S3** (file storage),
**vector database** (retrieval), **OpenAI/LangChain** (generation), and the
**Canvas API** (course sync).
