import httpClient from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

const client = httpClient.getClient();

export const authService = {
  register: (email: string, password: string, name: string) =>
    client.post(API_ENDPOINTS.REGISTER, { email, password, name }),

  login: (email: string, password: string) =>
    client.post(API_ENDPOINTS.LOGIN, { email, password }),

  refresh: (refreshToken: string) =>
    client.post(API_ENDPOINTS.REFRESH, { refreshToken }),
};
