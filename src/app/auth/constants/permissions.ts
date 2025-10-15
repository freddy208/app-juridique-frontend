/**
 * Matrice de permissions par défaut
 * Utilisée comme fallback si l'API n'est pas disponible
 * Basée sur les besoins d'un cabinet juridique camerounais
 */

import { RoleUtilisateur, PermissionsMatrix } from "../types/permissions.type";
// Helper pour créer des permissions rapidement
const createPermission = (lecture: boolean, ecriture: boolean, suppression: boolean) => ({
  lecture,
  ecriture,
  suppression,
});

// Permissions complètes (tout autorisé)
const FULL_ACCESS = createPermission(true, true, true);

// Lecture + Écriture (pas de suppression)
const READ_WRITE = createPermission(true, true, false);

// Lecture seule
const READ_ONLY = createPermission(true, false, false);

// Aucun accès
const NO_ACCESS = createPermission(false, false, false);

/**
 * MATRICE DE PERMISSIONS PAR RÔLE
 */
export const DEFAULT_PERMISSIONS: Record<RoleUtilisateur, PermissionsMatrix> = {
  // ========================================
  // ADMIN - Accès total
  // ========================================
  ADMIN: {
    dashboard: FULL_ACCESS,
    dossiers: FULL_ACCESS,
    clients: FULL_ACCESS,
    documents: FULL_ACCESS,
    taches: FULL_ACCESS,
    calendrier: FULL_ACCESS,
    messages: FULL_ACCESS,
    facturation: FULL_ACCESS,
    reporting: FULL_ACCESS,
    parametres: FULL_ACCESS,
    utilisateurs: FULL_ACCESS,
    permissions: FULL_ACCESS,
    audit: FULL_ACCESS,
    archives: FULL_ACCESS,
  },

  // ========================================
  // DG (Directeur Général) - Accès quasi-total
  // ========================================
  DG: {
    dashboard: FULL_ACCESS,
    dossiers: FULL_ACCESS,
    clients: FULL_ACCESS,
    documents: FULL_ACCESS,
    taches: FULL_ACCESS,
    calendrier: FULL_ACCESS,
    messages: FULL_ACCESS,
    facturation: FULL_ACCESS,
    reporting: FULL_ACCESS,
    parametres: READ_WRITE,
    utilisateurs: READ_WRITE,
    permissions: READ_ONLY,
    audit: FULL_ACCESS,
    archives: READ_WRITE,
  },

  // ========================================
  // AVOCAT - Gestion de ses dossiers
  // ========================================
  AVOCAT: {
    dashboard: READ_ONLY,
    dossiers: READ_WRITE,
    clients: READ_WRITE,
    documents: READ_WRITE,
    taches: READ_WRITE,
    calendrier: READ_WRITE,
    messages: FULL_ACCESS,
    facturation: READ_WRITE,
    reporting: READ_ONLY,
    parametres: { lecture: true, ecriture: true, suppression: false },
    utilisateurs: READ_ONLY,
    permissions: NO_ACCESS,
    audit: NO_ACCESS,
    archives: READ_ONLY,
  },

  // ========================================
  // SECRÉTAIRE - Support administratif
  // ========================================
  SECRETAIRE: {
    dashboard: READ_ONLY,
    dossiers: READ_ONLY,
    clients: READ_WRITE,
    documents: READ_WRITE,
    taches: READ_WRITE,
    calendrier: READ_WRITE,
    messages: READ_WRITE,
    facturation: READ_WRITE,
    reporting: NO_ACCESS,
    parametres: { lecture: true, ecriture: true, suppression: false },
    utilisateurs: READ_ONLY,
    permissions: NO_ACCESS,
    audit: NO_ACCESS,
    archives: NO_ACCESS,
  },

  // ========================================
  // JURISTE - Conseil juridique
  // ========================================
  JURISTE: {
    dashboard: READ_ONLY,
    dossiers: READ_ONLY,
    clients: READ_ONLY,
    documents: READ_WRITE,
    taches: READ_WRITE,
    calendrier: READ_WRITE,
    messages: FULL_ACCESS,
    facturation: NO_ACCESS,
    reporting: NO_ACCESS,
    parametres: { lecture: true, ecriture: true, suppression: false },
    utilisateurs: READ_ONLY,
    permissions: NO_ACCESS,
    audit: NO_ACCESS,
    archives: NO_ACCESS,
  },

  // ========================================
  // ASSISTANT - Support général
  // ========================================
  ASSISTANT: {
    dashboard: READ_ONLY,
    dossiers: READ_ONLY,
    clients: READ_ONLY,
    documents: { lecture: true, ecriture: true, suppression: false },
    taches: READ_WRITE,
    calendrier: READ_ONLY,
    messages: READ_WRITE,
    facturation: NO_ACCESS,
    reporting: NO_ACCESS,
    parametres: { lecture: true, ecriture: true, suppression: false },
    utilisateurs: READ_ONLY,
    permissions: NO_ACCESS,
    audit: NO_ACCESS,
    archives: NO_ACCESS,
  },

  // ========================================
  // STAGIAIRE - Formation (accès limité)
  // ========================================
  STAGIAIRE: {
    dashboard: READ_ONLY,
    dossiers: READ_ONLY,
    clients: READ_ONLY,
    documents: READ_ONLY,
    taches: { lecture: true, ecriture: true, suppression: false },
    calendrier: READ_ONLY,
    messages: READ_WRITE,
    facturation: NO_ACCESS,
    reporting: NO_ACCESS,
    parametres: { lecture: true, ecriture: true, suppression: false },
    utilisateurs: READ_ONLY,
    permissions: NO_ACCESS,
    audit: NO_ACCESS,
    archives: NO_ACCESS,
  },
};

/**
 * Permissions minimales (fallback sécurisé si rôle inconnu)
 */
export const MINIMAL_PERMISSIONS: PermissionsMatrix = {
  dashboard: READ_ONLY,
  dossiers: NO_ACCESS,
  clients: NO_ACCESS,
  documents: NO_ACCESS,
  taches: READ_ONLY,
  calendrier: READ_ONLY,
  messages: READ_ONLY,
  facturation: NO_ACCESS,
  reporting: NO_ACCESS,
  parametres: { lecture: true, ecriture: true, suppression: false },
  utilisateurs: NO_ACCESS,
  permissions: NO_ACCESS,
  audit: NO_ACCESS,
  archives: NO_ACCESS,
};

/**
 * Liste des modules accessibles par rôle (pour la sidebar)
 */
export const ACCESSIBLE_MODULES: Record<RoleUtilisateur, string[]> = {
  ADMIN: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
    "facturation",
    "reporting",
    "parametres",
  ],
  DG: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
    "facturation",
    "reporting",
    "parametres",
  ],
  AVOCAT: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
    "facturation",
  ],
  SECRETAIRE: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
    "facturation",
  ],
  JURISTE: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
  ],
  ASSISTANT: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
  ],
  STAGIAIRE: [
    "dashboard",
    "dossiers",
    "clients",
    "documents",
    "taches",
    "calendrier",
    "messages",
  ],
};