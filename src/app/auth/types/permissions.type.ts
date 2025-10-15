/**
 * Types pour le système de permissions
 * Basé sur le schema Prisma : PermissionRole
 */

// Rôles disponibles (depuis Prisma enum)
export type RoleUtilisateur =
  | "ADMIN"
  | "DG"
  | "AVOCAT"
  | "SECRETAIRE"
  | "ASSISTANT"
  | "JURISTE"
  | "STAGIAIRE";

// Modules de l'application
export type Module =
  | "dashboard"
  | "dossiers"
  | "clients"
  | "documents"
  | "taches"
  | "calendrier"
  | "messages"
  | "facturation"
  | "reporting"
  | "parametres"
  | "utilisateurs"
  | "permissions"
  | "audit"
  | "archives";

// Actions possibles sur un module
export interface ModulePermissions {
  lecture: boolean;      // Peut lire/consulter
  ecriture: boolean;     // Peut créer/modifier
  suppression: boolean;  // Peut supprimer
}

// Permission complète d'un module
export interface Permission {
  id: string;
  role: RoleUtilisateur;
  module: Module;
  lecture: boolean;
  ecriture: boolean;
  suppression: boolean;
  statut: "ACTIF" | "INACTIF";
  creeLe: string;
  modifieLe: string;
}

// Matrice complète des permissions d'un rôle
export type PermissionsMatrix = {
  [key in Module]?: ModulePermissions;
};

// Contexte des permissions
export interface PermissionsContextType {
  permissions: PermissionsMatrix;
  isLoading: boolean;
  error: string | null;
  hasAccess: (module: Module) => boolean;
  canRead: (module: Module) => boolean;
  canWrite: (module: Module) => boolean;
  canDelete: (module: Module) => boolean;
  refreshPermissions: () => Promise<void>;
}

// Réponse API
export interface PermissionsResponse {
  role: RoleUtilisateur;
  permissions: Permission[];
}