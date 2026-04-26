import { createContext, useState, useCallback, useEffect } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import apiClient from '../services/apiClient';
import type { AuthContextType, LoginPayload, RegisterPayload, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a custom provider component that wraps around the entire app and provides
// authentication state and functions to all components.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in when mount for the first time
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      // Token exists, restore user session
      // The user will have minimal data until they refresh
      setUser({
        id: 'persisted',
        email: '',
        name: '',
      });
    }
    setIsLoading(false);
  }, []);

  // The login function will be called from the Login component and will handle the authentication process,
  // including setting the user state and handling errors.
  const login = useCallback(async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      const { accessToken, refreshToken, user: userData } = response.data;
      
      tokenStorage.setTokens(accessToken, refreshToken);
      setUser(userData);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // The register function will be called from the Register component and will handle the registration process,
  // including handling errors. After successful registration, the user will need to log in.
  const register = useCallback(async (credentials: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.register(credentials.email, credentials.password, credentials.name);
      // After registration, user needs to login
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
