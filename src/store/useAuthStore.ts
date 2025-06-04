// auth/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => {
    set({ isLoggedIn: false });
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  },
}));