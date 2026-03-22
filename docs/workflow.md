# Workflow

## User Journey

1. User signs up or logs in.
2. UI stores JWT in browser `localStorage`.
3. Dashboard layout validates token and redirects unauthenticated users to `/login`.
4. User navigates through Tasks, Pomodoro, Journal, and Settings.

## Request Lifecycle

1. Page/component calls `api.get/post/put`.
2. `client/lib/apiClient.js` attaches `Authorization` header.
3. Express route receives request in `server/routes/*`.
4. `authMiddleware` verifies token for protected routes.
5. Controller validates input and calls model.
6. Model runs SQL query and returns row(s).
7. Controller sends JSON response to client.

## Domain Flows

- **Tasks:** create -> fetch/update/delete -> UI state update.
- **Pomodoro:** start session -> timer runs on UI -> end session -> history refresh.
- **Journal:** create/update/delete entry -> local list state synchronized with API response.
- **Settings:** update name, reset pomodoro data, or delete account.

