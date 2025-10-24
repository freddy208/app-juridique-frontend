// src/lib/api/client.ts
import axios from 'axios';
import { authEndpoints } from './endpoints';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true, // ✅ Déjà bon - envoie les cookies automatiquement
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

    // ✅ Gérer les erreurs 401 (token expiré)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue les requêtes pendant le refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // ✅ MODIFICATION : Plus besoin de passer le token, les cookies sont déjà envoyés
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Appeler le endpoint refresh (les cookies sont envoyés automatiquement)
        await apiClient.post(authEndpoints.refresh);

        // ✅ MODIFICATION : Plus besoin de gérer les tokens manuellement
        // Les nouveaux cookies sont automatiquement définis par le backend
        processQueue(null);

        // Rejouer la requête originale
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);

        // Si refresh échoue, rediriger vers login
        if (typeof window !== 'undefined') {
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