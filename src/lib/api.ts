/**
 * Configuration Axios centralisée
 * Gère les interceptors, refresh token, et gestion d'erreurs
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// URL de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Instance Axios configurée
 */
export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * INTERCEPTOR REQUEST
 * Ajoute automatiquement le token JWT à chaque requête
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupère le token depuis localStorage
    const accessToken = 
      typeof window !== "undefined" 
        ? localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
        : null;

    // Ajoute le token dans les headers si disponible
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log de la requête (dev uniquement)
    if (process.env.NODE_ENV === "development") {
      console.log(`🔵 API REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Erreur dans l'interceptor request:", error);
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR RESPONSE
 * Gère les erreurs globales et le refresh token
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Log de la réponse (dev uniquement)
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si erreur 401 (token expiré) et pas déjà en train de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si refresh en cours, mettre en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Tente de refresh le token
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
          : null;

      if (!refreshToken) {
        // Pas de refresh token, rediriger vers login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Appel API refresh
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Sauvegarde le nouveau token
        if (typeof window !== "undefined") {
          if (localStorage.getItem("refresh_token")) {
            localStorage.setItem("access_token", access_token);
          } else {
            sessionStorage.setItem("access_token", access_token);
          }
        }

        // Mise à jour du header
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers!["Authorization"] = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        // Retry la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        // Échec du refresh, déconnecter
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Gestion des autres erreurs
    console.error(`❌ API ERROR: ${error.response?.status} - ${error.message}`);

    // Erreurs spécifiques
    if (error.response?.status === 403) {
      console.error("⚠️ Accès refusé (permissions insuffisantes)");
    } else if (error.response?.status === 404) {
      console.error("⚠️ Ressource non trouvée");
    } else if (error.response?.status === 500) {
      console.error("⚠️ Erreur serveur");
    }

    return Promise.reject(error);
  }
);

/**
 * Helper pour stocker le token après login
 */
export const setAuthToken = (token: string, rememberMe: boolean = false) => {
  if (typeof window !== "undefined") {
    if (rememberMe) {
      localStorage.setItem("access_token", token);
    } else {
      sessionStorage.setItem("access_token", token);
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

/**
 * Helper pour supprimer le token lors du logout
 */
export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;