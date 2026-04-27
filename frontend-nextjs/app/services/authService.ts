import httpClient from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

const client = httpClient.getClient();

export const authService = {
  register: (email: string, password: string, name: string) =>
    client.post(API_ENDPOINTS.REGISTER, { email, password, name }),

  login: (email: string, password: string) =>
    client.post(API_ENDPOINTS.LOGIN, { email, password }),

  // No request body needed — the refreshToken HttpOnly cookie is sent automatically.
  // The CSRF token header is added by the httpClient request interceptor.
  refresh: () => client.post(API_ENDPOINTS.REFRESH),

  // Fetches a fresh CSRF token. The backend sets the csrfSecret HttpOnly cookie
  // and returns the signed csrfToken in the response body.
  // Must be called on app startup before any CSRF-protected endpoints are used.
  getCsrfToken: () => client.get(API_ENDPOINTS.CSRF_TOKEN),

  // Requires CSRF token (CsrfMiddleware applies to auth/logout).
  logout: () => client.post(API_ENDPOINTS.LOGOUT),
};
