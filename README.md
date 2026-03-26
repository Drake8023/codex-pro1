# codex-pro1

This repository contains both the frontend and backend for the project.

## Structure

- `frontend/`: React + Vite + TypeScript client
- `backend/`: Flask API service
- `docker-compose.yml`: deployment entrypoint for the integrated app

## Current product surface

- Feed-first home page
- Email/password registration and login with cookie sessions
- Post creation with text and multi-image upload
- Profile page showing the signed-in user and their posts
- Floating ritual bubble with Longing and Zen pages

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
set SECRET_KEY=codex-local-session-secret
python -m flask --app wsgi:app run --host 127.0.0.1 --port 5000 --no-debugger --no-reload
```

With both services running, open `http://127.0.0.1:5173`. The frontend proxies `/api/*` requests to the backend on port `5000`, including auth, post, upload, and ritual endpoints.

If `UPLOAD_FOLDER` is not set locally, uploaded images fall back to `backend/instance/uploads`.

## API surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/<post_id>`
- `POST /api/uploads/images`
- `GET /api/modes/state`
- `POST /api/modes/longing`
- `POST /api/modes/zen`

## Production-style deployment

```bash
docker compose up -d --build
```

This starts:

- Nginx + static frontend on host port `5173`
- Flask API behind the frontend container on internal port `5000`
- PostgreSQL on server-local `127.0.0.1:5432`
- Persistent upload storage mounted into the backend container

Public traffic goes through `http://<server-ip>:5173` on the frontend container, and `/api/*` requests are proxied to the backend service.

## Database and storage

Default PostgreSQL settings used by Docker Compose:

- Host: `127.0.0.1`
- Port: `5432`
- Database: `codex_pro1`
- User: `codex`
- Password: `80238023`

Uploaded images are stored in the backend upload volume and exposed through backend-served `/api/uploads/<filename>` URLs.
