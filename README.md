# codex-pro1

This repository contains both the frontend and backend for the project.

## Structure

- `frontend/`: React + Vite + TypeScript client
- `backend/`: Flask API service
- `docker-compose.yml`: local multi-service startup for the integrated app

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python wsgi.py
```

With both services running, open `http://localhost:5173`. The frontend will proxy `/api/*` requests to the Flask backend on port `5000`.

## Docker-based startup

```bash
docker compose up --build
```

This starts:

- frontend on `http://localhost:5173`
- backend on `http://localhost:5000`

## Notes

The project name, domain model, and fuller documentation are still evolving. This repository is now set up as a shared frontend/backend starting point so feature work and deployment hardening can continue from a single place.