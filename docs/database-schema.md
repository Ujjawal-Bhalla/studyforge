# Database Schema

The backend uses PostgreSQL. The schema below is inferred from SQL used in `server/models/`.

## Tables

### `users`

- `id` (primary key)
- `email` (unique, required)
- `password` (hashed, required)
- `name` (required)

### `tasks`

- `id` (primary key)
- `user_id` (foreign key -> `users.id`)
- `title` (required)
- `completed` (boolean, default `false`)
- `created_at` (timestamp)

### `pomodoro_sessions`

- `id` (primary key)
- `user_id` (foreign key -> `users.id`)
- `start_time` (timestamp)
- `end_time` (timestamp, nullable for active session)
- `duration` (seconds, numeric/integer)

### `journal_entries`

- `id` (primary key)
- `user_id` (foreign key -> `users.id`)
- `content` (text, required)
- `created_at` (timestamp)

## Suggested SQL (Starter)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE pomodoro_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP NULL,
  duration INTEGER
);

CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

