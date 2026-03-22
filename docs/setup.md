# Setup

## Prerequisites

- Node.js (LTS recommended)
- npm
- PostgreSQL

## Environment Variables (server)

Create `server/.env` with:

```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=studyforge
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_secret
```

## Install

```bash
cd server && npm install
cd ../client && npm install
```

## Run

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

- API default: `http://localhost:5000`
- UI default: `http://localhost:3000`

