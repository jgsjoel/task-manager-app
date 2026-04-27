# Task Tracker Frontend

A modern, feature-rich React + TypeScript frontend for task management with JWT authentication and automatic token refresh.

## ✨ Features

- **Authentication** - Login, registration, JWT tokens, automatic refresh
- **Task Management** - CRUD operations with filtering and stats
- **Protected Routes** - Route guards for authenticated users
- **Auto Token Refresh** - Seamless token refresh without user interaction
- **Responsive Design** - Mobile-first Tailwind CSS styling
- **Type Safe** - Full TypeScript implementation
- **Error Handling** - User-friendly error messages and validation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend API running on `http://localhost:3000`

### Setup

```bash
cd task-tracker-frontend

npm install

# Create .env file (or update existing)
echo "VITE_API_URL=http://localhost:3000" > .env

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📚 Architecture

### Key Features

**Automatic Token Refresh:**
```
- Request interceptor adds Bearer token to all requests
- Response interceptor checks for 401 errors
- Failed requests queued while refreshing
- New token obtained from /auth/refresh endpoint
- Failed requests retried with new token
- Queue processed after successful refresh
```

**Global Auth State:**
- React Context API for user, tokens, and auth state
- Custom `useAuth()` hook for easy access
- Automatic token persistence in localStorage

**Protected Routes:**
- `ProtectedRoute` component checks authentication
- Redirects unauthenticated users to login
- Shows loading state while checking auth

### Folder Structure

```
src/
├── types/              # TypeScript interfaces
├── services/           # API client with interceptors
├── contexts/           # Auth context & state
├── hooks/              # Custom React hooks
├── components/         # Reusable UI components
├── pages/              # Page components
├── utils/              # Helpers & constants
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## 🔐 Token Management

### How It Works

1. **Login** → Backend returns `accessToken` and `refreshToken`
2. **Storage** → Both tokens stored in localStorage
3. **Requests** → Access token added to Authorization header
4. **Expiry** → If token expires, interceptor catches 401
5. **Refresh** → New token obtained from /auth/refresh
6. **Retry** → Original request retried with new token

### Request Flow

```
User Request
    ↓
Add Bearer token from localStorage
    ↓
Send to Backend API
    ↓
Success (2xx) → Return response
    ↓
Unauthorized (401) → Refresh token
    ↓
Get new token from /auth/refresh
    ↓
Retry original request
    ↓
Return response
```

## 🛠 Key Files

| File | Purpose |
|------|---------|
| `services/apiClient.ts` | Axios client with token interceptors |
| `contexts/AuthContext.tsx` | Global auth state management |
| `hooks/useAuth.ts` | Hook to access auth context |
| `components/ProtectedRoute.tsx` | Route guard for auth pages |
| `pages/AuthPage.tsx` | Login/Register page |
| `pages/TasksPage.tsx` | Main tasks management page |
| `types/index.ts` | All TypeScript interfaces |

## 🧪 Testing

```bash
# Start backend
cd ../backend && npm run start:dev

# Start frontend (in new terminal)
npm run dev

# Visit http://localhost:5173
# Register → Login → Create tasks → Test token refresh
```

## 📦 Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## ⚙️ Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

## 🎨 Styling

- Tailwind CSS 4.2 for utility-first styling
- Responsive grid layouts
- Smooth transitions and animations
- Accessible form inputs and buttons

## 📋 API Endpoints Used

**Auth:**
- `POST /auth/register` - Create account
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

**Tasks:**
- `GET /tasks` - List all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## ✅ Best Practices Implemented

- ✅ Full TypeScript type safety
- ✅ Organized folder structure by feature
- ✅ Separation of concerns (services, components, pages)
- ✅ Reusable component architecture
- ✅ Custom React hooks
- ✅ Global state management with Context API
- ✅ Automatic token refresh with queue management
- ✅ Protected routes
- ✅ Error handling and user feedback
- ✅ Responsive mobile-first design
- ✅ Loading and error states
- ✅ Form validation

## 🐛 Troubleshooting

**"Cannot connect to API"**
- Check backend is running on `http://localhost:3000`
- Verify `VITE_API_URL` in `.env`

**"Unauthorized" errors**
- Clear localStorage and login again
- Check JWT_SECRET matches between frontend and backend

**"Token refresh failing"**
- Verify refresh endpoint at `POST /auth/refresh`
- Check response includes `accessToken`

## 📚 Stack

- React 19.2
- TypeScript 5
- Vite 5
- Tailwind CSS 4
- Axios 1.15

## 📄 License

UNLICENSED
