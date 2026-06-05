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

Run the two apps in separate terminals.

**Backend** (API on http://localhost:4000):

```bash
cd backend
npm install
npm run start:dev
```

**Frontend** (app on http://localhost:3000):

```bash
cd frontend
npm install
npm run dev
```

By default the frontend runs on mock data. To call the live backend, create
`frontend/.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

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
