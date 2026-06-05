# Notebook Chatbot

An AI-powered educational platform where students upload textbooks, PDFs, lecture
notes, Canvas course materials, and reference links, then **chat with that content**
like a personal study assistant. Every answer is grounded in the user's own
materials and cites the exact page, chapter, or slide it came from.

Built as a polished, production-style SaaS frontend with **Next.js, TypeScript,
and Tailwind CSS**, structured to plug into a NestJS backend.

## Features

- **Landing page** — hero, problem/solution, features, how-it-works, benefits,
  Canvas integration, comparison, pricing, FAQ, and CTA sections.
- **Auth** — Sign Up (with role selection), Sign In, and a 4-step onboarding flow.
- **Dashboard** — overview stats, recent notebooks, activity, continue-studying,
  suggested revision, and recent uploads.
- **My Notebooks** — searchable/filterable notebook cards with status, plus a
  Create Notebook modal.
- **Upload Material** — drag-and-drop with file validation and a live processing
  pipeline (extract → chunk → embed → index → ready), plus link & YouTube ingest.
- **Chat** — 3-pane layout (sources · conversation · citations), streaming
  responses, suggested prompts, structured answers (direct answer, simple
  explanation, key points, citations, practice question), copy/regenerate/save/
  feedback actions, and a click-through **Document Viewer** with highlighted source.
- **Summaries · Quizzes · Flashcards** — generate study artifacts from material;
  full quiz-taking flow with scoring and explanations; flip-card decks with
  known/review tracking.
- **Canvas Sync** — connect via API token, select courses, choose what to sync,
  and resync with timestamps.
- **Reference Links** — add and index external resources in a table.
- **Analytics** — student and professor views with charts and weak-area insights.
- **Settings** — profile, password, notifications, connected Canvas, AI response
  preference, and study modes (Beginner / Exam / Technical / Quick Revision).
- **Professor Dashboard** — course notebooks, question trends, weak areas, and
  content usage.
- **Design system** — consistent buttons, cards, inputs, modals, toasts, badges,
  and loading / empty / error states. Responsive and mobile-friendly.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) with a custom design system
- Inline SVG icon set (no icon dependency)
- `clsx` + `tailwind-merge` for class composition

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Suggested walkthrough: Landing → **Get Started** → onboarding → **Dashboard** →
**Create Notebook** → **Upload Material** → **Chat** (click a citation to open the
Document Viewer).

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    signin/ signup/       # Auth pages
    onboarding/           # Onboarding steps
    (app)/                # Authenticated app (sidebar + topbar shell)
      dashboard/ notebooks/ upload/ chat/
      summaries/ quizzes/ flashcards/
      canvas/ references/ analytics/ settings/ professor/
  components/
    ui/                   # Design system (Button, Modal, Toast, primitives, states)
    app/                  # App shell (Sidebar, Topbar, cards, viewers)
    marketing/            # Public nav, footer, hero preview, auth shell
    icons.tsx             # Inline SVG icon set
  lib/
    api/                  # NestJS-ready API client + typed endpoints
    mock-data.ts          # Mock data powering the UI
    types.ts  nav.ts  utils.ts
```

## Connecting a Backend

The frontend talks to the backend through a single boundary in `src/lib/api/`.
Each method in `endpoints.ts` maps 1:1 to a planned NestJS route and currently
resolves mock data. Set `NEXT_PUBLIC_API_URL` (see `.env.example`) to switch from
mock mode to live requests.

Assumed routes:

| Area       | Routes |
|------------|--------|
| Auth       | `POST /auth/signup` · `POST /auth/login` · `POST /auth/logout` |
| Notebook   | `GET /notebooks` · `POST /notebooks` · `GET /notebooks/:id` · `DELETE /notebooks/:id` |
| Upload     | `POST /documents/upload` · `GET /documents/:id/status` |
| Chat       | `POST /chat` · `GET /chat/history/:notebookId` |
| Summary    | `POST /summaries/generate` |
| Quiz       | `POST /quizzes/generate` |
| Canvas     | `POST /canvas/connect` · `GET /canvas/courses` · `POST /canvas/sync` |
| References | `POST /references` · `GET /references` |

Designed to later integrate with PostgreSQL, S3, a vector database, an
OpenAI/LangChain pipeline, and the Canvas API.
