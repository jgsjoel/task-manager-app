# Task Tracker - Phase 1 Planning & Architecture

## Backend Choice: NestJS

**Justification:**
- Enterprise-grade framework with excellent TypeScript support
- Built-in dependency injection and modular architecture
- Powerful middleware/guard system for authentication and authorization
- Strong community and extensive documentation
- Great for scaling with clear separation of concerns

**Alternative Considered:** Express.js
- More lightweight but requires more manual setup for auth, validation, and structure
- NestJS provides these out-of-the-box, reducing boilerplate

---

## Architecture Overview

### High-Level Architecture
```
Frontend (React + Vite)
    ↓ (HTTPS/JWT)
API Gateway Layer
    ↓ (Rate Limiting, CORS, CSP)
Backend (NestJS)
    ├── Auth Module (login, register, JWT refresh)
    ├── Task Module (CRUD operations)
    └── Prisma ORM
        ↓
PostgreSQL Database
```

### Frontend Architecture
- **Framework:** React 19 + React Router DOM (client-side routing)
- **HTTP Client:** Axios with interceptors for automatic token refresh
- **State Management:** React Context API for auth state
- **Styling:** Tailwind CSS
- **Security:** Secure token storage, XSS prevention via React, CSRF token handling

### Backend Architecture
- **Framework:** NestJS with TypeScript
- **Authentication:** JWT with access/refresh token pattern
- **Database:** PostgreSQL with Prisma ORM
- **Security:** Password hashing (bcrypt), rate limiting, input validation, CORS
- **API Design:** RESTful with proper HTTP status codes

---

## Security Considerations

### Client-Side Security
✅ **Implemented:**
- XSS Prevention: React auto-escapes JSX, no `dangerouslySetInnerHTML`
- Input validation and sanitization
- Secure token storage in localStorage
- Automatic token refresh with 401 handling

🔐 **Enhanced:**
- CSRF token validation on state-changing requests
- Content Security Policy (CSP) headers
- httpOnly cookie support (optional future improvement)

### Server-Side Security
✅ **Implemented:**
- Password hashing with bcrypt (10 salt rounds)
- JWT validation on all protected routes
- User authorization (users can only access/modify own tasks)
- Input validation with class-validator
- Error handling without stack trace leaks

🔐 **Enhanced:**
- Rate limiting (prevent brute force)
- CORS with strict origins
- CSRF protection for state-changing operations
- HTTP security headers (helmet integration)

### Database Security
- Parameterized queries via Prisma ORM (SQL injection prevention)
- User isolation (userId foreign key constraint)
- No sensitive data in logs

---

## Tech Stack Justification

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite | Fast dev experience, simple SPA, no SSR needed for this app |
| Routing | React Router v7 | Industry standard, better than custom routing |
| HTTP Client | Axios | Excellent interceptor support for auth handling |
| Backend | NestJS | Enterprise patterns, great TypeScript support, scalable |
| Database | PostgreSQL + Prisma | Type-safe ORM, powerful migrations, excellent DX |
| Styling | Tailwind CSS | Utility-first, fast UI development, responsive by default |
| Auth | JWT | Stateless, scalable, works well with SPAs |

---

## Potential Improvements

1. **Future Enhancements:**
   - Database caching layer (Redis)
   - WebSocket support for real-time task updates
   - Task categories/labels
   - Task priorities and due dates
   - User notifications/reminders

2. **At Scale:**
   - API versioning (v1, v2)
   - GraphQL for complex queries
   - Microservices with message queues
   - Distributed caching
   - Load balancing

3. **Security Upgrades:**
   - OAuth 2.0 / Google Sign-in
   - Two-factor authentication (2FA)
   - Audit logging
   - Rate limiting by user/IP
   - DDoS protection

---

## Deployment Strategy

- **Frontend:** Vercel/Netlify (automatic deployments from git)
- **Backend:** Railway/Render (Node.js hosting with PostgreSQL)
- **Environment:** Separate dev/staging/production configs
- **CI/CD:** GitHub Actions for automated testing and deployment

---

## Security Incidents Response
- All errors logged without sensitive data
- Rate limiting prevents brute force attempts
- JWT expiry forces re-authentication
- CORS prevents cross-origin attacks
- Input validation prevents injection attacks
