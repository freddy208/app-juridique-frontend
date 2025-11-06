/**
 * ============================================
 * API ENDPOINTS
 * ============================================
 * Tous les endpoints de l'API avec typage strict
 */

import { StatutDocument } from "../types/documents.types"

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
  
  // Documents d'identité
  uploadDocumentIdentite: (id: string) => `/clients/${id}/documents-identite`,
  getDocumentsIdentite: (id: string) => `/clients/${id}/documents-identite`,
  deleteDocumentIdentite: (id: string, documentId: string) => `/clients/${id}/documents-identite/${documentId}`,
} as const

export const dashboardEndpoints = {
  get: "/dashboard",
  invalidateCache: "/dashboard/invalidate-cache",
} as const

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
export type DossiersEndpoint = (typeof dossiersEndpoints)[keyof typeof dossiersEndpoints]

// Ajouter à la fin du fichier src/lib/api/endpoints.ts


export const tachesEndpoints = {
  // CRUD de base
  create: "/taches",
  getAll: "/taches",
  getById: (id: string) => `/taches/${id}`,
  update: (id: string) => `/taches/${id}`,
  delete: (id: string) => `/taches/${id}`,

  // Actions spécifiques
  search: "/taches/search",
  getStats: "/taches/stats",
  getEnRetard: "/taches/en-retard",
  getEcheanceProche: "/taches/echeance-proche",
  changerStatut: (id: string) => `/taches/${id}/statut`,
  assigner: (id: string) => `/taches/${id}/assigner`,

  // Requêtes filtrées
  getByDossier: (dossierId: string) => `/taches/dossier/${dossierId}`,
  getByAssignee: (assigneeId: string) => `/taches/assignee/${assigneeId}`,
  getByCreateur: (creeParId: string) => `/taches/createur/${creeParId}`,

  // Endpoints pour l'utilisateur connecté
  getMyTaches: "/taches/profile/me",
  getMyTachesEnRetard: "/taches/profile/me/en-retard",
  getMyStats: "/taches/profile/me/stats",
} as const

export type TachesEndpoint = (typeof tachesEndpoints)[keyof typeof tachesEndpoints]

export const evenementsEndpoints = {
  // CRUD de base
  create: "/evenements",
  getAll: "/evenements",
  getById: (id: string) => `/evenements/${id}`,
  update: (id: string) => `/evenements/${id}`,
  delete: (id: string) => `/evenements/${id}`,
  
  // Actions spécifiques
  search: "/evenements/search",
  getStats: "/evenements/stats",
  getAujourdHui: "/evenements/aujourd-hui",
  getCetteSemaine: "/evenements/cette-semaine",
  getCeMois: "/evenements/ce-mois",
  getAVenir: "/evenements/a-venir",
  changerStatut: (id: string) => `/evenements/${id}/statut`,
  
  // Requêtes filtrées
  getByDossier: (dossierId: string) => `/evenements/dossier/${dossierId}`,
  getByCreateur: (creeParId: string) => `/evenements/createur/${creeParId}`,
  
  // Endpoints pour l'utilisateur connecté
  getMyEvenements: "/evenements/profile/me",
  getMyEvenementsAujourdHui: "/evenements/profile/me/aujourd-hui",
  getMyEvenementsAVenir: "/evenements/profile/me/a-venir",
  getMyStats: "/evenements/profile/me/stats",
} as const

export const notesEndpoints = {
  // CRUD de base
  create: "/notes",
  getAll: "/notes",
  getById: (id: string) => `/notes/${id}`,
  update: (id: string) => `/notes/${id}`,
  delete: (id: string) => `/notes/${id}`,

  // Actions spécifiques
  search: "/notes/search",
  getStats: "/notes/stats",

  // Requêtes filtrées
  getByClient: (clientId: string) => `/notes/client/${clientId}`,
  getByDossier: (dossierId: string) => `/notes/dossier/${dossierId}`,
  getByUtilisateur: (utilisateurId: string) => `/notes/utilisateur/${utilisateurId}`,

  // Endpoints pour l'utilisateur connecté
  getMyNotes: "/notes/profile/me",
  getMyStats: "/notes/profile/me/stats",
} as const

export type NotesEndpoint = (typeof notesEndpoints)[keyof typeof notesEndpoints]

export type EvenementsEndpoint = (typeof evenementsEndpoints)[keyof typeof evenementsEndpoints]

export type AuthEndpoint = (typeof authEndpoints)[keyof typeof authEndpoints]
export type UsersEndpoint = (typeof usersEndpoints)[keyof typeof usersEndpoints]
export type ClientsEndpoint = (typeof clientsEndpoints)[keyof typeof clientsEndpoints]

// src/lib/api/endpoints.ts (ajouter à la fin du fichier)

