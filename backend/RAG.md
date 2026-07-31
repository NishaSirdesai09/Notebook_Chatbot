# RAG setup (Qdrant + LLM)

## 1. Start Qdrant

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

## 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and set:

- `QDRANT_URL=http://localhost:6333`
- `OPENAI_API_KEY=sk-...` (or your provider key)

## 3. Configure LLM providers

Edit **`backend/config/llm.providers.json`** to add or change providers and models.
Each provider uses an **OpenAI-compatible** API (`/v1/chat/completions` and `/v1/embeddings`).

Example: add a custom endpoint:

```json
{
  "id": "my-llm",
  "name": "My LLM Server",
  "baseUrl": "https://api.example.com/v1",
  "apiKeyEnv": "MY_LLM_API_KEY",
  "models": [{ "id": "my-model", "name": "My Model", "default": true }]
}
```

Then set `MY_LLM_API_KEY` in `backend/.env`.

## 4. Run the stack

```bash
# Backend
cd backend && npm install && npx prisma migrate dev && npm run start:dev

# Frontend (requires API)
cd frontend && npm install
cp .env.example .env.local
npm run dev
```

## 5. User model selection

Users pick their LLM under **Settings → AI Preferences**. Choices come from `llm.providers.json`.

## RAG flow

1. **Upload** PDF/TXT → stored on disk → text extracted → chunked → embedded → stored in **Qdrant**
2. **Chat** → question embedded → Qdrant retrieval (notebook-scoped, professor refs boosted) → **LLM** with context → cited answer saved to SQLite
