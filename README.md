# Task Tracker

A full-stack task management application built with NestJS backend and React/TypeScript frontend.

## Project Structure

```
task-tracker/
├── backend/                 # NestJS backend server
├── task-tracker-backend/    # Alternative backend setup
├── task-tracker-frontend/   # React frontend application
└── .gitignore              # Git ignore rules
```

## Backend

NestJS-based REST API with authentication, validation, and error handling.

### Features

- **Authentication**: JWT-based login and registration
- **Validation**: Request field validation with detailed error messages
- **Error Handling**: Global exception filters and custom error responses
- **Database**: Prisma ORM with PostgreSQL

### Quick Start

```bash
cd backend
npm install
npm run start:dev
```

### Environment Setup

Create `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/task_tracker
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=3000
```

### API Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

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
