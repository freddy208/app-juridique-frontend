// src/types/factures.types.ts

// Énumérations basées sur le schéma Prisma
export enum StatutFacture {
  BROUILLON = 'BROUILLON',
  ENVOYEE = 'ENVOYEE',
  PAYEE = 'PAYEE',
  EN_RETARD = 'EN_RETARD',
  SUPPRIME = 'SUPPRIME',
  IMPAYEE = 'IMPAYEE',
  PARTIELLE = 'PARTIELLE'
}

export enum StatutLigneFacture {
  ACTIF = 'ACTIF',
  SUPPRIME = 'SUPPRIME'
}

// Types de base pour les factures
export interface LigneFacture {
  id: string;
  factureId: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montant: number;
  statut: StatutLigneFacture;
  creeLe: Date;
  modifieLe: Date;
}

export interface ClientFacture {
  id: string;
  prenom: string;
  nom: string;
  entreprise?: string | null;
}

export interface DossierFacture {
  id: string;
  numeroUnique: string;
  titre: string;
}

export interface Facture {
  id: string;
  clientId: string;
  dossierId?: string | null;
  numero?: string | null;
  dateEmission: Date;
  dateEcheance?: Date | null;
  montantTotal: number;
  montantPaye: number;
  statut: StatutFacture;
  creeLe: Date;
  modifieLe: Date;
  client?: ClientFacture;
  dossier?: DossierFacture;
  lignes?: LigneFacture[];
}

// Types de réponse enrichis
export interface FactureResponse extends Facture {
  client: ClientFacture;
  dossier?: DossierFacture;
  lignes: LigneFacture[];
  montantRestant: number; // Calculé : montantTotal - montantPaye
  enRetard: boolean; // Calculé : dateEcheance < now && statut != PAYEE
}

// Types pour les DTOs
export interface CreateLigneFactureDto {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

export interface CreateFactureDto {
  clientId: string;
  dossierId?: string;
  dateEcheance?: string;
  lignes: CreateLigneFactureDto[];
}

export interface UpdateLigneFactureDto {
  description?: string;
  quantite?: number;
  prixUnitaire?: number;
}

export interface UpdateFactureDto {
  clientId?: string;
  dossierId?: string;
  dateEcheance?: string;
  statut?: StatutFacture;
  lignes?: UpdateLigneFactureDto[];
}

export interface QueryFactureDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  clientId?: string;
  dossierId?: string;
  statut?: StatutFacture;
  dateMin?: string;
  dateMax?: string;
}

// Types pour les statistiques
export interface FactureStatsResponse {
  totalEmis: number;
  totalPaye: number;
  totalEnRetard: number;
  totalImpaye: number;
  nombreFacturesParStatut: {
    statut: StatutFacture;
    count: number;
    montantTotal: number;
  }[];
  chiffreAffairesParMois: {
    mois: string; // Format "YYYY-MM"
    montant: number;
  }[];
  topClientsFactures: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string | null;
    totalFacture: number;
  }[];
  facturesEnRetardDetails: {
    count: number;
    montantTotal: number;
  };
}

// Types pour les formulaires
export interface FactureFormData {
  clientId: string;
  dossierId?: string;
  dateEcheance?: string;
  lignes: CreateLigneFactureDto[];
}

export interface LigneFactureFormData {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

// Types pour les états et filtres
export interface FactureFilterState {
  clientId?: string;
  dossierId?: string;
  statut?: StatutFacture;
  dateMin?: string;
  dateMax?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FactureState {
  factures: FactureResponse[];
  currentFacture: FactureResponse | null;
  stats: FactureStatsResponse | null;
  loading: boolean;
  error: string | null;
  filter: FactureFilterState;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}