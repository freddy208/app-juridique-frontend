/**
 * Types pour le module des honoraires
 */

// Énumérations basées sur le schéma Prisma
export enum TypeHonoraire {
  FORFAIT = 'FORFAIT',
  AU_RESULTAT = 'AU_RESULTAT',
  HORAIRE = 'HORAIRE',
  MIXTE = 'MIXTE'
}

export enum ModeCalculHonoraire {
  BAREME_OHADA = 'BAREME_OHADA',
  ACCORD_LIBRE = 'ACCORD_LIBRE',
  CONVENTION = 'CONVENTION'
}

export enum StatutHonoraire {
  EMIS = 'EMIS',
  PARTIELLEMENT_PAYE = 'PARTIELLEMENT_PAYE',
  PAYE = 'PAYE',
  ANNULE = 'ANNULE'
}

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

// Interfaces pour les données
export interface Honoraire {
  id: string;
  dossierId: string;
  clientId: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  typeHonoraire: TypeHonoraire;
  modeCalcul: ModeCalculHonoraire;
  baremeOHADA?: string;
  dateEmission: Date;
  dateEcheance: Date;
  statut: StatutHonoraire;
  creeLe: Date;
  modifieLe: Date;
}

export interface HonoraireResponse extends Honoraire {
  client: {
    id: string;
    prenom: string;
    nom: string;
    entreprise: string | null;
  };
  dossier: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  paiements: Paiement[];
  montantRestant: number;
  enRetard: boolean;
  tauxRecouvrement: number;
}

export interface Paiement {
  id: string;
  honoraireId?: string;
  factureId?: string;
  clientId?: string;
  montant: number;
  statut: StatutPaiement;
  date: Date;
  mode: ModePaiement;
  creeLe: Date;
  modifieLe: Date;
}

export interface HonoraireStatsResponse {
  totalEmis: number;
  totalPaye: number;
  totalEnRetard: number;
  totalImpaye: number;
  nombreHonorairesParStatut: Array<{
    statut: string;
    count: number;
    montantTotal: number;
  }>;
  nombreHonorairesParType: Array<{
    type: string;
    count: number;
    montantTotal: number;
  }>;
  chiffreAffairesParMois: Array<{
    mois: string;
    montant: number;
  }>;
  topClientsHonoraires: Array<{
    id: string;
    prenom: string;
    nom: string;
    entreprise: string | null;
    totalHonoraire: number;
  }>;
  honorairesEnRetardDetails: {
    count: number;
    montantTotal: number;
  };
}

export interface BaremeOHADA {
  id: string;
  nom: string;
  description: string;
  tranches: Array<{
    min: number;
    max: number;
    taux: number;
    fixe: number;
  }>;
}

// DTOs pour les requêtes
export interface CreateHonoraireDto {
  dossierId: string;
  clientId: string;
  montantHT: number;
  tauxTVA?: number;
  typeHonoraire: TypeHonoraire;
  modeCalcul: ModeCalculHonoraire;
  baremeOHADA?: string;
  dateEcheance?: Date;
}

export interface UpdateHonoraireDto {
  dossierId?: string;
  clientId?: string;
  montantHT?: number;
  tauxTVA?: number;
  typeHonoraire?: TypeHonoraire;
  modeCalcul?: ModeCalculHonoraire;
  baremeOHADA?: string;
  dateEcheance?: Date;
  statut?: StatutHonoraire;
}

export interface QueryHonoraireDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  clientId?: string;
  dossierId?: string;
  statut?: StatutHonoraire;
  typeHonoraire?: TypeHonoraire;
  dateMin?: Date;
  dateMax?: Date;
}

export interface CalculBaremeResponse {
  montantHT: number;
  details: {
    bareme: string;
    tranche: {
      min: number;
      max: number;
      taux: number;
      fixe: number;
    };
    montantBase: number;
    montantVariable: number;
    montantFixe: number;
  };
}