# Modules

## Frontend Modules

- `client/lib/api.js`
  - Exposes API base URL (`http://localhost:5000/api`).
- `client/lib/apiClient.js`
  - Wrapper around `fetch` with token header and JSON parsing.
  - Exposes `api.get`, `api.post`, `api.put`, and `api.delete`.
- `client/lib/auth.js`
  - Reads JWT from `localStorage`.
  - Decodes JWT payload with `jwt-decode`.
- `client/lib/pomodoroApi.js`
  - Pomodoro-specific helper (`getPomodoroHistory`).

## Backend Modules

- `server/config/db.js`
  - PostgreSQL pool initialization via environment variables.
- `server/middleware/authMiddleware.js`
  - Validates bearer token and injects `req.user`.
- `server/routes/*.js`
  - API route maps for auth, tasks, pomodoro, journal.
- `server/controllers/*.js`
  - Validation + request handling.
- `server/models/*.js`
  - SQL query functions for each domain.

## Note

- Some frontend pages call `api.del(...)`, but `apiClient` currently exposes `api.delete(...)`. Keep names consistent during future cleanup.

