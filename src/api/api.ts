/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  console.log("token from store", token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest", originalRequest);
    // Prevent retry loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    console.log("originalRequest url", originalRequest.url);
    // Don't retry the refresh endpoint itself
    if (originalRequest.url.includes("/auth/refresh")) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Mark request as retried
    originalRequest._retry = true;

    try {
      // Call refresh endpoint; browser sends cookie automatically
      const { data } = await api.post("/auth/refresh");

      // If refresh fails (expired or invalid), logout
      if (!data.user || !data.accessToken) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Save new access token in auth store
      useAuthStore.getState().setAuth(data.user, data.accessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (err: any) {
      // Refresh failed — logout
      console.log("Refresh token request failed:", err?.response?.data || err);
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export default api;
