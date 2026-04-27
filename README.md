# Task Tracker

A secure, full-stack task management system built for the Residue Solutions Intern Software Engineer Technical Assessment.

## Live URLs

| Service | URL |
|---|---|
| Frontend | https://task-manager-app-wgds.vercel.app |
| Backend API | https://backend1-yt2t.onrender.com |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + React Router v7 + Tailwind CSS |
| Backend | NestJS 11 + TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | JWT access tokens (15 min) + refresh tokens (7 days, HttpOnly cookie) |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, CSRF_SECRET, CORS_ORIGIN
npm install
npx prisma migrate dev
npm run start:dev
# API running at http://localhost:3000
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000
npm install
npm run dev
# App running at http://localhost:5173
```

---

## Authentication Flow

### On Application Load (session restore)

```
App mounts
  -> GET /auth/csrf-token         (no auth required)
  -> backend sets csrfSecret HttpOnly cookie, returns csrfToken in body
  -> store csrfToken in sessionStorage
  -> POST /auth/refresh            (refreshToken cookie sent automatically by browser)
       header: X-CSRF-Token: <csrfToken>
  -> backend validates CSRF, rotates refreshToken cookie + csrfSecret cookie
  -> returns new accessToken + csrfToken in body
  -> store accessToken in localStorage, csrfToken in sessionStorage
  -> app ready — user is authenticated
```

If the refresh fails (no cookie / expired), the user is redirected to `/login`.

### Login

```
POST /auth/login   { email, password }
  -> backend verifies password (bcrypt, 10 rounds)
  -> sets refreshToken HttpOnly cookie  (path: /auth, 7 days, SameSite=Strict)
  -> sets csrfSecret HttpOnly cookie    (path: /auth, 7 days, SameSite=Strict)
  -> returns { accessToken, csrfToken, user } in body
  -> client stores accessToken in localStorage, csrfToken in sessionStorage
```

### Authenticated Requests

Every request to `/tasks` attaches:

```
Authorization: Bearer <accessToken>
```

When the access token expires (401 response), the Axios interceptor automatically:

```
POST /auth/refresh
  header: X-CSRF-Token: <csrfToken>
  (refreshToken cookie sent automatically by the browser)
  -> receive new accessToken + csrfToken
  -> retry the original request transparently
```

### Logout

```
POST /auth/logout
  header: X-CSRF-Token: <csrfToken>
  -> backend clears refreshToken and csrfSecret cookies
  -> client clears localStorage and sessionStorage
  -> redirect to /login
```

---

## API Reference

Full documentation: [backend/API.md](backend/API.md)

### Auth Endpoints

| Method | Endpoint | Auth | CSRF | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | — | — | Create account |
| `POST` | `/auth/login` | — | — | Login, receive tokens |
| `GET` | `/auth/csrf-token` | — | — | Issue CSRF token on page load |
| `POST` | `/auth/refresh` | cookie | required | Rotate access + refresh tokens |
| `POST` | `/auth/logout` | cookie | required | Clear session cookies |

### Task Endpoints

All task endpoints require `Authorization: Bearer <accessToken>`. Users can only access their own tasks — attempting to read or modify another user's task returns `403`.

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/tasks` | List all tasks | — |
| `POST` | `/tasks` | Create task | `{ title, description?, completed? }` |
| `GET` | `/tasks/:id` | Get single task | — |
| `PUT` | `/tasks/:id` | Update task (partial) | `{ title?, description?, completed? }` |
| `DELETE` | `/tasks/:id` | Delete task | — |

**Task object shape:**

```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "userId": "uuid",
  "createdAt": "2026-04-27T10:00:00.000Z",
  "updatedAt": "2026-04-27T10:00:00.000Z"
}
```

**Validation:** `title` min 3 chars (required on create), `description` optional string, `completed` boolean. All string fields are HTML-sanitized via `sanitize-html` before being stored.

**Error envelope:**

```json
{
  "statusCode": 400,
  "message": "Title must be at least 3 characters",
  "error": "Bad Request",
  "timestamp": "2026-04-27T10:00:00.000Z",
  "path": "/tasks"
}
```

---

## Security Implementation

### CSRF — Double-Submit Cookie Pattern

The backend generates a random 32-byte `csrfSecret`, stores it in an `HttpOnly` cookie (inaccessible to JavaScript), and returns an HMAC-SHA256 signed token (`csrfToken`) in the response body. On `POST /auth/refresh` and `POST /auth/logout`, `CsrfMiddleware` reads both values and verifies the HMAC signature using a constant-time comparison (`timingSafeEqual`).

