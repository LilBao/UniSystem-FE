import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Bearer access_token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Helper to extract readable message from FastAPI AppError / RequestValidationError
export function getApiErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi khi gọi API'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
        message?: string;
        detail?: string | Array<{ msg?: string; loc?: Array<string | number> }>;
        details?: Array<{ msg?: string; loc?: Array<string | number> }>;
      }
      | undefined;

    if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
      return data.details
        .map((d) => d.msg || 'Dữ liệu không hợp lệ')
        .join('; ');
    }
    if (data?.message) {
      return data.message;
    }
    if (typeof data?.detail === 'string') {
      return data.detail;
    }
    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      return data.detail.map((d) => d.msg || 'Dữ liệu không hợp lệ').join('; ');
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

// Response Interceptor: Auto-refresh token on 401 if refresh_token exists
let isRefreshing = false;

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      typeof window !== 'undefined' &&
      !originalRequest.url?.includes('/api/v1/auth/login') &&
      !originalRequest.url?.includes('/api/v1/auth/register') &&
      !originalRequest.url?.includes('/api/v1/auth/refresh')
    ) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && !isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL || ''}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const { access_token, refresh_token: newRefreshToken, user } = refreshResponse.data;
          localStorage.setItem('access_token', access_token);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }
          if (user) {
            localStorage.setItem('unisystem_user', JSON.stringify(user));
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          isRefreshing = false;
          return api(originalRequest);
        } catch {
          isRefreshing = false;
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('unisystem_user');
          if (
            !window.location.pathname.startsWith('/signin') &&
            !window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/signup') &&
            !window.location.pathname.startsWith('/register')
          ) {
            window.location.href = '/signin';
          }
        }
      } else if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('unisystem_user');
        if (
          !window.location.pathname.startsWith('/signin') &&
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/signup') &&
          !window.location.pathname.startsWith('/register')
        ) {
          window.location.href = '/signin';
        }
      }
    }

    return Promise.reject(new Error(getApiErrorMessage(error)));
  }
);

export default api;