export const commentairesEndpoints = {
  // CRUD de base
  create: "/commentaires",
  getAll: "/commentaires",
  getById: (id: string) => `/commentaires/${id}`,
  update: (id: string) => `/commentaires/${id}`,
  delete: (id: string) => `/commentaires/${id}`,

  // Actions spécifiques
  search: "/commentaires/search",
  getStats: "/commentaires/stats",

  // Requêtes filtrées
  getByDocument: (documentId: string) => `/commentaires/document/${documentId}`,
  getByTache: (tacheId: string) => `/commentaires/tache/${tacheId}`,
  getByUtilisateur: (utilisateurId: string) => `/commentaires/utilisateur/${utilisateurId}`,

  // Endpoints pour l'utilisateur connecté
  getMyCommentaires: "/commentaires/profile/me",
  getMyStats: "/commentaires/profile/me/stats",
} as const

export type CommentairesEndpoint = (typeof commentairesEndpoints)[keyof typeof commentairesEndpoints]

// Ajouter à la fin du fichier src/lib/api/endpoints.ts

export const messagerieEndpoints = {
  // Gestion des discussions
  createDiscussion: "/messagerie/discussions",
  getAllDiscussions: "/messagerie/discussions",
  getDiscussionById: (id: string) => `/messagerie/discussions/${id}`,
  updateDiscussion: (id: string) => `/messagerie/discussions/${id}`,
  deleteDiscussion: (id: string) => `/messagerie/discussions/${id}`,
  getDiscussionsByDossier: (dossierId: string) => `/messagerie/discussions/dossier/${dossierId}`,
  
  // Gestion des messages
  createMessage: "/messagerie/messages",
  getAllMessages: "/messagerie/messages",
  getMessageById: (id: string) => `/messagerie/messages/${id}`,
  updateMessage: (id: string) => `/messagerie/messages/${id}`,
  deleteMessage: (id: string) => `/messagerie/messages/${id}`,
  getMessagesByDiscussion: (discussionId: string) => `/messagerie/discussions/discussion/${discussionId}/messages`,
  
  // Gestion des réactions
  addReaction: (messageId: string) => `/messagerie/messages/${messageId}/reactions`,
  removeReaction: (messageId: string) => `/messagerie/messages/${messageId}/reactions`,
  
  // Statistiques
  getStats: "/messagerie/stats",
  getMyStats: "/messagerie/stats?utilisateurId=",
} as const

export type MessagerieEndpoint = (typeof messagerieEndpoints)[keyof typeof messagerieEndpoints]
// src/lib/api/endpoints.ts (ajout à la fin du fichier)

export const documentsEndpoints = {
  // CRUD de base
  create: "/documents",
  getAll: "/documents",
  getById: (id: string) => `/documents/${id}`,
  update: (id: string) => `/documents/${id}`,
  delete: (id: string) => `/documents/${id}`,

  // Actions spécifiques
  getStats: "/documents/stats",
  searchByOCR: "/documents/search",
  getVersions: (id: string) => `/documents/${id}/versions`,
  
  // Requêtes filtrées
  getByDossier: (dossierId: string) => `/documents?dossierId=${dossierId}`,
  getByUser: (userId: string) => `/documents?televersePar=${userId}`,
  getByType: (type: string) => `/documents?type=${type}`,
  getByStatut: (statut: StatutDocument) => `/documents?statut=${statut}`,
} as const

export type DocumentsEndpoint = (typeof documentsEndpoints)[keyof typeof documentsEndpoints]

// Endpoints pour les paiements
export const paiementsEndpoints = {
  // CRUD de base
  create: "/paiements",
  getAll: "/paiements",
  getById: (id: string) => `/paiements/${id}`,
  update: (id: string) => `/paiements/${id}`,
  delete: (id: string) => `/paiements/${id}`,
  
  // Actions spécifiques
  stats: "/paiements/stats",
  valider: (id: string) => `/paiements/${id}/valider`,
  rejeter: (id: string) => `/paiements/${id}/rejeter`,
  
  // Requêtes filtrées
  getByClient: (clientId: string) => `/paiements?clientId=${clientId}`,
  getByFacture: (factureId: string) => `/paiements?factureId=${factureId}`,
  getByHonoraire: (honoraireId: string) => `/paiements?honoraireId=${honoraireId}`,
  getByStatut: (statut: string) => `/paiements?statut=${statut}`,
  getByMode: (mode: string) => `/paiements?mode=${mode}`,
  getByDateRange: (dateMin: string, dateMax: string) => `/paiements?dateMin=${dateMin}&dateMax=${dateMax}`,
} as const

export type PaiementsEndpoint = (typeof paiementsEndpoints)[keyof typeof paiementsEndpoints]

// src/lib/api/endpoints.ts (ajout à la fin du fichier)

