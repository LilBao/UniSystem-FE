import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Base API instance configured with Axios
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Inject auth token if available in localStorage or cookies
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Standard error logging or token refresh can be implemented here
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session may have expired');
    }
    return Promise.reject(error);
  }
);

export default api;
