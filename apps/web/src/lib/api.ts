import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token as string));
  failedQueue = [];
};

const getTokens = () => { try { const s = typeof window !== 'undefined' ? localStorage.getItem('auth_tokens') : null; return s ? JSON.parse(s) : null; } catch { return null; } };
const setTokens = (tokens: unknown) => { if (typeof window !== 'undefined') localStorage.setItem('auth_tokens', JSON.stringify(tokens)); };
const clearTokens = () => { if (typeof window !== 'undefined') localStorage.removeItem('auth_tokens'); };

const apiClient: AxiosInstance = axios.create({ baseURL: BASE_URL, timeout: 30000, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.accessToken) config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const req = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !req._retry) {
      if (isRefreshing) return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); }).then(token => { if (req.headers) (req.headers as Record<string,string>).Authorization = `Bearer ${token}`; return apiClient(req); });
      req._retry = true; isRefreshing = true;
      const tokens = getTokens();
      if (!tokens?.refreshToken) { clearTokens(); if (typeof window !== 'undefined') window.location.href = '/login'; return Promise.reject(error); }
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: tokens.refreshToken });
        setTokens(data); processQueue(null, data.accessToken);
        if (req.headers) (req.headers as Record<string,string>).Authorization = `Bearer ${data.accessToken}`;
        return apiClient(req);
      } catch (err) { processQueue(err, null); clearTokens(); if (typeof window !== 'undefined') window.location.href = '/login'; return Promise.reject(err); }
      finally { isRefreshing = false; }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config).then(r => r.data),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config).then(r => r.data),
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config).then(r => r.data),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config).then(r => r.data),
};

export { getTokens, setTokens, clearTokens };
export default apiClient;