//src/lib/type/user.types.ts

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

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
  creeLe: string;
  modifieLe: string;
}

export interface UserStats {
  total: number;
  actifs: number;
  inactifs: number;
  suspendus: number;
  parRole: {
    [key: string]: number;
  };
  recentActivity: {
    date: string;
    count: number;
  }[];
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

export interface UserFilters {
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
  search?: string;
  specialite?: string;
  barreau?: string;
}

export interface CreateUserForm {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  confirmMotDePasse: string;
  role: RoleUtilisateur;
  statut?: StatutUtilisateur;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
}

export interface UpdateUserForm {
  prenom: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
}

export interface UpdateProfileForm {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  barreau?: string;
  numeroPermis?: string;
  motDePasse?: string;
  confirmMotDePasse?: string;
}

export interface ChangePasswordForm {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmNouveauMotDePasse: string;
}

export interface BulkActionForm {
  userIds: string[];
  action: 'changeRole' | 'changeStatus' | 'delete';
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
  raison?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
