// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userName?: string;
  userSurname?: string;
  userEmail?: string;
  profileImage?: string;
  login: (user: any) => void;
  logout: () => void;
  registrationForm: { // Yeni: Kayıt formu verileri
    first_name: string;
    last_name: string;
    father_name: string;
    phone: string;
    email: string;
    password?: string;
  };
  setRegistrationFormValue: (name: string, value: string) => void; // Yeni: Form verilerini güncelleme fonksiyonu
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userName: undefined,
  userSurname: undefined,
  userEmail: undefined,
  profileImage: undefined,
  login: (user) =>
    set({
      isLoggedIn: true,
      userName: user.first_name,
      userSurname: user.last_name,
      userEmail: user.email,
      profileImage: '/img/avatar.jpeg',
    }),
  logout: () =>
    set({
      isLoggedIn: false,
      userName: undefined,
      userSurname: undefined,
      userEmail: undefined,
      profileImage: undefined,
    }),
  registrationForm: { // Başlangıç değerleri
    first_name: '',
    last_name: '',
    father_name: '',
    email: '',
    phone: '',
  },
  setRegistrationFormValue: (name, value) =>
    set((state) => ({
      registrationForm: {
        ...state.registrationForm,
        [name]: value,
      },
    })),
}));

export default useAuthStore;