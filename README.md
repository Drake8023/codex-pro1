# codex-pro1

This repository contains both the frontend and backend for the project.

## Structure

- `frontend/`: React + Vite + TypeScript client
- `backend/`: Flask API service
- `docker-compose.yml`: deployment entrypoint for the integrated app

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Backend:

```bash
cd backend
set DATABASE_URL=postgresql+psycopg://codex:80238023@127.0.0.1:5432/codex_pro1
python -m flask --app wsgi:app run --host 127.0.0.1 --port 5000 --no-debugger --no-reload
```

With both services running, open `http://127.0.0.1:5173`. The frontend will proxy `/api/*` requests to the backend on port `5000`.

## Production-style deployment

```bash
docker compose up -d --build
```

This starts:

- Nginx + static frontend on host port `5173`
- Flask API behind the frontend container on internal port `5000`
- PostgreSQL on server-local `127.0.0.1:5432`

Public traffic goes through `http://<server-ip>:5173` on the frontend container, and `/api/*` requests are proxied to the backend service.

## Database

Default PostgreSQL settings used by Docker Compose:
