# Task Tracker Next.js - Quick Start Guide

## Status: ✅ Ready to Run

The Next.js frontend is fully configured and ready to use.

## Starting the Application

### Prerequisites
- Backend (NestJS) should be running on `http://localhost:3000`
- Node.js 18+ installed

### Start Frontend
```bash
cd frontend-nextjs
npm run dev
```

The frontend will automatically use an available port (typically **3001** if 3000 is in use):
- Local: `http://localhost:3001`
- Network: `http://192.168.1.5:3001`

### API Configuration
The frontend automatically connects to the backend at:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This is configured in `.env.local`

## Application Routes

| Route | Purpose |
|-------|---------|
| `/` | Login/Register page (default) |
| `/tasks` | Tasks dashboard (protected) |

## Features

✅ **Authentication**
- Login page
- Registration page  
- JWT token management
- Auto token refresh

✅ **Task Management**
- Create tasks with title and description
- Edit existing tasks
- Delete tasks with confirmation
- Mark tasks as complete/incomplete
- Filter tasks (All, Active, Completed)
- View task statistics

✅ **UI/UX**
- Responsive design
- Loading states
- Error handling
- Confirmation dialogs
- Success alerts
- Modal for task details

## Troubleshooting

### Port 3000 already in use
The app will automatically use port 3001 instead. This is expected when the backend is running on 3000.

### Getting 404 errors
Make sure:
1. Backend is running on `http://localhost:3000`
2. You're accessing `http://localhost:3001` (or the port shown in console)
3. API endpoints match between frontend and backend

### Build errors
Run:
```bash
npm install
npm run build
```

### Clear cache and reinstall
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## File Structure

```
app/
├── (auth)/          # Auth route group
├── components/      # Reusable UI components (9 files)
├── contexts/        # Auth context provider
├── hooks/          # Custom hooks (useAuth)
├── services/       # API services & HTTP client
├── tasks/          # Tasks page & layout
├── types/          # TypeScript definitions
├── utils/          # Utilities (constants, token storage)
└── page.tsx        # Root login/register page
```

## Development

### Add a new page
Create a file at `app/[route]/page.tsx`

### Add a new component
Create a file in `app/components/[ComponentName].tsx`

### Add a new API service
Create a file in `app/services/[serviceName].ts`

### Add environment variables
Edit `.env.local` and use `process.env.NEXT_PUBLIC_*` in code

## Production Build

```bash
npm run build
npm start
```

Then access at `http://localhost:3000` (or deploy to Vercel/Node.js hosting)

## Next Steps

1. Start the backend: `npm run dev` in `/backend`
2. Start the frontend: `npm run dev` in `/frontend-nextjs`
3. Open browser to `http://localhost:3001`
4. Register a new account or login
5. Create and manage tasks!

---
**Created**: April 27, 2026
**Framework**: Next.js 16.2.4 (App Router)
**Styling**: Tailwind CSS v4
**Language**: TypeScript
