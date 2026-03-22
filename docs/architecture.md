# Architecture

StudyForge is split into two apps:

- `client/`: Next.js frontend (App Router) with local JWT storage.
- `server/`: Express API with PostgreSQL persistence.

## High-Level Flow

1. User signs up or logs in.
2. API returns a JWT.
3. Frontend stores token in `localStorage`.
4. Frontend sends token as `Authorization: Bearer <token>`.
5. Express middleware validates token and attaches `req.user`.
6. Controllers call model functions, models execute SQL on PostgreSQL.

## Main Domains

- Authentication and account settings
- Tasks
- Pomodoro sessions
- Journal entries