export const facturesEndpoints = {
  // CRUD de base
  create: "/factures",
  getAll: "/factures",
  getById: (id: string) => `/factures/${id}`,
  update: (id: string) => `/factures/${id}`,
  delete: (id: string) => `/factures/${id}`,

  // Actions spécifiques
  getStats: "/factures/stats",
  getEnRetard: "/factures/en-retard",
  envoyerFacture: (id: string) => `/factures/${id}/envoyer`,
  
  // Requêtes filtrées
  getByClient: (clientId: string) => `/factures?clientId=${clientId}`,
  getByDossier: (dossierId: string) => `/factures?dossierId=${dossierId}`,
  getByStatut: (statut: string) => `/factures?statut=${statut}`,
} as const

export type FacturesEndpoint = (typeof facturesEndpoints)[keyof typeof facturesEndpoints]

// Ajouter à la fin du fichier src/lib/api/endpoints.ts

export const honorairesEndpoints = {
  // CRUD de base
  create: "/honoraires",
  getAll: "/honoraires",
  getById: (id: string) => `/honoraires/${id}`,
  update: (id: string) => `/honoraires/${id}`,
  delete: (id: string) => `/honoraires/${id}`,

  // Actions spécifiques
  getStats: "/honoraires/stats",
  getBaremesOHADA: "/honoraires/baremes-ohada",
  calculerBareme: "/honoraires/calculer-bareme",
  getEnRetard: "/honoraires/en-retard",
  
  // Mise à jour du statut
  updateStatut: (id: string) => `/honoraires/${id}/statut`,
} as const

export type HonorairesEndpoint = (typeof honorairesEndpoints)[keyof typeof honorairesEndpoints]

// AJOUT DES ENDPOINTS POUR LES PROVISIONS
export const provisionsEndpoints = {
  // CRUD de base
  create: "/provisions",
  getAll: "/provisions",
  getById: (id: string) => `/provisions/${id}`,
  update: (id: string) => `/provisions/${id}`,
  delete: (id: string) => `/provisions/${id}`,

  // Actions spécifiques
  getStats: "/provisions/stats",
  getEpuisees: "/provisions/epuisees",
  ajouterMouvement: (id: string) => `/provisions/${id}/mouvements`,
  restituer: (id: string) => `/provisions/${id}/restituer`,
  
  // Requêtes filtrées
  getByClient: (clientId: string) => `/provisions?clientId=${clientId}`,
  getByDossier: (dossierId: string) => `/provisions?dossierId=${dossierId}`,
  getByStatut: (statut: string) => `/provisions?statut=${statut}`,
  getByDateRange: (dateMin: string, dateMax: string) => `/provisions?dateMin=${dateMin}&dateMax=${dateMax}`,
} as const

export type ProvisionsEndpoint = (typeof provisionsEndpoints)[keyof typeof provisionsEndpoints]

// src/lib/api/endpoints.ts (ajout à la fin du fichier)

export const depensesEndpoints = {
  // CRUD de base
  create: "/depenses",
  getAll: "/depenses",
  getById: (id: string) => `/depenses/${id}`,
  update: (id: string) => `/depenses/${id}`,
  delete: (id: string) => `/depenses/${id}`,

  // Actions spécifiques
  getStats: "/depenses/stats",
  getEnAttente: "/depenses/en-attente",
  valider: (id: string) => `/depenses/${id}/valider`,
  rejeter: (id: string) => `/depenses/${id}/rejeter`,
  
  // Requêtes filtrées
  getByDossier: (dossierId: string) => `/depenses/dossier/${dossierId}`,
} as const

export type DepensesEndpoint = (typeof depensesEndpoints)[keyof typeof depensesEndpoints]

// src/lib/api/endpoints.ts (ajout à la fin du fichier)

export const jurisprudenceEndpoints = {
  // Gestion des jurisprudences
  getAll: "/jurisprudence",
  getById: (id: string) => `/jurisprudence/${id}`,
  create: "/jurisprudence",
  update: (id: string) => `/jurisprudence/${id}`,
  delete: (id: string) => `/jurisprudence/${id}`,
  
  // Gestion des associations dossier-jurisprudence
  getAllDossiersJurisprudences: "/jurisprudence/dossiers",
  getDossierJurisprudenceById: (id: string) => `/jurisprudence/dossiers/${id}`,
  createDossierJurisprudence: "/jurisprudence/dossiers",
  updateDossierJurisprudence: (id: string) => `/jurisprudence/dossiers/${id}`,
  deleteDossierJurisprudence: (id: string) => `/jurisprudence/dossiers/${id}`,
  
  // Recherche et recommandations
  search: (query: string) => `/jurisprudence/search/${query}`,
  getSimilaires: (id: string) => `/jurisprudence/${id}/similaires`,
  getRecommandees: (dossierId: string) => `/jurisprudence/dossiers/${dossierId}/recommandees`,
  
  // Statistiques
  getStats: "/jurisprudence/stats",
  
  // Endpoints spécifiques
  getByDossier: (dossierId: string) => `/jurisprudence/dossier/${dossierId}`,
} as const

export type JurisprudenceEndpoint = (typeof jurisprudenceEndpoints)[keyof typeof jurisprudenceEndpoints]