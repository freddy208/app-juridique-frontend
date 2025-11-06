// src/lib/types/correspondance.types.ts

export enum TypeCorrespondance {
  APPEL = 'APPEL',
  EMAIL = 'EMAIL',
  RENDEZ_VOUS = 'RENDEZ_VOUS',
  AUTRE = 'AUTRE',
}

export enum StatutCorrespondance {
  ACTIF = 'ACTIF',
  SUPPRIME = 'SUPPRIME',
}

export interface Client {
  id: string;
  prenom: string;
  nom: string;
  entreprise?: string;
}

export interface Utilisateur {
  id: string;
  prenom: string;
  nom: string;
}

export interface Correspondance {
  id: string;
  type: TypeCorrespondance;
  contenu: string;
  clientId: string;
  utilisateurId: string;
  statut: StatutCorrespondance;
  creeLe: Date;
  modifieLe: Date;
  client?: Client;
  utilisateur: Utilisateur;
}

export interface CorrespondanceStats {
  total: number;
  parType: Record<string, number>;
  parStatut: Record<string, number>;
  recentes: Correspondance[];
}

export interface CreateCorrespondanceDto {
  type: TypeCorrespondance;
  contenu: string;
  clientId?: string;
}

export interface UpdateCorrespondanceDto {
  type?: TypeCorrespondance;
  contenu?: string;
  statut?: StatutCorrespondance;
}

export interface QueryCorrespondanceDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  utilisateurId?: string;
  clientId?: string;
  type?: TypeCorrespondance;
  statut?: StatutCorrespondance;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}