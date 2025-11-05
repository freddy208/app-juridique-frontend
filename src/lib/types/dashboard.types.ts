// src/types/dashboard.types.ts

export enum RoleUtilisateur {
  ADMIN = 'ADMIN',
  DG = 'DG',
  AVOCAT = 'AVOCAT',
  SECRETAIRE = 'SECRETAIRE',
  ASSISTANT = 'ASSISTANT',
  JURISTE = 'JURISTE',
  STAGIAIRE = 'STAGIAIRE',
}

export interface StatsDossiers {
  [statut: string]: number;
}

export interface StatsFactures {
  [statut: string]: {
    count: number;
    montant: number;
  };
}

export interface StatsGenerales {
  dossiers?: StatsDossiers;
  factures?: StatsFactures;
  clients?: number;
  utilisateurs?: number;
  tachesEnCours?: number;
}

export interface ChiffreAffaires {
  mois: number;
  annee: number;
}

export interface DossiersParType {
  [type: string]: number;
}

export interface PerformanceAvocat {
  id: string;
  prenom: string;
  nom: string;
  chiffreAffaires: number;
  // Autres propriétés selon le modèle Prisma
}

export interface Alerte {
  id: string;
  message: string;
  priorite: number;
  creeLe: Date;
  traite: boolean;
  // Autres propriétés selon le modèle Prisma
}

export interface EvenementCalendrier {
  id: string;
  titre: string;
  debut: Date;
  fin: Date;
  statut: string;
  // Autres propriétés selon le modèle Prisma
}

export interface Facture {
  id: string;
  numero: string;
  montantTotal: number;
  dateEmission: Date;
  dateEcheance: Date;
  statut: string;
  client: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
  };
  // Autres propriétés selon le modèle Prisma
}

export interface Dossier {
  id: string;
  numeroUnique: string;
  titre: string;
  statut: string;
  modifieLe: Date;
  client: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
  };
  responsable?: {
    id: string;
    prenom: string;
    nom: string;
  };
  // Autres propriétés selon le modèle Prisma
}

export interface Tache {
  id: string;
  titre: string;
  description?: string;
  priorite: number;
  statut: string;
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  // Autres propriétés selon le modèle Prisma
}

export interface Correspondance {
  id: string;
  objet: string;
  dateCorrespondance: Date;
  statut: string;
  client: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
  };
  // Autres propriétés selon le modèle Prisma
}

export interface Procedure {
  id: string;
  typeProcedure: string;
  statut: string;
  modifieLe: Date;
  dossier: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  etapes: Array<{
    id: string;
    titre: string;
    dateDebut: Date;
    dateFin?: Date;
    statut: string;
  }>;
  // Autres propriétés selon le modèle Prisma
}

export interface Audience {
  id: string;
  dateAudience: Date;
  statut: string;
  procedure: {
    id: string;
    typeProcedure: string;
  };
  // Autres propriétés selon le modèle Prisma
}

export interface Jurisprudence {
  id: string;
  titre: string;
  dateDecision: Date;
  reference: string;
  creeLe: Date;
  // Autres propriétés selon le modèle Prisma
}

export interface Document {
  id: string;
  titre: string;
  typeDocument: string;
  creeLe: Date;
  dossier: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  // Autres propriétés selon le modèle Prisma
}

export interface DashboardResponse {
  stats?: StatsGenerales;
  chiffreAffaires?: ChiffreAffaires;
  dossiersParType?: DossiersParType;
  performancesAvocats?: PerformanceAvocat[];
  alertesRecentes?: Alerte[];
  evenementsAvenir?: EvenementCalendrier[];
  facturesEnAttente?: Facture[];
  dossiersProchesEcheance?: Dossier[];
  tachesAssignees?: Tache[];
  dossiersRecentes?: Dossier[];
  facturesRecentes?: Facture[];
  correspondancesEnAttente?: Correspondance[];
  proceduresEnCours?: Procedure[];
  audiencesAvenir?: Audience[];
  jurisprudencesRecentes?: Jurisprudence[];
  dossiersAssignes?: Dossier[];
  documentsRecentes?: Document[];
  alertes?: Alerte[];
}