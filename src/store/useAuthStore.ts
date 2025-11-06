// store/authStore.ts
import { create } from "zustand";
import type { AuthUser } from "@/types/user";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initialize: () => void;
  setUserFromApi: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  initialize: () => {
    const stored = localStorage.getItem("auth_user");
    if (!stored) return;

    try {
      const parsed: AuthUser = JSON.parse(stored);
      set({
        user: parsed,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem("auth_user");
    }
  },

  setUserFromApi: (user) => {
    localStorage.setItem("auth_user", JSON.stringify(user));

    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("auth_user");
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
