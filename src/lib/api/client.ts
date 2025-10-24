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

    // ✅ Liste des routes qui ne doivent PAS déclencher un refresh
    const noRefreshRoutes = [
      authEndpoints.login,
      authEndpoints.refresh,
      authEndpoints.forgotPassword,
      authEndpoints.resetPassword,
    ];

    const isNoRefreshRoute = noRefreshRoutes.some(route => 
      originalRequest.url?.includes(route)
    );

    // ✅ Ne pas intercepter les erreurs sur les routes d'authentification
    if (isNoRefreshRoute && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // ✅ Pour /auth/profile sur la page login, laisser passer l'erreur
    const isProfileRequest = originalRequest.url?.includes(authEndpoints.profile);
    const isOnLoginPage = typeof window !== 'undefined' && 
      (window.location.pathname === '/login' || window.location.pathname === '/');
    
    if (isProfileRequest && isOnLoginPage && error.response?.status === 401) {
      console.log('ℹ️ Utilisateur non connecté sur la page de login (comportement normal)');
      return Promise.reject(error);
    }

    // ✅ Gérer les erreurs 401 (token expiré) uniquement pour les routes protégées
    if (error.response?.status === 401 && !originalRequest._retry && !isNoRefreshRoute) {
      if (isRefreshing) {
        // Mettre la requête en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Tentative de rafraîchissement du token...');
        await apiClient.post(authEndpoints.refresh);
        console.log('✅ Token rafraîchi avec succès');
        
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        console.error('❌ Échec du rafraîchissement du token');
        processQueue(err);
        
        // Rediriger vers login seulement si on n'y est pas déjà
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
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