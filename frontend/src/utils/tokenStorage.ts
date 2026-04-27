const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

  setAccessToken: (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },

  setUser: (user: object) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem('csrfToken');
  },
};
