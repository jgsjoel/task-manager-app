# Frontend Folder Structure

## `/src/types/` 
- `index.ts` - All TypeScript interfaces and types
  - User, Task, Auth types
  - API request/response types
  - Context types

## `/src/services/`
- `apiClient.ts` - Axios API client with:
  - Request interceptor (adds JWT token)
  - Response interceptor (handles token refresh automatically)
  - Refresh token queue management
  - All API methods (auth, tasks)

## `/src/contexts/`
- `AuthContext.tsx` - Global auth state management
  - login(), register(), logout() functions
  - User data and authentication status
  - Error handling

## `/src/hooks/`
- `useAuth.ts` - Custom hook to access AuthContext

## `/src/components/`
- `ProtectedRoute.tsx` - Route guard for authenticated pages
- `LoginForm.tsx` - Login form component
- `RegisterForm.tsx` - Registration form component
- `Header.tsx` - Navigation header with user info and logout
- `TaskItem.tsx` - Individual task item with edit/delete
- `CreateTaskForm.tsx` - Form to create new tasks

## `/src/pages/`
- `AuthPage.tsx` - Login/Register page
- `TasksPage.tsx` - Main tasks management page with filtering

## `/src/utils/`
- `constants.ts` - API endpoints and config
- `tokenStorage.ts` - LocalStorage utilities for tokens
- `navigation.ts` - Simple client-side routing

## `/src/`
- `App.tsx` - Main app component with routing
- `main.tsx` - React DOM entry point
- `index.css` - Global styles (Tailwind)
- `App.css` - App-specific styles (using Tailwind)
