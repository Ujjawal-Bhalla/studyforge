# Pages

## Public Pages

- `client/app/page.js`: landing page with StudyForge title.
- `client/app/login/page.js`: login form and redirect to dashboard.
- `client/app/signup/page.js`: signup form then auto-login flow.

## Dashboard Pages

- `client/app/dashboard/page.js`: dashboard home placeholder.
- `client/app/dashboard/tasks/page.js`: task management (create, toggle, delete).
- `client/app/dashboard/pomodoro/page.js`: active timer with start/stop and history.
- `client/app/dashboard/journal/page.js`: journal entry CRUD view.
- `client/app/dashboard/settings/page.js`: profile update and destructive actions.

## Route Guards

- Pages inside dashboard rely on JWT in local storage.
- Missing token redirects user to `/login`.

