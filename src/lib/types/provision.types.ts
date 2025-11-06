/**
 * Types pour le module des provisions
 * Définition des types sans import depuis Prisma
 */

// Enums
export enum StatutProvision {
  ACTIVE = 'ACTIVE',
  EPUISEE = 'EPUISEE',
  RESTITUEE = 'RESTITUEE',
}

export enum TypeMouvement {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

// Types de base
export interface Client {
  id: string;
  prenom: string;
  nom: string;
  entreprise?: string;
}

export interface Dossier {
  id: string;
  numeroUnique: string;
  titre: string;
}

export interface MouvementProvision {
  id: string;
  provisionId: string;
  type: TypeMouvement;
  montant: number;
  description: string;
  soldeApres: number;
  creeLe: Date;
}

// Types principaux
export interface Provision {
  id: string;
  dossierId: string;
  clientId: string;
  montant: number;
  solde: number;
  dateProvision: Date;
  statut: StatutProvision;
  creeLe: Date;
  modifieLe: Date;
}

export interface ProvisionResponse extends Provision {
  client: Client;
  dossier: Dossier;
  mouvements: MouvementProvision[];
  tauxUtilisation: number;
}

// Types pour les statistiques
export interface ProvisionStatsResponse {
  totalProvisions: number;
  totalDebit: number;
  totalCredit: number;
  soldeTotal: number;
  totalEpuisees: number;
  nombreProvisionsParStatut: Array<{
    statut: string;
    count: number;
    montantTotal: number;
  }>;
  provisionsParMois: Array<{
    mois: string;
    montant: number;
  }>;
  topClientsProvisions: Array<{
    id: string;
    prenom: string;
    nom: string;
    entreprise: string | null;
    totalProvision: number;
  }>;
  provisionsEpuiseesDetails: {
    count: number;
    montantTotal: number;
  };
}

// Types pour les DTOs
export interface CreateProvisionDto {
  dossierId: string;
  clientId: string;
  montant: number;
  dateProvision?: Date;
}

export interface UpdateProvisionDto {
  dossierId?: string;
  clientId?: string;
  montant?: number;
  dateProvision?: Date;
  statut?: StatutProvision;
}

export interface AjouterMouvementDto {
  type: TypeMouvement;
  montant: number;
  description: string;
}

export interface QueryProvisionDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  clientId?: string;
  dossierId?: string;
  statut?: StatutProvision;
  dateMin?: string;
  dateMax?: string;
}

// Types pour les hooks
export interface UseProvisionsOptions {
  autoFetch?: boolean;
  clientId?: string;
  dossierId?: string;
  statut?: StatutProvision;
  page?: number;
  limit?: number;
}

export interface UseProvisionOptions {
  autoFetch?: boolean;
  id: string;
}

export interface UseProvisionStatsOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

// Types pour les réponses API
export interface PaginatedProvisionsResponse {
  data: ProvisionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}