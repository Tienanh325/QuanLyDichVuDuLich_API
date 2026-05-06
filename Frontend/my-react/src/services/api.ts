import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

// ─── Axios Instance Dùng Chung ─────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Tự động gắn JWT token ────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travelhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: Xử lý lỗi toàn cục ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ → xóa session
      localStorage.removeItem('travelhub_token');
      localStorage.removeItem('travelhub_session');
    }
    return Promise.reject(error);
  },
);
export default api;
