# Task Tracker – Frontend

This is the frontend for the Task Tracker app built using React, TypeScript, and Vite.

**Live URL:** https://task-manager-app-wgds-j19lyzpn7-joels-projects-96585023.vercel.app/login

---

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- Axios
- Tailwind CSS

---

## Local Setup

```bash
cd frontend
cp .env.example .env

# backend URL
# VITE_API_URL=http://localhost:3000

npm install
npm run dev

# runs at http://localhost:5173
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Project Structure

```
src/
├── components/         # UI components
│   ├── Header.tsx
│   ├── TaskItem.tsx
│   ├── TaskModal.tsx
│   ├── CreateTaskForm.tsx
│   ├── AlertDialog.tsx
│   ├── ConfirmDialog.tsx
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── contexts/
│   └── AuthContext.tsx     # auth state
├── hooks/
│   └── useAuth.ts
├── pages/
│   ├── AuthPage.tsx
│   └── TasksPage.tsx
├── services/
│   ├── httpClient.ts       # axios instance + interceptors
│   ├── authService.ts
│   ├── taskService.ts
│   └── apiClient.ts
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   ├── tokenStorage.ts
│   └── navigation.ts
├── App.tsx
└── main.tsx
```

---

## Auth Flow

On app startup, the auth context tries to restore the session:

```
GET /auth/csrf-token
  -> backend sets csrf cookie + returns csrf token

POST /auth/refresh
  -> sent with refresh token cookie + X-CSRF-Token header
  -> returns new access token + csrf token

-> store accessToken in localStorage
-> store csrfToken in sessionStorage
-> user is authenticated
```

If refresh fails, the user is redirected to `/login`.

---

## Token Storage

| Token | Storage | Reason |
|---|---|---|
| `accessToken` | `localStorage` | short-lived (15 min) |
| `refreshToken` | `HttpOnly` cookie | not accessible via JS |
| `csrfToken` | `sessionStorage` | cleared on tab close |

---

## Axios Flow

- Every request attaches access token + CSRF token
- If a request returns 401:
  1. Call `/auth/refresh`
  2. Store new tokens
  3. Retry failed requests
  4. If refresh fails → logout user

---

## Route Protection

- `ProtectedRoute` → blocks `/tasks` if not authenticated
- `PublicRoute` → blocks `/login` and `/register` if already logged in

---

## Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # lint project
```
