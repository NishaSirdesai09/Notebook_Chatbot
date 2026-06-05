# Notebook Chatbot — Backend (NestJS)

REST API for **Notebook Chatbot**, the AI study assistant that answers questions
grounded in a student's uploaded course materials.

Built with **NestJS + TypeScript**. Ships with in-memory stores and seed data so
every endpoint is runnable immediately, structured to swap in PostgreSQL, S3, a
vector database, an OpenAI/LangChain pipeline, and the Canvas API.

## Getting Started

```bash
npm install
cp .env.example .env   # optional; sensible defaults are used otherwise
npm run start:dev
```

API runs on [http://localhost:4000](http://localhost:4000). CORS is enabled for the
frontend at `http://localhost:3000` (configurable via `CORS_ORIGIN`).

Health check: `GET /health`.

## API Routes

| Area       | Method & Path | Description |
|------------|---------------|-------------|
| Auth       | `POST /auth/signup` | Create an account |
|            | `POST /auth/login` | Authenticate |
|            | `POST /auth/logout` | End session |
| Notebooks  | `GET /notebooks` | List notebooks |
|            | `POST /notebooks` | Create a notebook |
|            | `GET /notebooks/:id` | Get one notebook |
|            | `DELETE /notebooks/:id` | Delete a notebook |
| Documents  | `POST /documents/upload` | Register an uploaded document |
|            | `GET /documents/:id/status` | Poll processing pipeline status |
| Chat       | `POST /chat` | Ask a question (grounded in material) |
|            | `GET /chat/history/:notebookId` | Conversation history |
| Summaries  | `POST /summaries/generate` | Generate a summary |
| Quizzes    | `POST /quizzes/generate` | Generate quiz questions |
| Canvas     | `POST /canvas/connect` | Connect via API token |
|            | `GET /canvas/courses` | List Canvas courses |
|            | `POST /canvas/sync` | Sync selected courses |
| References | `GET /references` | List reference links |
|            | `POST /references` | Add a reference link |

## Structure

```
src/
  main.ts                # bootstrap, CORS, global validation
  app.module.ts          # root module wiring all features
  app.controller.ts      # health check
  common/
    types.ts             # shared domain types
    seed.ts              # in-memory seed data
  modules/
    auth/  notebooks/  documents/  chat/
    summaries/  quizzes/  canvas/  references/
      *.controller.ts    # route handlers
      *.service.ts       # business logic (in-memory store)
      *.module.ts        # Nest module
      dto/*.dto.ts       # request validation (class-validator)
```

## Going to Production

Each service contains `TODO` comments marking integration points:

- **PostgreSQL** — replace in-memory arrays/maps with repositories (TypeORM/Prisma).
- **S3** — store uploaded files; `documents.upload` returns the record to track.
- **Vector DB** — embed and index chunks; `chat.ask` retrieves top-k context.
- **OpenAI / LangChain** — generate grounded answers, summaries, and quizzes.
- **Canvas API** — validate tokens and pull course files/modules/assignments.
- **Auth** — hash passwords and issue real JWTs (`@nestjs/jwt`, `JWT_SECRET`).
