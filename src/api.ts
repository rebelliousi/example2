// api.ts
import axios from 'axios';
import { host } from './host';

const api = axios.create({
  baseURL: host,
  headers: {
    'Content-Type': 'application/json',
    'Accept-language': 'tk',
  },
});

// Request Interceptor: Her isteğe otomatik olarak Authorization başlığını ekler
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 hatası durumunda token'ı yeniler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Sonsuz döngüyü engellemek için

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Refresh token yoksa, kullanıcıyı login sayfasına yönlendir
          window.location.href = '/required_documents';
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(`${host}/api/auth/refresh_token`, {
          refresh: refreshToken,
        });

        const { access: newAccessToken, refresh: newRefreshToken } = refreshResponse.data.data;

        // Yeni token'ları localStorage'a kaydet
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Axios instance'ının header'ını güncelle
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Orijinal isteği tekrar dene
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token yenileme başarısız olduysa, kullanıcıyı login sayfasına yönlendir
        localStorage.removeItem('accessToken'); // GÜNCELLENDİ
        localStorage.removeItem('refreshToken'); // GÜNCELLENDİ
        window.location.href = '/required_documents';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;