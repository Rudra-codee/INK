# Ink Backend

Express + Prisma backend for Ink using NeonDB, JWT-based auth, secure refresh token rotation, and Google Sign-In.

## Requirements
- Node.js 18+
- PostgreSQL connection string (Neon recommended)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by copying `.env.example` to `.env` and updating the secrets.
3. Run Prisma migrations (also generates the client):
   ```bash
   npm run prisma:migrate
   ```
4. Start the server:
   ```bash
   npm run dev    # nodemon
   # or
   npm start
   ```

## Environment Variables
| Name | Description |
| --- | --- |
| `PORT` | Port to run the Express server (default 4000) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | Neon/Postgres connection string with `sslmode=require` |
| `JWT_ACCESS_SECRET` | Secret for signing 15m access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing 30d refresh tokens |
| `ACCESS_TOKEN_EXP` | Access token TTL (default `15m`) |
| `REFRESH_TOKEN_EXP` | Refresh token TTL (default `30d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for verifying ID tokens |
| `FRONTEND_URL` | Allowed origin for CORS (e.g. `http://localhost:5173`) |
| `COOKIE_DOMAIN` | Domain scope for the `jid` cookie (e.g. `localhost`) |

## API Overview
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET  /api/me` (requires `Authorization: Bearer <accessToken>`) 
- `GET  /api/ping`

All auth routes enforce rate limiting and issue httpOnly cookies for refresh tokens.
