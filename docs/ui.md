# UI Overview

Frontend uses Next.js App Router and Tailwind utility classes.

## Layout Pattern

- `client/app/layout.js`: global HTML/body layout.
- `client/app/dashboard/layout.js`: authenticated dashboard shell:
  - Left sidebar navigation
  - Top header with user avatar/name and logout
  - Main content area for route pages
  - Right sidebar placeholder (`Stats coming soon`)

## Styling Notes

- Inputs, cards, and action buttons are styled with utility classes.
- Some sections (Signup, Journal item cards, Pomodoro history) use dark backgrounds.
- UX currently relies on `alert()` and `confirm()` for feedback/confirmation.

