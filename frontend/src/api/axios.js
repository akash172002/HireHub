import axios from 'axios';

// Use VITE_API_URL in production (e.g. https://api.yoursite.com); in dev we use relative /api (Vite proxy)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url ?? '';
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (err.response?.status === 403) {
      // Wrong role – redirect to home without showing banner (avoids confusion after signup)
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
