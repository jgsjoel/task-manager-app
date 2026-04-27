# Task Tracker - Next.js Frontend

This is the Next.js version of the Task Tracker application, converted from the original React + Vite frontend.

## Project Structure

```
app/
├── (auth)/                    # Auth route group (login/register)
│   ├── layout.tsx            # Auth layout wrapper
│   └── page.tsx              # Auth page (login/register)
├── components/               # Reusable UI components
│   ├── AlertDialog.tsx       # Alert dialog component
│   ├── ConfirmDialog.tsx     # Confirmation dialog component
│   ├── CreateTaskForm.tsx    # Task creation form
│   ├── Header.tsx            # App header with user info
│   ├── LoginForm.tsx         # Login form
│   ├── ProtectedRoute.tsx    # Route protection wrapper
│   ├── RegisterForm.tsx      # Registration form
│   ├── TaskItem.tsx          # Individual task component
│   └── TaskModal.tsx         # Task details modal
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context provider
├── hooks/                    # Custom React hooks
│   └── useAuth.ts            # Auth context hook
├── services/                 # API service layer
│   ├── apiClient.ts          # Main API client
│   ├── authService.ts        # Auth endpoints
│   ├── httpClient.ts         # HTTP client with interceptors
│   └── taskService.ts        # Task endpoints
├── tasks/                    # Tasks route
│   ├── layout.tsx            # Tasks layout with header & protection
│   └── page.tsx              # Tasks page
├── types/                    # TypeScript type definitions
│   └── index.ts              # All app types
├── utils/                    # Utility functions
│   ├── constants.ts          # API constants
│   └── tokenStorage.ts       # Token storage utilities
├── layout.tsx                # Root layout
├── page.tsx                  # Root page (redirects to /auth)
└── globals.css               # Global styles
```

## Key Features

### Authentication
- Login and registration pages
- Token-based authentication (JWT)
- Automatic token refresh
- CSRF protection
- Auth context for managing auth state

### Task Management
- Create, read, update, delete tasks
- Task completion toggle
- Task filtering (all, active, completed)
- Task statistics dashboard
- Task details modal
- Edit and delete tasks with confirmations

### Components
- Protected routes for authenticated pages
- Responsive design with Tailwind CSS
- Modal dialogs for confirmations and task details
- Loading states and error handling

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Running the Application

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build
```bash
npm run build
npm start
```

## API Integration

The app connects to a backend API (NestJS) at `http://localhost:3000` by default. 

### Key Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Authentication Flow

1. User navigates to `/auth` or tries to access `/tasks` without authentication
2. User enters credentials on the login or registration form
3. Backend returns `accessToken`, `refreshToken`, `csrfToken`, and user data
4. Tokens are stored in localStorage
5. CSRF token is stored in sessionStorage
6. User is redirected to `/tasks`
7. All subsequent requests include the JWT in the Authorization header
8. If token expires, the HTTP interceptor automatically refreshes it

## Styling

The app uses **Tailwind CSS** for styling. All components are styled with utility classes for a clean, modern look.

## TypeScript

The project is fully typed with TypeScript for type safety and better development experience.

## Differences from React + Vite Version

- **Routing**: Uses Next.js App Router instead of React Router
- **File Structure**: Server-side routing via file system convention
- **Deployment**: Can be deployed on Vercel or any Node.js server
- **API Routes**: Can add API routes at `app/api/` if needed
- **Build**: Uses `next build` instead of Vite

## Deployment

This Next.js app can be easily deployed to:
- **Vercel** (recommended for Next.js)
- **Docker**
- **Traditional Node.js hosting**

For Vercel deployment:
```bash
vercel
```

## Development

To add new features:
1. Create components in `/app/components`
2. Add new pages in `/app/[route]/page.tsx`
3. Create API services in `/app/services` if needed
4. Define types in `/app/types`

## Notes

- The app redirects the root path `/` to `/auth`
- Protected pages check for valid auth tokens before rendering
- All API calls include CSRF token for security
- Error handling with user-friendly messages
- Loading states during async operations
