# API Endpoints

Base URL: `http://localhost:5000/api`

Protected routes require:

```http
Authorization: Bearer <jwt>
```

## Auth (`/auth`)

- `POST /auth/signup`
  - body: `{ "name": "User", "email": "a@b.com", "password": "secret" }`
- `POST /auth/login`
  - body: `{ "email": "a@b.com", "password": "secret" }`
  - returns token + user payload
- `GET /auth/protected` (protected)
- `PUT /auth/name` (protected)
  - body: `{ "name": "New Name" }`
- `DELETE /auth/delete` (protected)

## Tasks (`/tasks`)

- `POST /tasks` (protected)
  - body: `{ "title": "Read chapter 3" }`
- `GET /tasks` (protected)
- `PUT /tasks/:id` (protected)
  - body: `{ "completed": true }`
- `DELETE /tasks/:id` (protected)

## Pomodoro (`/pomodoro`)

- `POST /pomodoro/start` (protected)
  - body examples:
    - `{ "modeType": "pomodoro", "presetKey": "classic", "phaseType": "focus" }`
    - `{ "modeType": "custom_timer", "phaseType": "custom", "targetDuration": 1500 }`
    - `{ "modeType": "stopwatch", "phaseType": "stopwatch" }`
- `GET /pomodoro/active` (protected)
  - returns the active or paused session, focus streak, suggested next phase, and total tracked time
- `PUT /pomodoro/pause/:id` (protected)
- `PUT /pomodoro/resume/:id` (protected)
- `PUT /pomodoro/end/:id` (protected)
  - body: `{ "outcome": "completed" | "cancelled" }`
- `GET /pomodoro` (protected)
  - returns completed Pomodoro, Custom Timer, and Stopwatch sessions
- `GET /pomodoro/total` (protected)
  - returns total completed tracked time
- `DELETE /pomodoro/reset` (protected)

## Journal (`/journal`)

- `POST /journal` (protected)
  - body: `{ "content": "Today's reflection..." }`
- `GET /journal` (protected)
- `PUT /journal/:id` (protected)
  - body: `{ "content": "Updated entry" }`
- `DELETE /journal/:id` (protected)
