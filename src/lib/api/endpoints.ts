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

// src/lib/api/endpoints.ts (ajout à la fin du fichier)

// ============================================
// DOSSIERS ENDPOINTS
// ============================================

export const dossiersEndpoints = {
  // CRUD de base
  create: "/dossiers",
  getAll: "/dossiers",
  getById: (id: string) => `/dossiers/${id}`,
  update: (id: string) => `/dossiers/${id}`,
  delete: (id: string) => `/dossiers/${id}`,

  // Actions spécifiques
  getStats: "/dossiers/stats",
  changeStatut: (id: string) => `/dossiers/${id}/statut`,
  assignerResponsable: (id: string) => `/dossiers/${id}/responsable`,

  // Requêtes filtrées
  getByClient: (clientId: string) => `/dossiers/client/${clientId}`,
  getByResponsable: (responsableId: string) => `/dossiers/responsable/${responsableId}`,
  getByType: (type: string) => `/dossiers/type/${type}`,
  getByStatut: (statut: string) => `/dossiers/statut/${statut}`,
  getEnCours: "/dossiers/en-cours",
  getClos: "/dossiers/clos",
  getArchives: "/dossiers/archives",
} as const

// ============================================
// TYPE EXPORTS (ajout à la fin du fichier)
// ============================================

export type DossiersEndpoint = (typeof dossiersEndpoints)[keyof typeof dossiersEndpoints]
// ============================================
// TYPE EXPORTS
// ============================================

export type AuthEndpoint = (typeof authEndpoints)[keyof typeof authEndpoints]
export type UsersEndpoint = (typeof usersEndpoints)[keyof typeof usersEndpoints]
export type ClientsEndpoint = (typeof clientsEndpoints)[keyof typeof clientsEndpoints]