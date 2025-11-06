/* eslint-disable @typescript-eslint/no-empty-object-type */
// src/lib/types/jurisprudence.types.ts

// Énumérations basées sur le schéma Prisma
export enum JuridictionCameroun {
  COUR_SUPREME = 'COUR_SUPREME',
  COUR_APPEL_CENTRE = 'COUR_APPEL_CENTRE',
  COUR_APPEL_LITTORAL = 'COUR_APPEL_LITTORAL',
  COUR_APPEL_OUEST = 'COUR_APPEL_OUEST',
  COUR_APPEL_NORD_OUEST = 'COUR_APPEL_NORD_OUEST',
  COUR_APPEL_SUD_OUEST = 'COUR_APPEL_SUD_OUEST',
  TRIBUNAL_GRANDE_INSTANCE = 'TRIBUNAL_GRANDE_INSTANCE',
  TRIBUNAL_PREMIERE_INSTANCE = 'TRIBUNAL_PREMIERE_INSTANCE',
  TRIBUNAL_COUTUMIER = 'TRIBUNAL_COUTUMIER',
}

export enum MatiereDroit {
  CIVIL = 'CIVIL',
  PENAL = 'PENAL',
  COMMERCIAL = 'COMMERCIAL',
  TRAVAIL = 'TRAVAIL',
  ADMINISTRATIF = 'ADMINISTRATIF',
  FONCIER = 'FONCIER',
  FAMILLE = 'FAMILLE',
  SUCCESSION = 'SUCCESSION',
}

export enum SensDecision {
  FAVORABLE = 'FAVORABLE',
  DEFAVORABLE = 'DEFAVORABLE',
  MIXTE = 'MIXTE',
}

// Interfaces principales
export interface Jurisprudence {
  id: string;
  numeroArret: string;
  juridiction: JuridictionCameroun;
  dateDecision: Date;
  parties: string;
  matiere: MatiereDroit;
  motsCles: string[];
  resume: string;
  texteIntegral: string;
  sensDecision: SensDecision;
  reference?: string;
  documentUrl?: string;
  creeLe: Date;
  modifieLe: Date;
  pertinenceMoyenne?: number;
  nombreDossiersAssocies?: number;
}

export interface DossierJurisprudence {
  id: string;
  dossierId: string;
  jurisprudenceId: string;
  pertinence: number;
  noteUtilisateur?: string;
  creeLe: Date;
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
    type: string;
    statut: string;
  };
  jurisprudence?: {
    id: string;
    numeroArret: string;
    juridiction: string;
    dateDecision: Date;
    matiere: string;
    resume: string;
  };
}

export interface JurisprudenceStats {
  totalJurisprudences: number;
  jurisprudencesParJuridiction: Array<{
    juridiction: string;
    count: number;
  }>;
  jurisprudencesParMatiere: Array<{
    matiere: string;
    count: number;
  }>;
  jurisprudencesParSensDecision: Array<{
    sensDecision: string;
    count: number;
  }>;
  jurisprudencesRecentes: Jurisprudence[];
  motsClesPopulaires: Array<{
    motCle: string;
    count: number;
  }>;
}

// DTOs pour les requêtes
export interface CreateJurisprudenceDto {
  numeroArret: string;
  juridiction: JuridictionCameroun;
  dateDecision: Date;
  parties: string;
  matiere: MatiereDroit;
  motsCles: string[];
  resume: string;
  texteIntegral: string;
  sensDecision: SensDecision;
  reference?: string;
  documentUrl?: string;
}

export interface UpdateJurisprudenceDto extends Partial<CreateJurisprudenceDto> {}

export interface CreateDossierJurisprudenceDto {
  dossierId: string;
  jurisprudenceId: string;
  pertinence: number;
  noteUtilisateur?: string;
}

export interface UpdateDossierJurisprudenceDto extends Partial<CreateDossierJurisprudenceDto> {}

export interface QueryJurisprudenceDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  juridiction?: JuridictionCameroun;
  matiere?: MatiereDroit;
  sensDecision?: SensDecision;
  search?: string;
  motsCles?: string[];
  dateDecisionMin?: Date;
  dateDecisionMax?: Date;
  dossierId?: string;
}

// Types pour les réponses paginées
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}