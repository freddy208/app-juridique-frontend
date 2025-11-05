/**
 * ============================================
 * API ENDPOINTS
 * ============================================
 * Tous les endpoints de l'API avec typage strict
 */

// ============================================
// AUTH ENDPOINTS
// ============================================
// src/lib/api/endpoints
export const authEndpoints = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  changePassword: "/auth/change-password",
  profile: "/auth/profile",
} as const

// ============================================
// USERS ENDPOINTS
// ============================================

export const usersEndpoints = {
  // Les routes pour l'admin commencent par /utilisateurs
  getAll: "/utilisateurs",
  search: "/utilisateurs/search",
  stats: "/utilisateurs/stats",
  performance: "/utilisateurs/performance",
  roles: "/utilisateurs/roles",
  statuses: "/utilisateurs/statuses",
  create: "/utilisateurs",
  getById: (id: string) => `/utilisateurs/${id}`,
  update: (id: string) => `/utilisateurs/${id}`,
  delete: (id: string) => `/utilisateurs/${id}`,
  changeStatus: (id: string) => `/utilisateurs/${id}/status`,
  bulkAction: "/utilisateurs/bulk-action",

  // Les routes pour le profil de l'utilisateur connecté commencent par /utilisateurs/profile
  getMyProfile: "/utilisateurs/profile/me", // <--- CORRECTION ICI
  updateMyProfile: "/utilisateurs/profile/me", // <--- CORRECTION ICI
  changeMyPassword: "/utilisateurs/profile/me/changer-mot-de-passe", // <--- NOUVELLE ENDPOINT NÉCESSAIRE
  getMyStats: "/utilisateurs/profile/me/stats",
  getMyDossiers: "/utilisateurs/profile/me/dossiers",
  getMyTaches: "/utilisateurs/profile/me/taches",
  getMyEvenements: "/utilisateurs/profile/me/evenements",
  getMyNotifications: "/utilisateurs/profile/me/notifications",
  markMyNotificationsAsRead: "/utilisateurs/profile/me/notifications/lire",
} as const

// ============================================
// CLIENTS ENDPOINTS
// ============================================

export const clientsEndpoints = {
  // Liste et recherche
  getAll: "/clients",
  search: "/clients/search",

  // Stats et performance
  stats: "/clients/stats",
  inactive: "/clients/inactive",
  statuses: "/clients/statuses",

  // CRUD clients
  create: "/clients",
  getById: (id: string) => `/clients/${id}`,
  update: (id: string) => `/clients/${id}`,
  delete: (id: string) => `/clients/${id}`,

  // Stats et détails client
  getClientStats: (id: string) => `/clients/${id}/stats`,
  getClientPerformance: (id: string) => `/clients/${id}/performance`,
  getActivity: (id: string) => `/clients/${id}/activity`,
  getFinancialSummary: (id: string) => `/clients/${id}/financial-summary`,

  // Actions spéciales
  changeStatus: (id: string) => `/clients/${id}/status`,
  markVisit: (id: string) => `/clients/${id}/mark-visit`,
  addDocument: (id: string) => `/clients/${id}/documents`,
  addNote: (id: string) => `/clients/${id}/notes`,
  bulkAction: "/clients/bulk-action",
} as const

// src/lib/endpoints.ts (ajout à la fin du fichier)

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

export const dashboardEndpoints = {
  get: "/dashboard",
  invalidateCache: "/dashboard/invalidate-cache",
} as const

// ============================================
// TYPE EXPORTS
// ============================================

export type AuthEndpoint = (typeof authEndpoints)[keyof typeof authEndpoints]
export type UsersEndpoint = (typeof usersEndpoints)[keyof typeof usersEndpoints]
export type ClientsEndpoint = (typeof clientsEndpoints)[keyof typeof clientsEndpoints]