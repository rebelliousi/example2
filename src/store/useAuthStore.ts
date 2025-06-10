import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: localStorage.getItem('accessToken') ? true : false, // Sayfa yenilendiğinde token varsa girişli say
  login: () => {
    set({ isLoggedIn: true });
  },
  logout: () => {
    set({ isLoggedIn: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
}));