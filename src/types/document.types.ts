/**
 * Types pour le module Documents
 */

export type StatutDocument = "ACTIF" | "ARCHIVE" | "SUPPRIME";

export interface Document {
  id: string;
  dossierId: string;
  televersePar: string;
  titre: string;
  type: string;
  url: string;
  version: number;
  statut: StatutDocument;
  creeLe: string;
  modifieLe: string;
  
  // Relations
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  utilisateur?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
  
  // Métadonnées
  taille?: number; // en bytes
  mimeType?: string;
}

export interface CreateDocumentDto {
  dossierId: string;
  titre: string;
  type: string;
  file: File; // Pour l'upload
}

export interface UpdateDocumentDto {
  titre?: string;
  type?: string;
  statut?: StatutDocument;
}

export interface DocumentFilters {
  dossierId?: string;
  type?: string;
  statut?: StatutDocument;
  televersePar?: string;
  dateDebut?: string;
  dateFin?: string;
  search?: string;
}

export interface UploadResponse {
  url: string;
  path: string;
  bucket: string;
  size: number;
  mimeType: string;
}