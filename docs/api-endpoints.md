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
- `PUT /pomodoro/end/:id` (protected)
- `GET /pomodoro` (protected)
- `GET /pomodoro/total` (protected)
- `DELETE /pomodoro/reset` (protected)

## Journal (`/journal`)

- `POST /journal` (protected)
  - body: `{ "content": "Today's reflection..." }`
- `GET /journal` (protected)
- `PUT /journal/:id` (protected)
  - body: `{ "content": "Updated entry" }`
- `DELETE /journal/:id` (protected)

