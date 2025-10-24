// src/lib/api/client.ts
import axios from 'axios';
import { authEndpoints } from './endpoints';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // ✅ Ne PAS intercepter les 401 sur /auth/profile si on est sur /login
    const isProfileRequest = originalRequest.url === authEndpoints.profile;
    const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';
    
    if (isProfileRequest && isOnLoginPage && error.response?.status === 401) {
      // ✅ Laisser passer l'erreur sans essayer de refresh
      return Promise.reject(error);
    }

    // ✅ Ne PAS essayer de refresh si le refresh lui-même échoue
    if (originalRequest.url === authEndpoints.refresh && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // ✅ Gérer les erreurs 401 (token expiré)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post(authEndpoints.refresh);
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);
        
        if (typeof window !== 'undefined') {
          console.log('🔴 Session expirée, redirection vers login...');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;