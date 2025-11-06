// src/lib/types/depenses.types.ts

// Enums
export enum CategorieDepense {
  FRAIS_JUSTICE = 'FRAIS_JUSTICE',
  HUISSIER = 'HUISSIER',
  DEPLACEMENT = 'DEPLACEMENT',
  EXPERTISE = 'EXPERTISE',
  PHOTOCOPIE = 'PHOTOCOPIE',
  TIMBRE = 'TIMBRE',
  HONORAIRES_TIERS = 'HONORAIRES_TIERS',
  AUTRE = 'AUTRE',
}

export enum StatutDepense {
  EN_ATTENTE = 'EN_ATTENTE',
  APPROUVE = 'APPROUVE',
  REMBOURSE = 'REMBOURSE',
  REJETE = 'REJETE',
}

// Types de base
export interface DossierPartiel {
  id: string;
  numeroUnique: string;
  titre: string;
}

export interface Depense {
  id: string;
  dossierId?: string | null;
  categorie: CategorieDepense;
  montant: number;
  description: string;
  dateDepense: string;
  beneficiaire?: string | null;
  referencePiece?: string | null;
  validePar?: string | null;
  statut: StatutDepense;
  creeLe: string;
  modifieLe: string;
  dossier?: DossierPartiel | null;
}

// DTOs
export interface CreateDepenseDto {
  dossierId?: string;
  categorie: CategorieDepense;
  montant: number;
  description: string;
  dateDepense: string;
  beneficiaire?: string;
  referencePiece?: string;
}

export interface UpdateDepenseDto {
  dossierId?: string;
  categorie?: CategorieDepense;
  montant?: number;
  description?: string;
  dateDepense?: string;
  beneficiaire?: string;
  referencePiece?: string;
  statut?: StatutDepense;
}

export interface QueryDepenseDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categorie?: CategorieDepense;
  statut?: StatutDepense;
  dossierId?: string;
  dateMin?: string;
  dateMax?: string;
}

// Types pour les statistiques
export interface DepensesParCategorie {
  categorie: CategorieDepense;
  count: number;
  montantTotal: number;
}

export interface DepensesParMois {
  mois: string;
  montant: number;
}

export interface DepensesStats {
  totalDepenses: number;
  totalEnAttente: number;
  totalApprouvees: number;
  totalRejetees: number;
  depensesParCategorie: DepensesParCategorie[];
  depensesParMois: DepensesParMois[];
  depensesEnAttenteDetails: {
    count: number;
    montantTotal: number;
  };
}

// Types pour la pagination
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type DepensesResponse = PaginationResult<Depense>;