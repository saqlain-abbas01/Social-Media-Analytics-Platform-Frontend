// src/store/useAuthStore.ts
import api from "@/api/api";
import type { AuthUser } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
  initialize: async () => {
    try {
      const { data } = await api.post(
        "/auth/refresh",
        {},
        { withCredentials: true }
      );
      console.log("refresh data", data);
      if (data.user && data.accessToken) {
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      }
    } catch (err) {
      console.log(err);
      get().clearAuth();
    }
  },
}));
