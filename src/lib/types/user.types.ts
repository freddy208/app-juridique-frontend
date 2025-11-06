// src/lib/types/user.types.ts

/**
 * ============================================
 * TYPES & INTERFACES - MODULE USERS
 * ============================================
 */

// ============================================
// ENUMS (synchronisés avec Prisma)
// ============================================

export enum RoleUtilisateur {
  ADMIN = 'ADMIN',
  DG = 'DG',
  AVOCAT = 'AVOCAT',
  SECRETAIRE = 'SECRETAIRE',
  ASSISTANT = 'ASSISTANT',
  JURISTE = 'JURISTE',
  STAGIAIRE = 'STAGIAIRE',
}

export enum StatutUtilisateur {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  SUSPENDU = 'SUSPENDU',
}

// ============================================
// INTERFACES CORE
// ============================================

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
  telephone?: string | null;
  adresse?: string | null;
  specialite?: string | null;
  barreau?: string | null;
  numeroPermis?: string | null;
  creeLe: string;
  modifieLe: string;
  derniereConnexion?: string | null;
}

export type UserProfile = User;

// ============================================
// FORMS DTOs (pour création/modification)
// ============================================

export interface CreateUserForm {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  role: RoleUtilisateur;
  statut?: StatutUtilisateur;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
}

export interface UpdateUserForm {
  prenom?: string;
  nom?: string;
  email?: string;
  motDePasse?: string;
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
}

// ✅ CORRECTION : UpdateProfileForm avec les champs manquants
export interface UpdateProfileForm {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
  // ✅ Champs pour changement de mot de passe optionnel
  ancienMotDePasse?: string;
  nouveauMotDePasse?: string;
}

// ✅ CORRECTION : ChangePasswordForm avec confirmationMotDePasse (pas confirmNouveauMotDePasse)
export interface ChangePasswordForm {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmationMotDePasse: string;  // ✅ Nom correct
}

export interface ChangeStatusForm {
  statut: StatutUtilisateur;
  raison?: string;
}

export interface BulkActionForm {
  userIds: string[];
  action: 'changeRole' | 'changeStatus' | 'delete';
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
  raison?: string;
}

// ============================================
// FILTERS & PAGINATION
// ============================================

export interface UserFilters {
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
  search?: string;
  specialite?: string;
  barreau?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// STATISTICS & PERFORMANCE
// ============================================

export interface UserStats {
  total: number;
  actifs: number;
  inactifs: number;
  suspendus: number;
  parRole: Record<string, number>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}

export interface UserPerformance {
  userId: string;
  nomComplet: string;
  role: string;
  nombreDossiers: number;
  dossiersTermines: number;
  tauxCompletion: number;
  chiffreAffaires: number;
  satisfactionMoyenne: number;
  delaiMoyenTraitement: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface UserResponse {
  data: User;
  message?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStatsResponse {
  data: UserStats;
}

export interface UserPerformanceResponse {
  data: UserPerformance[];
}

export interface BulkActionResponse {
  message: string;
  count: number;
}

export interface RoleOption {
  value: RoleUtilisateur;
  label: string;
}

export interface StatusOption {
  value: StatutUtilisateur;
  label: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type UserFormMode = 'create' | 'edit' | 'view';

export interface UserTableColumn {
  key: keyof User | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
}

// ============================================
// VALIDATION SCHEMAS (pour Zod)
// ============================================

export interface UserValidationRules {
  prenom: {
    minLength: number;
    maxLength: number;
  };
  nom: {
    minLength: number;
    maxLength: number;
  };
  email: {
    pattern: RegExp;
  };
  motDePasse: {
    minLength: number;
    pattern: RegExp;
    message: string;
  };
  telephone: {
    pattern: RegExp;
    message: string;
  };
}

export const USER_VALIDATION_RULES: UserValidationRules = {
  prenom: {
    minLength: 2,
    maxLength: 50,
  },
  nom: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  motDePasse: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole',
  },
  telephone: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: 'Format de téléphone invalide (utilisez le format international: +237...)',
  },
};

// ============================================
// CONSTANTS
// ============================================

export const ROLE_LABELS: Record<RoleUtilisateur, string> = {
  [RoleUtilisateur.ADMIN]: 'Administrateur',
  [RoleUtilisateur.DG]: 'Directeur Général',
  [RoleUtilisateur.AVOCAT]: 'Avocat',
  [RoleUtilisateur.SECRETAIRE]: 'Secrétaire',
  [RoleUtilisateur.ASSISTANT]: 'Assistant',
  [RoleUtilisateur.JURISTE]: 'Juriste',
  [RoleUtilisateur.STAGIAIRE]: 'Stagiaire',
};

export const STATUS_LABELS: Record<StatutUtilisateur, string> = {
  [StatutUtilisateur.ACTIF]: 'Actif',
  [StatutUtilisateur.INACTIF]: 'Inactif',
  [StatutUtilisateur.SUSPENDU]: 'Suspendu',
};

export const ROLE_COLORS: Record<RoleUtilisateur, string> = {
  [RoleUtilisateur.ADMIN]: 'red',
  [RoleUtilisateur.DG]: 'purple',
  [RoleUtilisateur.AVOCAT]: 'blue',
  [RoleUtilisateur.SECRETAIRE]: 'green',
  [RoleUtilisateur.ASSISTANT]: 'gray',
  [RoleUtilisateur.JURISTE]: 'orange',
  [RoleUtilisateur.STAGIAIRE]: 'teal',
};

export const STATUS_COLORS: Record<StatutUtilisateur, string> = {
  [StatutUtilisateur.ACTIF]: 'green',
  [StatutUtilisateur.INACTIF]: 'gray',
  [StatutUtilisateur.SUSPENDU]: 'red',
};

// ============================================
// ERROR TYPES
// ============================================

export interface UserError {
  field?: keyof CreateUserForm | keyof UpdateUserForm;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: UserError[];
}

// src/lib/types/user.types.ts ou utils.ts
export const statusBadges: Record<StatutUtilisateur, "default" | "destructive" | "success" | "warning" | "secondary" | "blue" | "purple" | "orange" | "teal" | "outline"> = {
  [StatutUtilisateur.ACTIF]: "success",
  [StatutUtilisateur.INACTIF]: "secondary",
  [StatutUtilisateur.SUSPENDU]: "destructive",
};

export interface UpdateUserFormWithId extends UpdateUserForm {
  id: string;
}
