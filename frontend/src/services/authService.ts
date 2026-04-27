import httpClient from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

const client = httpClient.getClient();

export const authService = {
  register: (email: string, password: string, name: string) =>
    client.post(API_ENDPOINTS.REGISTER, { email, password, name }),

  login: (email: string, password: string) =>
    client.post(API_ENDPOINTS.LOGIN, { email, password }),

  // No body — refreshToken HttpOnly cookie is sent automatically by the browser.
  refresh: () => client.post(API_ENDPOINTS.REFRESH),

  // Fetches a fresh CSRF token on app startup.
  getCsrfToken: () => client.get(API_ENDPOINTS.CSRF_TOKEN),

  // Requires CSRF header (CsrfMiddleware applies to auth/logout).
  logout: () => client.post(API_ENDPOINTS.LOGOUT),
};
