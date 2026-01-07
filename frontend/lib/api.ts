import axios from 'axios';

// Use the proxy route instead of direct backend calls
const API_BASE_URL = '/api/proxy';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login for 401 errors on protected routes
    // Don't redirect for auth endpoints (login/register) - let them handle errors themselves
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/me');
      
      // Only redirect if it's NOT an auth endpoint (i.e., it's a protected route)
      if (!isAuthEndpoint && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

