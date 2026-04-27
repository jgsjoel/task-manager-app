# Task Tracker – Phase 1 Plan

## Backend Choice: NestJS

NestJS was chosen over Express.js and Next.js API routes for the following reasons:

- **Structure by default** — enforces modular architecture (Auth, Task modules), separation of concerns, and dependency injection out of the box. Express requires this to be manually designed, increasing risk of inconsistency.
- **TypeScript-first** — decorators, DTOs, and typed guards make validation and auth pipelines far safer and more maintainable than raw Express middleware.
- **Built-in security primitives** — guards (`JwtGuard`), middleware (`CsrfMiddleware`), pipes (`ValidationPipe`), and filters (`AllExceptionsFilter`) map cleanly to security requirements without third-party solutions.
- **Next.js API routes** were ruled out because mixing frontend and backend in one deployment couples concerns, complicates horizontal scaling, and makes independent backend deployment (Docker, Railway) impossible.

## Architecture Overview

```
Next.js (Vercel)         NestJS API (Railway/Docker)        Neon PostgreSQL
─────────────────        ──────────────────────────        ─────────────────
Auth pages        ──►    POST /auth/register               Users table
Tasks dashboard   ──►    POST /auth/login                  Tasks table
Protected routes  ──►    POST /auth/refresh    ◄── JWT
Axios + CSRF hdr  ──►    POST /auth/logout     ◄── cookies
                  ──►    GET/POST/PUT/DELETE /tasks
```

- **Frontend:** Next.js App Router, Axios with request/response interceptors, React Context for auth state, Tailwind CSS
- **Auth:** Short-lived JWT access token (15 min) + long-lived refresh token (7 days) in `HttpOnly` cookie; CSRF double-submit cookie pattern for cookie-dependent endpoints
- **Database:** PostgreSQL via Prisma ORM (type-safe, parameterised queries, migration support)

## Security Considerations

| Layer | Risk | Mitigation |
|---|---|---|
| Client | XSS | React JSX escaping; `sanitize-html` on all user input DTOs; CSP headers via `next.config.ts` |
| Client | CSRF | Double-submit cookie: `csrfSecret` HttpOnly cookie + `X-CSRF-Token` header validated server-side |
| Client | Token theft | Access token in memory/localStorage (short TTL); refresh token in `HttpOnly; SameSite=Strict` cookie — inaccessible to JS |
| Server | Brute force | `@nestjs/throttler` — 5 requests / 15 s globally, keyed by IP |
| Server | Injection | Prisma parameterised queries; `class-validator` whitelist + `forbidNonWhitelisted`; `sanitize-html` strips tags |
| Server | Auth bypass | `JwtGuard` on all task routes; ownership check (`task.userId === req.user.sub`) on every operation |
| Server | Info leakage | `AllExceptionsFilter` returns generic messages in production; no stack traces exposed |
| Transport | MITM | `helmet` CSP + `upgradeInsecureRequests` in production; strict CORS origin allowlist |

## Better Tech Choices (if applicable)

- **Redis** would replace in-memory rate limiting state, enabling it to work correctly across multiple backend instances.
- **HttpOnly-only token storage** (no localStorage) would eliminate the access token XSS surface entirely; requires backend to issue short-lived tokens aggressively and rely solely on the refresh flow.
- **OAuth 2.0 (e.g. Google)** would eliminate password storage and brute-force risk at the auth layer altogether, which is the strongest long-term improvement for a production system.

