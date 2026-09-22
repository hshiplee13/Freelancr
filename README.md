# Freelancr — Project Scaffold

Full-stack scaffold matching the technical document: Next.js (TypeScript) frontend,
Django REST API, Django backend, PostgreSQL database.

## Structure

```
freelancr/
├── backend/          Django + DRF
│   ├── freelancr/    project settings, urls
│   └── core/          models, serializers, views, urls (the one Django app so far)
└── frontend/          Next.js (App Router) + TypeScript + Tailwind
    └── src/
        ├── app/        landing, login, signup, workspace pages
        └── lib/api.ts   API client (JWT auth)
```

## What's implemented

**Backend models** (`core/models.py`): `User` (custom, with `role`), `Client`,
`Project`, `Meeting`, `Transcript`, `ScopeOfTruth`, `Payment` — matching the data
design in the technical document.

**API endpoints** (`core/urls.py`), all under `/api/`:
- `POST /auth/signup/`, `POST /auth/login/`, `POST /auth/refresh/`, `GET /auth/me/`
- Full CRUD: `/clients/`, `/projects/`, `/meetings/`, `/transcripts/`, `/payments/`
- Read-only: `/scope-of-truth/`

Auth uses JWT (`djangorestframework-simplejwt`). All list/detail endpoints are
scoped to the logged-in user via `get_queryset()`.

**Frontend pages**: landing page, login, signup, and a workspace dashboard that
fetches clients and projects from the API and requires auth (redirects to
`/login` if the token is missing or invalid).

## What's NOT implemented yet

- AI transcript analysis (the "scope of truth" generation itself) — the model
  and endpoint exist, but nothing populates `summary`/`key_points` yet. This is
  where you'd call an LLM API, likely from an async task.
- Payment gateway integration (Stripe/etc.) — model and endpoint exist, no
  provider wired up.
- Email notifications.
- File upload handling for transcripts is stubbed via DRF's `FileField`, but
  there's no processing pipeline behind it.
- Client/project "add" buttons on the dashboard are placeholders (no forms yet).

## Running it locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env   # then edit DB credentials to match your local Postgres
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Requires a running PostgreSQL instance with a database matching your `.env`
(`DB_NAME`, `DB_USER`, `DB_PASSWORD`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`, expects the API at `http://localhost:8000/api`
(override with `NEXT_PUBLIC_API_URL` in a `.env.local` file if needed).

## Suggested next steps

1. Add forms for creating clients/projects/meetings from the dashboard.
2. Wire up transcript upload to actually store the file and text.
3. Pick an LLM provider and build the async job that turns a transcript into a
   scope of truth (Celery + Redis is the common Django pairing for this).
4. Add tests for the auth flow and the ownership-scoping on querysets.
