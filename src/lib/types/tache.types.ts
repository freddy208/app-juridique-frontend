/**
 * Types pour le module Tâches
 * Basé sur les interfaces du backend
 */

// Types énumérés basés sur Prisma
export enum StatutTache {
  A_FAIRE = "A_FAIRE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
}

export enum TachePriorite {
  BASSE = "BASSE",
  MOYENNE = "MOYENNE",
  HAUTE = "HAUTE",
  URGENTE = "URGENTE",
}

// Interfaces principales
export interface TacheResponse {
  id: string;
  titre: string;
  description?: string;
  statut: StatutTache;
  priorite: TachePriorite;
  dateLimite?: Date;
  creeLe: Date;
  modifieLe: Date;
  tags?: string;
  enRetard: boolean;
  joursRestants?: number;
  assignee?: {
    id: string;
    prenom: string;
    nom: string;
    role: string;
  };
  createur: {
    id: string;
    prenom: string;
    nom: string;
    role: string;
  };
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
    type: string;
    statut: string;
  };
  commentaires?: {
    id: string;
    contenu: string;
    creeLe: Date;
    utilisateur: {
      id: string;
      prenom: string;
      nom: string;
    };
  }[];
}

export interface TacheStatsResponse {
  total: number;
  parStatut: {
    a_faire: number;
    en_cours: number;
    terminee: number;
  };
  parPriorite: {
    basse: number;
    moyenne: number;
    haute: number;
    urgente: number;
  };
  enRetard: number;
  aEcheanceProche: number;
  parUtilisateur: {
    id: string;
    prenom: string;
    nom: string;
    total: number;
    completes: number;
    enRetard: number;
    tauxCompletion: number;
  }[];
  recentes: TacheResponse[];
}

// DTOs pour les requêtes
export interface CreateTacheDto {
  titre: string;
  description?: string;
  dossierId?: string;
  assigneeId?: string;
  priorite?: TachePriorite;
  dateLimite?: Date;
}

export interface UpdateTacheDto {
  titre?: string;
  description?: string;
  assigneeId?: string;
  priorite?: TachePriorite;
  statut?: StatutTache;
  dateLimite?: Date;
}

export interface QueryTachesDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  assigneeId?: string;
  creeParId?: string;
  dossierId?: string;
  statut?: StatutTache;
  priorite?: TachePriorite;
  dateLimiteMin?: Date;
  dateLimiteMax?: Date;
  search?: string;
  enRetard?: boolean;
}

// Types pour les hooks
export interface UseTachesOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  assigneeId?: string;
  creeParId?: string;
  dossierId?: string;
  statut?: StatutTache;
  priorite?: TachePriorite;
  dateLimiteMin?: Date;
  dateLimiteMax?: Date;
  search?: string;
  enRetard?: boolean;
  enabled?: boolean;
}

export interface UseTacheOptions {
  id: string;
  enabled?: boolean;
}

export interface UseTacheStatsOptions {
  utilisateurId?: string;
  enabled?: boolean;
}