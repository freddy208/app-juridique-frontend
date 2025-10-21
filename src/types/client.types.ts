/**
 * Types pour le module Clients
 */

export type StatutClient = "ACTIF" | "INACTIF";

export type StatutDossier = 
  | "OUVERT" 
  | "EN_COURS" 
  | "CLOS" 
  | "ARCHIVE" 
  | "SUPPRIME";

export type TypeDossier =
  | "SINISTRE_CORPOREL"
  | "SINISTRE_MATERIEL"
  | "SINISTRE_MORTEL"
  | "IMMOBILIER"
  | "SPORT"
  | "CONTRAT"
  | "CONTENTIEUX"
  | "AUTRE";

export type StatutFacture =
  | "BROUILLON"
  | "ENVOYEE"
  | "PAYEE"
  | "EN_RETARD"
  | "SUPPRIME";

export interface Client {
  id: string;
  prenom: string;
  nom: string;
  nomEntreprise?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  statut: StatutClient;
  creeLe: string;
  modifieLe: string;
  
  // Relations (optionnelles)
  dossiers?: Array<{
    id: string;
    numeroUnique: string;
    titre: string;
    type: TypeDossier;
    statut: StatutDossier;
  }>;
  
  factures?: Array<{
    id: string;
    montant: number;
    statut: StatutFacture;
    dateEcheance: string;
    payee: boolean;
  }>;
  
  // Statistiques calculées
  _count?: {
    dossiers: number;
    factures: number;
  };
}

export interface CreateClientDto {
  prenom: string;
  nom: string;
  nomEntreprise?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  statut?: StatutClient;
}

// ✅ FILTRES COMPLETS - alignés avec le backend
export interface ClientFilters {
  statut?: StatutClient;
  search?: string;
  nomEntreprise?: string;
  email?: string;
  telephone?: string;
  typeDossier?: TypeDossier;
  statutDossier?: StatutDossier;
  skip?: number;
  take?: number;
}

// Types pour les relations du client
export interface ClientDossier {
  id: string;
  numeroUnique: string;
  titre: string;
  type: TypeDossier;
  statut: StatutDossier;
  description?: string | null;
  clientId: string;
  responsableId?: string | null;
  creeLe: string;
  modifieLe: string;
}

export interface ClientFacture {
  id: string;
  montant: number;
  statut: StatutFacture;
  dateEcheance: string;
  payee: boolean;
  clientId: string;
  dossierId?: string | null;
  creeLe: string;
  modifieLe: string;
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
    type: TypeDossier;
  };
}

export interface ClientNote {
  id: string;
  contenu: string;
  clientId: string;
  dossierId?: string | null;
  utilisateurId: string;
  statut: "ACTIF" | "SUPPRIME";
  creeLe: string;
  modifieLe: string;
  utilisateur?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
}

export interface ClientCorrespondance {
  id: string;
  clientId: string;
  utilisateurId: string;
  type: "APPEL" | "EMAIL" | "RENDEZ_VOUS" | "AUTRE";
  contenu?: string | null;
  statut: "ACTIF" | "SUPPRIME";
  creeLe: string;
  modifieLe: string;
  utilisateur?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
}

export interface ClientDocument {
  id: string;
  dossierId: string;
  televersePar: string;
  titre: string;
  type: string;
  url: string;
  version: number;
  statut: "ACTIF" | "ARCHIVE" | "SUPPRIME";
  creeLe: string;
  modifieLe: string;
  dossier: {
    id: string;
    numeroUnique: string;
    titre: string;
    type: TypeDossier;
    clientId: string;
  };
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
}

export interface ClientAudit {
  id: string;
  utilisateurId: string;
  action: string;
  typeCible: string;
  cibleId: string;
  ancienneValeur: string | number | boolean | null;
  nouvelleValeur: string | number | boolean | null;
  creeLe: string;
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
}

// ✅ Structure de réponse backend
export interface BackendPaginatedResponse<T> {
  totalCount: number;
  skip: number;
  take: number;
  data: T[];
}

// Export des données Excel
export interface ClientExportData {
  Prénom: string;
  Nom: string;
  Entreprise: string;
  Email: string;
  Téléphone: string;
  Adresse: string;
  Statut: string;
  "Nb Dossiers": number;
  "CA Total": number;
  "Créé le": string;
}