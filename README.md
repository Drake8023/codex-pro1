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
python -m flask --app wsgi:app run --host 127.0.0.1 --port 5000 --no-debugger --no-reload
```

With both services running, open `http://127.0.0.1:5173`. The frontend will proxy `/api/*` requests to the Flask backend on port `5000`.

## Production-style deployment

```bash
docker compose up -d --build
```

This starts:

- Nginx + static frontend on host port `5173`
- Flask API behind the frontend container on internal port `5000`

Public traffic goes through `http://<server-ip>:5173` on the frontend container, and `/api/*` requests are proxied to the backend service.

## Notes

The project name, domain model, and fuller documentation are still evolving. This repository is set up as a shared frontend/backend starting point with a simple production-style container deployment.