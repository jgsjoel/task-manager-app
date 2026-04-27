# Task Tracker – Phase 1 Plan

## Backend Choice: NestJS

I chose NestJS instead of Express or Next.js API routes mainly because it gives me a much cleaner and more scalable structure from the start.

- **Structured by default** — Nest forces a modular setup (Auth, Tasks, etc.), which makes the codebase easier to maintain. With Express, I'd have to design all of that manually, which can get messy fast.
- **TypeScript-first** — things like DTOs, decorators, and guards make validation and authentication much safer compared to plain middleware.
- **Built-in security features** — guards (`JwtGuard`), pipes (`ValidationPipe`), filters, etc., are already part of the framework, so I don't need to rely heavily on third-party solutions.

I avoided Next.js API routes because I didn't want to mix frontend and backend. Keeping them separate makes deployment, scaling, and debugging much cleaner.

## Architecture Overview

```
React Frontend(Vercel)         NestJS API (Render/Docker)        PostgreSQL
─────────────────        ─────────────────────────        ─────────────
Auth pages        ──►    POST /auth/register              Users table
Tasks dashboard   ──►    POST /auth/login                 Tasks table
Protected routes  ──►    POST /auth/refresh    ◄── JWT
Axios + CSRF hdr  ──►    POST /auth/logout     ◄── cookies
                  ──►    GET/POST/PUT/DELETE /tasks
```

- **Frontend:** React 19 with TypeScript, Axios with interceptors, React Context for auth state, Tailwind CSS
- **Auth:** Short-lived access token (15 mins) + refresh token (7 days) stored in an HttpOnly cookie. CSRF protection uses a double-submit cookie approach.
- **Database:** PostgreSQL (Histed on Neon) with Prisma (type-safe queries + migrations)

## Security Considerations

| Layer | Risk | Mitigation |
|---|---|---|
| Client | XSS | React escaping by default + `sanitize-html` on inputs + CSP headers |
| Client | CSRF | Double-submit cookie (`csrfSecret` + `X-CSRF-Token` header) |
| Client | Token theft | Short-lived access token + refresh token in `HttpOnly` cookie |
| Server | Brute force | Rate limiting with `@nestjs/throttler` |
| Server | Injection | Prisma + validation (`class-validator`) + input sanitization |
| Server | Auth bypass | `JwtGuard` + ownership checks on all task operations |
| Server | Info leakage | Global exception filter hides internal errors in production |
| Transport | MITM | `helmet` + strict CORS + HTTPS enforcement |

## Better Tech Choices (if scaling further)

- **Redis** — would replace in-memory rate limiting so it works across multiple app instances
- **HttpOnly-only auth flow** — removing localStorage entirely would reduce XSS risk further
- **OAuth (e.g., Google login)** — removes password handling completely and is more secure long-term
- **zustand** - would use zustand to avoid prop drilling and manage global state in case need to add more features
