// auth/authStore.ts (or auth/zustandStore.ts or similar)

import { useEffect } from 'react';
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

// Optionally, create a hook to check for the token on initial load
export const useCheckAuth = () => {
  const { login } = useAuthStore();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    if (token) {
      login(); // Trigger login to set isLoggedIn to true
    }
  }, [login]); // Dependencies

  return null; // This hook doesn't render anything
};