import axios from "axios";
import { toast } from "react-toastify";
import { store } from "@/src/store/store";
import { setAccessToken, logout } from "@/src/store/authSlice";
import {
  updateAccessTokenCookie,
  clearAuthCookies,
  getAccessTokenCookie,
  getRefreshTokenCookie,
} from "@/src/lib/cookies";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// اول از Redux، اگه نبود (مثلاً بعد از رفرش صفحه) از کوکی می‌خونه
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken || getAccessTokenCookie();
  if (token) {
    config.headers.token = token;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken =
        store.getState().auth.refreshToken || getRefreshTokenCookie();
      if (!refreshToken) {
        store.dispatch(logout());
        clearAuthCookies();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.token = token;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { headers: { refreshToken } },
        );
        store.dispatch(setAccessToken(data.accessToken));
        updateAccessTokenCookie(data.accessToken); // کوکی هم آپدیت بشه
        pendingQueue.forEach((p) => p.resolve(data.accessToken));
        pendingQueue = [];
        originalRequest.headers.token = data.accessToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        pendingQueue.forEach((p) => p.reject(refreshError));
        pendingQueue = [];
        store.dispatch(logout());
        clearAuthCookies();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      (typeof error.response?.data === "string" && error.response.data) ||
      error.response?.data?.message ||
      "خطایی رخ داد، دوباره تلاش کنید";

    if (typeof window !== "undefined") {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
