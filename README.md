# Interface Doctor — Phase 1: Dashboard & Upload

React + TypeScript + Tailwind (Vite). Run: `npm install && npm run dev`.

Included: responsive dashboard shell, sidebar nav (Dashboard, New Analysis, History, Settings), drag-and-drop/file-picker upload (PNG/JPG/JPEG, max 10 MB), preview, loading/error states, start-new-analysis reset, and a localStorage upload history (metadata only).

Not yet built: "Analyze Interface" shows a loading state then an honest "service not connected" message. FastAPI backend, AI analysis, redesign generation, comparison and code export come in later phases.


## Phase 2: FastAPI backend and AI analysis

- `npm install && npm run dev` starts Vite plus the FastAPI backend (`backend/`, port `API_PORT` or 3001). Python 3.10+ is required. Dependencies are pip-installed on first run.
- Add these in the Secrets panel (see `.env.example`): `AI_API_KEY`, `AI_BASE_URL` (any OpenAI-compatible provider), `AI_MODEL` (must support image input). Optional `DEMO_MODE=true` returns a clearly labeled empty demo result when no key is set.
- Endpoints: `GET /api/health`, `POST /api/analyze` (multipart `file`), `POST /api/generate` (multipart `file` and `analysis` JSON; the UI for it comes in a later phase).
- Uploads are checked server-side for type, magic bytes and size (5 MB max).
- Analysis results are validated and normalized server-side into a structured report (severity, location, recommended fix, usability reason, score breakdown, `mode` and disclaimer). Scores are clamped to 0–100; malformed model reports return a structured error rather than fabricated findings.
- API errors use `{ "error": { "code", "message" } }`; known codes include `MISSING_API_KEY`, `PROVIDER_ERROR`, `MALFORMED_MODEL_OUTPUT`, and `INVALID_FILE`. Demo responses use `mode: "demo"` and contain no invented findings or scores; the UI labels demo mode and withholds scoring breakdown.
