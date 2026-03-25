# Backend

This directory contains the Flask backend for the project.

The initial structure is intentionally small and ready for later expansion:

- `app/` holds the Flask application package
- `app/api/` contains versioned API routes
- `wsgi.py` is the production entrypoint

Current API shape:

- `GET /api/health`
- `GET /api/modes/state`
- `POST /api/modes/longing`
- `POST /api/modes/zen`
- `GET /api/demo-click` and `POST /api/demo-click` remain as compatibility aliases for the longing counter

The data layer keeps a single `DemoCounter` table and uses different `id` values to represent the different mode counters.