'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import apiClient from '../services/apiClient';
import type { AuthContextType, LoginPayload, RegisterPayload, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in when mount for the first time
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      // Token exists, restore user session
      setUser({
        id: 'persisted',
        email: '',
        name: '',
      });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      const { accessToken, refreshToken, csrfToken, user: userData } = response.data;
      
      tokenStorage.setTokens(accessToken, refreshToken);
      
      // Store CSRF token immediately after login
      if (csrfToken && typeof window !== 'undefined') {
        sessionStorage.setItem('csrfToken', csrfToken);
        console.log('CSRF token stored from login response');
      }
      
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
      await apiClient.register(credentials.email, credentials.password, credentials.name);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearTokens();
    setUser(null);
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
