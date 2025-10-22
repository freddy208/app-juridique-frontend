export const authEndpoints = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  changePassword: '/auth/change-password',
  profile: '/auth/profile',
}

export const usersEndpoints = {
  getAll: '/users',
  getById: (id: string) => `/users/${id}`,
  create: '/users',
  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,
  updateProfile: '/users/profile',
  changeStatus: (id: string) => `/users/${id}/status`,
}

export const clientsEndpoints = {
  getAll: '/clients',
  getById: (id: string) => `/clients/${id}`,
  create: '/clients',
  update: (id: string) => `/clients/${id}`,
  delete: (id: string) => `/clients/${id}`,
  search: '/clients/search',
  merge: '/clients/merge',
  getDossiers: (id: string) => `/clients/${id}/dossiers`,
  getDocuments: (id: string) => `/clients/${id}/documents`,
  getFinances: (id: string) => `/clients/${id}/finances`,
}

export const dossiersEndpoints = {
  getAll: '/dossiers',
  getById: (id: string) => `/dossiers/${id}`,
  create: '/dossiers',
  update: (id: string) => `/dossiers/${id}`,
  delete: (id: string) => `/dossiers/${id}`,
  search: '/dossiers/search',
  archive: (id: string) => `/dossiers/${id}/archive`,
  getDocuments: (id: string) => `/dossiers/${id}/documents`,
  getTimeline: (id: string) => `/dossiers/${id}/timeline`,
  getFinances: (id: string) => `/dossiers/${id}/finances`,
  getProcedures: (id: string) => `/dossiers/${id}/procedures`,
}

export const documentsEndpoints = {
  getAll: '/documents',
  getById: (id: string) => `/documents/${id}`,
  upload: '/documents/upload',
  update: (id: string) => `/documents/${id}`,
  delete: (id: string) => `/documents/${id}`,
  search: '/documents/search',
  getVersions: (id: string) => `/documents/${id}/versions`,
  download: (id: string) => `/documents/${id}/download`,
}

export const tachesEndpoints = {
  getAll: '/taches',
  getById: (id: string) => `/taches/${id}`,
  create: '/taches',
  update: (id: string) => `/taches/${id}`,
  delete: (id: string) => `/taches/${id}`,
  assign: (id: string) => `/taches/${id}/assign`,
  updateStatus: (id: string) => `/taches/${id}/status`,
  getMyTasks: '/taches/my-tasks',
  getTeamTasks: '/taches/team-tasks',
}

export const calendrierEndpoints = {
  getAll: '/calendrier',
  getById: (id: string) => `/calendrier/${id}`,
  create: '/calendrier',
  update: (id: string) => `/calendrier/${id}`,
  delete: (id: string) => `/calendrier/${id}`,
  getEvents: '/calendrier/events',
  syncWithGoogle: '/calendrier/sync-google',
  exportICal: '/calendrier/export-ical',
}

export const financesEndpoints = {
  getOverview: '/finances/overview',
  getHonoraires: '/finances/honoraires',
  getPaiements: '/finances/paiements',
  getProvisions: '/finances/provisions',
  getDepenses: '/finances/depenses',
  getFactures: '/finances/factures',
  getTresorerie: '/finances/tresorerie',
  createHonoraire: '/finances/honoraires',
  createPaiement: '/finances/paiements',
  createProvision: '/finances/provisions',
  createDepense: '/finances/depenses',
  createFacture: '/finances/factures',
  approveDepense: (id: string) => `/finances/depenses/${id}/approve`,
  validatePaiement: (id: string) => `/finances/paiements/${id}/validate`,
}