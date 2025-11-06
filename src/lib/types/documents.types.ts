/* eslint-disable @typescript-eslint/no-empty-object-type */
// src/types/documents.types.ts

// Enums basés sur le schéma Prisma
export enum StatutDocument {
  ACTIF = 'ACTIF',
  ARCHIVE = 'ARCHIVE',
  SUPPRIME = 'SUPPRIME',
}

// Types pour les requêtes et réponses
export interface CreateDocumentRequest {
  dossierId: string;
  titre: string;
  type: string;
  taille?: number;
  extension?: string;
  statut?: StatutDocument;
  file?: File;
}

export interface UpdateDocumentRequest {
  version?: number;
  statut?: StatutDocument;
  contenuOCR?: string;
  indexeOCR?: boolean;
  dossierId?: string;
  titre?: string;
  type?: string;
  taille?: number;
  extension?: string;
}

export interface QueryDocumentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dossierId?: string;
  televersePar?: string;
  type?: string;
  statut?: StatutDocument;
  titre?: string;
  recherche?: string;
}

export interface Document {
  id: string;
  dossierId: string;
  televersePar: string;
  titre: string;
  type: string;
  url: string;
  version: number;
  statut: StatutDocument;
  creeLe: Date;
  modifieLe: Date;
  taille?: number;
  extension?: string;
  indexeOCR?: boolean;
  contenuOCR?: string;
  utilisateur?: {
    id: string;
    prenom: string;
    nom: string;
  };
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
}

export interface DocumentStats {
  totalDocuments: number;
  tailleTotale: number;
  documentsIndexes: number;
  documentsParType: Array<{
    type: string;
    count: number;
  }>;
  documentsParStatut: Array<{
    statut: StatutDocument;
    count: number;
  }>;
  documentsParMois: Array<{
    mois: string;
    nombre: number;
  }>;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DocumentsResponse extends PaginationResponse<Document> {}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}