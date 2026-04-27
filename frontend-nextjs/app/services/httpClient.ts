import axios, { AxiosError, type AxiosInstance } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

class HttpClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      // Required so the browser sends HttpOnly cookies (refreshToken, csrfSecret)
      // on cross-origin requests to the backend.
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: attach access token and CSRF token
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token header for state-changing requests.
        // The backend CsrfMiddleware validates it against the csrfSecret HttpOnly cookie.
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
          const csrfToken = typeof window !== 'undefined'
            ? sessionStorage.getItem('csrfToken')
            : null;
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: persist CSRF token from response body, handle 401
    this.client.interceptors.response.use(
      (response) => {
        // The backend returns a fresh csrfToken in the body of auth responses
        // (login, refresh, csrf-token). Store it so subsequent requests can use it.
        const csrfToken = response.data?.csrfToken;
        if (csrfToken && typeof window !== 'undefined') {
          sessionStorage.setItem('csrfToken', csrfToken as string);
        }
        return response;
      },
      (error) => this.handleResponseError(error)
    );
  }

  private handleResponseError = async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const url = originalRequest?.url || '';

    // Don't retry for auth endpoints to avoid infinite loops
    if (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // On 401, try a silent token refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.client(originalRequest);
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        // The refreshToken HttpOnly cookie is sent automatically by the browser.
        // The CSRF token header is added by the request interceptor above.
        const response = await this.client.post(API_ENDPOINTS.REFRESH);
        const { accessToken, csrfToken } = response.data;

        tokenStorage.setAccessToken(accessToken);
        if (csrfToken && typeof window !== 'undefined') {
          sessionStorage.setItem('csrfToken', csrfToken);
        }

        this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
        this.failedQueue = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return this.client(originalRequest);
      } catch (refreshError: any) {
        this.failedQueue.forEach(({ reject }) => reject(refreshError));
        this.failedQueue = [];

        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };

  getClient() {
    return this.client;
  }
}

export default new HttpClient();
