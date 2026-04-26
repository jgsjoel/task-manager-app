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
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
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
      } catch (refreshError) {
        this.failedQueue.forEach(({ reject }) => reject(refreshError));
        this.failedQueue = [];

        // Clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';

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
