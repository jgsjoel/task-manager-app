# Task Tracker - Complete Assessment

Full-stack task management application meeting Residue Solutions assessment requirements.

## 📋 Project Overview

A secure, production-ready task management system with JWT authentication, real-time updates, and comprehensive security features.

**Status:** ✅ Phase 1-3 Complete
- ✅ Phase 1: Planning & Architecture (PLAN.md)
- ✅ Phase 2: Implementation & Deployment
- ✅ Phase 3: Code Review Ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Frontend Setup
```bash
cd task-tracker-frontend
cp .env.example .env.local
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
# Runs at http://localhost:3000
```

## ✨ Features

### ✅ Authentication
- User registration with password hashing (bcrypt)
- JWT-based login with refresh tokens
- Automatic token refresh on expiry
- Secure logout with token cleanup

### ✅ Task Management
- Create, read, update, delete tasks
- Task descriptions
- Mark tasks as completed
- Task statistics dashboard
- User isolation (own tasks only)

### ✅ Security Implemented
- **Client-Side:** XSS prevention, CSRF tokens, secure token storage, CSP headers
- **Server-Side:** Password hashing, rate limiting, input validation, JWT validation
- **Database:** SQL injection prevention (Prisma ORM), user isolation
- **Transport:** HTTPS ready, CORS configured, security headers

### ✅ UI/UX
- Responsive design (Tailwind CSS)
- Loading & error states
- Form validation
- Custom modals (ConfirmDialog, AlertDialog)
- Task detail modal
- Real-time UI updates

## 🔐 Security Features

✅ Password hashing (bcrypt, 10 rounds)
✅ JWT with access/refresh tokens  
✅ XSS prevention (React escaping)
✅ Input validation & sanitization
✅ Rate limiting (5 req/15s)
✅ CSRF token validation
✅ Content Security Policy headers
✅ User authorization (own tasks only)
✅ Error handling without stack traces

## 📚 Documentation

- **[PLAN.md](PLAN.md)** - Phase 1: Architecture & Security Planning
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment to Vercel/Railway
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[task-tracker-frontend/README.md](task-tracker-frontend/README.md)** - Frontend setup guide

## 📊 Tech Stack

- **Frontend:** React 19 + TypeScript + React Router + Tailwind CSS + Vite
- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL
- **Authentication:** JWT (access + refresh tokens)
- **Database:** PostgreSQL with Prisma ORM

## 🚢 Deployment

### Quick Deploy
```bash
# Frontend (Auto-deploy on git push)
# → https://vercel.com (GitHub integration)

# Backend (Auto-deploy on git push)  
# → https://railway.app (GitHub integration)
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

## 📝 Assessment Criteria

### Phase 1 ✅
- Architecture overview & security planning
- Backend choice justified (NestJS)
- Tech stack reasoning
- Scalability considerations

### Phase 2 ✅
- Full CRUD operations
- Secure authentication
- Rate limiting & security headers
- CSRF protection
- Professional code quality
- Production-ready deployment

### Phase 3 ✅
- Clear code structure
- Documented architectural decisions
- Security at every layer
- Ready for code walkthrough

## 🎯 Key Features

1. **Secure Authentication**
   - Bcrypt password hashing
   - JWT with refresh tokens
   - Automatic token rotation

2. **CSRF Protection**
   - Token generation on GET requests
   - Validation on state-changing requests
   - Automatic expiry after 1 hour

3. **Rate Limiting**
   - 5 requests per 15 seconds
   - IP-based tracking
   - Prevents brute force attacks

4. **Security Headers**
   - Content Security Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - Strict-Transport-Security

5. **Error Handling**
   - No stack trace leaks
   - User-friendly messages
   - Comprehensive validation

## 📖 Quick Reference

### Start Development
```bash
# Terminal 1: Frontend
cd task-tracker-frontend && npm run dev

# Terminal 2: Backend  
cd backend && npm run start:dev
```

### API Endpoints
- `POST /auth/register` - Create user
- `POST /auth/login` - Get tokens
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Environment Variables
**Frontend:** `VITE_API_URL`
**Backend:** `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`

See `.env.example` files for all options.

### Available Scripts

- `npm run start:dev` - Start in development mode
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## Frontend

React/TypeScript application for task management.

### Quick Start

```bash
cd task-tracker-frontend
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Technologies

### Backend
- NestJS 11
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- class-validator for validation
- class-transformer for data transformation

### Frontend
- React 19+
- TypeScript
- Vite
- ESLint

## Development Workflow

1. Ensure environment variables are configured
2. Start development servers:
   - Backend: `npm run start:dev` (from backend/)
   - Frontend: `npm run dev` (from task-tracker-frontend/)
3. API available at http://localhost:3000
4. Frontend available at http://localhost:5173

## Contributing

- Follow eslint rules
- Use TypeScript for type safety
- Add tests for new features
- Create feature branches for changes

## License

UNLICENSED
