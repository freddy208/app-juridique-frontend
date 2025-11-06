// Énumérations basées sur le schéma Prisma
export enum ModePaiement {
  ESPECES = 'ESPECES',
  CHEQUE = 'CHEQUE',
  VIREMENT = 'VIREMENT',
  MTN_MONEY = 'MTN_MONEY',
  ORANGE_MONEY = 'ORANGE_MONEY',
  CARTE_BANCAIRE = 'CARTE_BANCAIRE'
}

export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  ANNULE = 'ANNULE',
  SUPPRIME = 'SUPPRIME'
}

// Interfaces pour les paiements
export interface Paiement {
  id: string;
  honoraireId?: string;
  factureId?: string;
  clientId?: string;
  montant: number;
  statut: StatutPaiement;
  date: string;
  mode: ModePaiement;
  referenceTransaction?: string;
  creeLe: string;
  modifieLe: string;
  facture?: {
    id: string;
    numero: string;
    montantTotal: number;
  };
  honoraire?: {
    id: string;
    montantTTC: number;
  };
  client?: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
  };
}

export interface PaiementStats {
  totalEncaisse: number;
  totalEnAttente: number;
  totalRejete: number;
  paiementsParMois: {
    mois: string; // Format "YYYY-MM"
    montant: number;
    nombre: number;
  }[];
  repartitionParMode: {
    mode: ModePaiement;
    montant: number;
    pourcentage: number;
  }[];
  topClients: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
    totalVerse: number;
  }[];
  facturesImpayees: {
    count: number;
    montantTotal: number;
  };
  honorairesImpayes: {
    count: number;
    montantTotal: number;
  };
}

// DTOs pour les requêtes
export interface CreatePaiementDto {
  montant: number;
  factureId?: string;
  honoraireId?: string;
  clientId?: string;
  mode: ModePaiement;
  date?: string;
  referenceTransaction?: string;
}

export interface UpdatePaiementDto {
  montant?: number;
  factureId?: string;
  honoraireId?: string;
  clientId?: string;
  mode?: ModePaiement;
  date?: string;
  referenceTransaction?: string;
  statut?: StatutPaiement;
  motifRejet?: string;
}

export interface QueryPaiementDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  clientId?: string;
  factureId?: string;
  honoraireId?: string;
  statut?: StatutPaiement;
  mode?: ModePaiement;
  dateMin?: string;
  dateMax?: string;
}

// Types pour les formulaires
export interface PaiementFormData {
  montant: string;
  factureId?: string;
  honoraireId?: string;
  clientId?: string;
  mode: ModePaiement;
  date: string;
  referenceTransaction?: string;
}

export interface PaiementValidationData {
  id: string;
  motif?: string;
}

// Types pour les réponses paginées
export interface PaginatedPaiementsResponse {
  data: Paiement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}