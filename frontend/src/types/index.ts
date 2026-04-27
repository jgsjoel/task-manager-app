// User types
export interface User {
  id: string;
  email: string;
  name: string;
}

// Auth types
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Backend returns { accessToken, csrfToken, user } on login.
// refreshToken is set as an HttpOnly cookie — never in the JS-accessible response.
export interface AuthResponse {
  accessToken: string;
  csrfToken: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (credentials: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
