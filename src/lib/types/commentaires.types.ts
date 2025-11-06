// src/types/commentaires.types.ts

export enum StatutCommentaire {
  ACTIF = 'ACTIF',
  SUPPRIME = 'SUPPRIME',
}

export interface CommentaireResponse {
  id: string;
  contenu: string;
  statut: StatutCommentaire;
  creeLe: Date;
  modifieLe: Date;
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
  };
  document?: {
    id: string;
    titre: string;
    type: string;
  };
  tache?: {
    id: string;
    titre: string;
    statut: string;
  };
}

export interface CommentaireStatsResponse {
  total: number;
  parStatut: {
    actif: number;
    supprime: number;
  };
  parType: {
    document: number;
    tache: number;
  };
  recentes: CommentaireResponse[];
}

export interface CreateCommentaireDto {
  contenu: string;
  documentId?: string;
  tacheId?: string;
}

export interface UpdateCommentaireDto {
  contenu?: string;
  statut?: string;
}

export interface QueryCommentairesDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  utilisateurId?: string;
  documentId?: string;
  tacheId?: string;
  statut?: string;
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