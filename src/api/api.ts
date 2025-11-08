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
    console.log("expiry token error ....:", error.response?.data);

    // If original request already retried, reject
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark this request as retried
    originalRequest._retry = true;

    try {
      const { data } = await api.post("/auth/refresh");

      // If refresh token is invalid or expired, do not retry
      if (!data.user || !data.accessToken) {
        console.log("Refresh token expired or invalid, logging out.");
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Save new access token
      useAuthStore.getState().setAuth(data.user, data.accessToken);

      // Update header and retry original request
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("Refresh token failed:", err?.response?.data || err);
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export default api;
