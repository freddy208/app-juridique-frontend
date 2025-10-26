/**
 * ============================================
 * API ENDPOINTS
 * ============================================
 * Tous les endpoints de l'API avec typage strict
 */

// ============================================
// AUTH ENDPOINTS
// ============================================

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
  getAll: "/users",
  search: "/users/search",
  stats: "/users/stats",
  performance: "/users/performance",
  roles: "/users/roles",
  statuses: "/users/statuses",
  getMyProfile: "/users/me",
  updateMyProfile: "/users/me",
  create: "/users",
  getById: (id: string) => `/users/${id}`,
  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,
  changeStatus: (id: string) => `/users/${id}/status`,
  bulkAction: "/users/bulk-action",
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

// ============================================
// DOSSIERS ENDPOINTS
// ============================================

export const dossiersEndpoints = {
  getAll: "/dossiers",
  getById: (id: string) => `/dossiers/${id}`,
  create: "/dossiers",
  update: (id: string) => `/dossiers/${id}`,
  delete: (id: string) => `/dossiers/${id}`,
  search: "/dossiers/search",
  archive: (id: string) => `/dossiers/${id}/archive`,
  getDocuments: (id: string) => `/dossiers/${id}/documents`,
  getTimeline: (id: string) => `/dossiers/${id}/timeline`,
  getFinances: (id: string) => `/dossiers/${id}/finances`,
  getProcedures: (id: string) => `/dossiers/${id}/procedures`,
} as const

// ============================================
// DOCUMENTS ENDPOINTS
// ============================================

export const documentsEndpoints = {
  getAll: "/documents",
  getById: (id: string) => `/documents/${id}`,
  upload: "/documents/upload",
  update: (id: string) => `/documents/${id}`,
  delete: (id: string) => `/documents/${id}`,
  search: "/documents/search",
  getVersions: (id: string) => `/documents/${id}/versions`,
  download: (id: string) => `/documents/${id}/download`,
} as const

// ============================================
// TACHES ENDPOINTS
// ============================================

export const tachesEndpoints = {
  getAll: "/taches",
  getById: (id: string) => `/taches/${id}`,
  create: "/taches",
  update: (id: string) => `/taches/${id}`,
  delete: (id: string) => `/taches/${id}`,
  assign: (id: string) => `/taches/${id}/assign`,
  updateStatus: (id: string) => `/taches/${id}/status`,
  getMyTasks: "/taches/my-tasks",
  getTeamTasks: "/taches/team-tasks",
} as const

// ============================================
// CALENDRIER ENDPOINTS
// ============================================

export const calendrierEndpoints = {
  getAll: "/calendrier",
  getById: (id: string) => `/calendrier/${id}`,
  create: "/calendrier",
  update: (id: string) => `/calendrier/${id}`,
  delete: (id: string) => `/calendrier/${id}`,
  getEvents: "/calendrier/events",
  syncWithGoogle: "/calendrier/sync-google",
  exportICal: "/calendrier/export-ical",
} as const

// ============================================
// FINANCES ENDPOINTS
// ============================================

export const financesEndpoints = {
  getOverview: "/finances/overview",
  getHonoraires: "/finances/honoraires",
  getPaiements: "/finances/paiements",
  getProvisions: "/finances/provisions",
  getDepenses: "/finances/depenses",
  getFactures: "/finances/factures",
  getTresorerie: "/finances/tresorerie",
  createHonoraire: "/finances/honoraires",
  createPaiement: "/finances/paiements",
  createProvision: "/finances/provisions",
  createDepense: "/finances/depenses",
  createFacture: "/finances/factures",
  approveDepense: (id: string) => `/finances/depenses/${id}/approve`,
  validatePaiement: (id: string) => `/finances/paiements/${id}/validate`,
} as const

// ============================================
// TYPE EXPORTS
// ============================================

export type AuthEndpoint = (typeof authEndpoints)[keyof typeof authEndpoints]
export type UsersEndpoint = (typeof usersEndpoints)[keyof typeof usersEndpoints]
export type ClientsEndpoint = (typeof clientsEndpoints)[keyof typeof clientsEndpoints]
export type DossiersEndpoint = (typeof dossiersEndpoints)[keyof typeof dossiersEndpoints]
export type DocumentsEndpoint = (typeof documentsEndpoints)[keyof typeof documentsEndpoints]
export type TachesEndpoint = (typeof tachesEndpoints)[keyof typeof tachesEndpoints]
export type CalendrierEndpoint = (typeof calendrierEndpoints)[keyof typeof calendrierEndpoints]
export type FinancesEndpoint = (typeof financesEndpoints)[keyof typeof financesEndpoints]
