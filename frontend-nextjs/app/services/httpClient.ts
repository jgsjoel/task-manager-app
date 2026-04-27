import axios, { AxiosError, type AxiosInstance } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import { API_BASE_URL } from '../utils/constants';

class HttpClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
  }> = [];

  constructor() {
    // Generate a stable session ID for this client session
    const generateSessionId = () => 
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionId = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('sessionId') || generateSessionId())
      : generateSessionId();
    
    if (typeof window !== 'undefined' && !sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', sessionId);
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
    });

    // Request interceptor to add token and CSRF token
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing requests
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
          const csrfToken = typeof window !== 'undefined' 
            ? sessionStorage.getItem('csrfToken') 
            : null;
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
            console.log('CSRF token added to request:', csrfToken);
          } else {
            console.warn('No CSRF token available for request:', config.url, config.method);
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh and CSRF token extraction
    this.client.interceptors.response.use(
      (response) => {
        // Extract and store CSRF token from response header (case-insensitive)
        const csrfToken = 
          response.headers['x-csrf-token'] || 
          response.headers['X-CSRF-Token'] ||
          Object.entries(response.headers).find(([k]) => k.toLowerCase() === 'x-csrf-token')?.[1];
        
        if (csrfToken && typeof window !== 'undefined') {
          sessionStorage.setItem('csrfToken', csrfToken as string);
          console.log('CSRF token extracted and stored:', csrfToken);
        }
        return response;
      },
      (error) => this.handleResponseError(error)
    );
  }

  private handleResponseError = async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const url = originalRequest.url || '';

    // Don't try to refresh for auth endpoints
    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If 401 and not already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        // Queue the request while refreshing
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
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await this.client.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;
        tokenStorage.setTokens(accessToken, refreshToken);

        // Process queued requests
        this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
        this.failedQueue = [];

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return this.client(originalRequest);
      } catch (refreshError: any) {
        this.failedQueue.forEach(({ reject }) => reject(refreshError));
        this.failedQueue = [];

        // Clear tokens and redirect to login
        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
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
