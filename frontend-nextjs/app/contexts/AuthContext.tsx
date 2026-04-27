'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import { authService } from '../services/authService';
import type { AuthContextType, LoginPayload, RegisterPayload, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        // Initialise the CSRF double-submit cookie + token before any other request.
        // The backend sets the csrfSecret HttpOnly cookie and returns csrfToken in the body.
        // The response interceptor in httpClient will store it in sessionStorage automatically.
        await authService.getCsrfToken();
      } catch {
        // Network error or backend unavailable — the app still renders,
        // but CSRF-protected endpoints (refresh, logout) will fail until the
        // user successfully logs in (which also re-issues the cookie + token).
      }

      // Restore user session from localStorage (access token + user profile).
      const storedToken = tokenStorage.getAccessToken();
      const storedUser = tokenStorage.getUser() as User | null;
      if (storedToken && storedUser) {
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initSession();
  }, []);

  const login = useCallback(async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials.email, credentials.password);
      // Backend returns { accessToken, csrfToken, user }.
      // The csrfToken is stored in sessionStorage by the httpClient response interceptor.
      // The refreshToken is set as an HttpOnly cookie — never accessible from JS.
      const { accessToken, user: userData } = response.data;

      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setUser(userData);
      setUser(userData);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(credentials.email, credentials.password, credentials.name);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Calls POST /auth/logout — requires CSRF header (added by httpClient interceptor).
      // The backend clears the refreshToken and csrfSecret HttpOnly cookies.
      await authService.logout();
    } catch {
      // Proceed with client-side cleanup regardless of server response.
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!tokenStorage.getAccessToken(),
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
