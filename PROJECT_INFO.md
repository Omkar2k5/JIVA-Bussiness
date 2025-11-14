# Project Info

## Overview

Jiva project with a Next.js admin web frontend, a Python FastAPI backend, and a MySQL database. The backend will serve both web and Android clients with documented REST APIs.

## Current State

- Frontend (Next.js)
  - Location: `Super-Admin Web/`
  - Uses dummy data for admin pages (e.g., dashboard, users, reports).
  - Dev scripts in `Super-Admin Web/package.json` (build, dev, lint, start).
  - API base URL reads `NEXT_PUBLIC_API_URL` with fallback `http://localhost:3001/api` (`Super-Admin Web/lib/api-client.ts:3`).
  - JWT is attached to requests when present (`Super-Admin Web/lib/auth.ts:26`).

- Backend (FastAPI)
  - Location: `backend/app/`
  - App metadata set in `app/main.py:12` and served on port `3001` in dev (`app/main.py:115`).
  - API prefix configured as `"/api"` (`backend/app/config.py:21`).
  - CORS allows `http://localhost:3000` by default (`backend/app/config.py:22`).
  - Swagger UI available at `http://localhost:3001/docs` (`backend/README.md:88-90`).
  - Example endpoints included for admin login, users, reports, and subscriptions (`backend/app/main.py:60-71, 75-113`).

- Database (MySQL)
  - Connection via `DATABASE_URL` and related env vars in `.env` (`backend/app/config.py:8-14, 31-33`).
  - SQLAlchemy engine/session defined (`backend/app/database.py:6-14`).
  - Alembic migrations configured (`backend/README.md:49-60, 114-128`).

## Aim

- Prepare for production deployment on an actual server.
- Use the FastAPI backend as the single source of truth to serve both web and Android.
- Expose and document all endpoints via Swagger so Android consumes them reliably.
- Host Next.js admin frontend connected to the same FastAPI API base.
- Use MySQL in production with proper environment configuration and migrations.