A malicious third-party site cannot read the `csrfToken` from the response body because CORS blocks cross-origin reads. Without the token, the attacker cannot construct a valid `X-CSRF-Token` header, so the double-submit check fails.

### XSS Prevention

- **React JSX** escapes all dynamic values by default. No `dangerouslySetInnerHTML` is used anywhere in the codebase.
- All user-supplied string fields (`title`, `description`, `name`) are run through `sanitize-html` with zero allowed tags inside NestJS DTOs **before** being stored in the database.
- `HttpOnly` cookies (`refreshToken`, `csrfSecret`) are completely inaccessible to JavaScript — even in the event of an XSS attack, these tokens cannot be stolen.

### Content Security Policy (CSP)

Applied server-side via [Helmet](https://helmetjs.github.io/). Production directives:

```
default-src   'self'
script-src    'self'
style-src     'self'
img-src       'self' data: https:
connect-src   'self' <CORS_ORIGIN values>
object-src    'none'
frame-ancestors 'none'
form-action   'self'
upgrade-insecure-requests
```

This prevents inline script injection, clickjacking (`frame-ancestors 'none'`), and mixed content (`upgrade-insecure-requests`).

### CORS

Configured in `main.ts`:

```ts
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
});
```

Only origins listed in `CORS_ORIGIN` (set via the Render environment dashboard) are permitted. `credentials: true` is required for the browser to send cookies on cross-origin requests.

### Token Storage

| Token | Storage | Rationale |
|---|---|---|
| `accessToken` (15 min JWT) | `localStorage` | Short TTL limits XSS exposure window |
| `refreshToken` (7 days) | `HttpOnly` cookie | Never accessible to JavaScript |
| `csrfToken` | `sessionStorage` | Cleared on tab close; inaccessible cross-origin |
| `csrfSecret` | `HttpOnly` cookie | Never accessible to JavaScript |

### Rate Limiting

Global `@nestjs/throttler` guard: **5 requests per 15 seconds per IP**. Returns `429 Too Many Requests` when exceeded, preventing brute-force login attempts.

### Password Hashing

bcrypt with 10 salt rounds. Passwords are never returned in any API response. Even if the database is compromised, passwords cannot be reversed without brute-force effort per-hash.

### Authorization

`JwtGuard` protects all `/tasks` routes. Every service method additionally asserts `task.userId === req.user.sub`, so a valid JWT for user A cannot read or modify user B's tasks.

### Error Handling

`AllExceptionsFilter` is applied globally. In production it strips stack traces and returns only a human-readable `message`. Internal errors always return the generic string `"Internal server error"` — no implementation details are leaked.

---

## Project Structure

```
task-tracker/
├── PLAN.md                    # Phase 1: Architecture & security planning
├── backend/
│   ├── API.md                 # Full API reference
│   ├── .env.example           # Environment variable template
│   ├── Dockerfile             # Multi-stage production Docker image
│   ├── prisma/schema.prisma   # Database schema (User, Task)
│   └── src/
│       ├── auth/              # Auth module — controller, service, DTOs
│       ├── task/              # Task module — controller, service, DTOs
│       └── common/
│           ├── guards/        # JwtGuard, CsrfService
│           ├── filters/       # AllExceptionsFilter, ValidationExceptionFilter
│           └── decorators/    # @GetUser()
└── frontend/
    ├── .env.example           # Environment variable template
    ├── vercel.json            # SPA rewrite rule for Vercel
    └── src/
        ├── components/        # Reusable UI (Header, TaskItem, TaskModal, dialogs)
        ├── contexts/          # AuthContext — global auth state
        ├── hooks/             # useAuth
        ├── pages/             # AuthPage, TasksPage
        ├── services/          # httpClient (Axios + interceptors), authService, taskService
        ├── types/             # TypeScript interfaces
        └── utils/             # constants, tokenStorage, navigation
```

---

## Environment Variables

### Backend (`backend/.env.example`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_EXPIRY` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL (e.g. `7d`) |
| `CSRF_SECRET` | HMAC secret for signing CSRF tokens |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |
| `NODE_ENV` | `development` or `production` |
| `API_PORT` | Port to listen on (default `3000`) |

### Frontend (`frontend/.env.example`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |
