// src/lib/api/endpoints/correspondances.endpoints.ts

export const correspondancesEndpoints = {
  // CRUD de base
  create: "/correspondances",
  getAll: "/correspondances",
  getById: (id: string) => `/correspondances/${id}`,
  update: (id: string) => `/correspondances/${id}`,
  delete: (id: string) => `/correspondances/${id}`,

  // Actions spécifiques
  search: "/correspondances/search",
  getStats: "/correspondances/stats",

  // Requêtes filtrées
  getByClient: (clientId: string) => `/correspondances/client/${clientId}`,
  getByUtilisateur: (utilisateurId: string) => `/correspondances/utilisateur/${utilisateurId}`,

  // Endpoints pour l'utilisateur connecté
  getMyCorrespondances: "/correspondances/profile/me",
  getMyStats: "/correspondances/profile/me/stats",
} as const;

export type CorrespondancesEndpoint = typeof correspondancesEndpoints[keyof typeof correspondancesEndpoints];