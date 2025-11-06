// src/types/evenement.ts
export interface Evenement {
  id: string;
  titre: string;
  description?: string;
  debut: Date;
  fin: Date;
  statut: StatutEvenement;
  creeLe: Date;
  modifieLe: Date;
  estPasse: boolean;
  estEnCours: boolean;
  dureeMinutes: number;
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
}

export enum StatutEvenement {
  PREVU = 'PREVU',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE',
  EN_COURS = 'EN_COURS',
}

export interface EvenementStats {
  total: number;
  parStatut: {
    prevu: number;
    termine: number;
    annule: number;
  };
  ceMois: number;
  cetteSemaine: number;
  aujourdHui: number;
  aVenir: number;
  passes: number;
  parUtilisateur: Array<{
    id: string;
    prenom: string;
    nom: string;
    total: number;
    completes: number;
    enRetard: number;
    tauxCompletion: number;
  }>;
  recentes: Evenement[];
  aVenirProchains: Evenement[];
}

export interface CreateEvenementDto {
  titre: string;
  description?: string;
  dossierId?: string;
  debut: Date;
  fin: Date;
}

export interface UpdateEvenementDto {
  titre?: string;
  description?: string;
  dossierId?: string;
  debut?: Date;
  fin?: Date;
  statut?: StatutEvenement;
}

export interface QueryEvenementsDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  creeParId?: string;
  dossierId?: string;
  statut?: StatutEvenement;
  dateDebutMin?: Date;
  dateDebutMax?: Date;
  dateFinMin?: Date;
  dateFinMax?: Date;
  search?: string;
  view?: 'day' | 'week' | 'month';
  referenceDate?: Date;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}