// store/auth.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") || null : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") || null : null,
  username: typeof window !== "undefined" ? localStorage.getItem("username") || null : null,

  setTokens: (accessToken, refreshToken, username) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);
    }
    set({ accessToken, refreshToken, username });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
    }
    set({ accessToken: null, refreshToken: null, username: null });
  },
}));
