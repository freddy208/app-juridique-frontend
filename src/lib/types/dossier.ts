/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/types/dossier.ts

/**
 * ============================================
 * TYPES POUR LE MODULE DOSSIERS
 * ============================================
 * Ce fichier contient tous les types TypeScript utilisés pour le module des dossiers.
 * Ils sont en parfaite cohérence avec les DTOs et interfaces du backend NestJS.
 */

// ============================================
// ÉNUMÉRATIONS (basées sur les enums Prisma)
// ============================================

export enum TypeDossier {
  SINISTRE_CORPOREL = 'SINISTRE_CORPOREL',
  SINISTRE_MATERIEL = 'SINISTRE_MATERIEL',
  SINISTRE_MORTEL = 'SINISTRE_MORTEL',
  IMMOBILIER = 'IMMOBILIER',
  SPORT = 'SPORT',
  CONTRAT = 'CONTRAT',
  CONTENTIEUX = 'CONTENTIEUX',
  AUTRE = 'AUTRE',
}

export enum StatutDossier {
  OUVERT = 'OUVERT',
  EN_COURS = 'EN_COURS',
  SUSPENDU = 'SUSPENDU',
  CLOS = 'CLOS',
  ARCHIVE = 'ARCHIVE',
}

export enum NiveauRisque {
  FAIBLE = 'FAIBLE',
  MOYEN = 'MOYEN',
  ELEVE = 'ELEVE',
}

export enum GraviteBlessure {
  MINEUR = 'MINEUR',
  MOYEN = 'MOYEN',
  GRAVE = 'GRAVE',
  CRITIQUE = 'CRITIQUE',
}

export enum CategorieVehicule {
  VOITURE = 'VOITURE',
  MOTO = 'MOTO',
  CAMION = 'CAMION',
  AUTRE = 'AUTRE',
}

export enum RegimeFoncier {
  TITRE_FONCIER = 'TITRE_FONCIER',
  COUTUMIER = 'COUTUMIER',
  BAIL = 'BAIL',
}

export enum EtapeProcedures {
  INSTRUCTIVE = 'INSTRUCTIVE',
  AUDIENCE = 'AUDIENCE',
  JUGEMENT = 'JUGEMENT',
  APPEL = 'APPEL',
  EXECUTION = 'EXECUTION',
}

// ============================================
// INTERFACES DES SOUS-TYPES DE DOSSIERS
// ============================================

export interface SinistreCorporel {
  dateAccident?: string;
  lieuAccident?: string;
  numeroPvPolice?: string;
  hopital?: string;
  rapportMedical?: string;
  graviteBlessure?: GraviteBlessure;
  assureur?: string;
  numeroSinistre?: string;
  temoins?: any; // JSON
  prejudice?: number;
}

export interface SinistreMateriel {
  dateAccident?: string;
  lieuAccident?: string;
  categorieVehicule?: CategorieVehicule;
  marqueVehicule?: string;
  modeleVehicule?: string;
  immatriculation?: string;
  numeroChassis?: string;
  numeroPvPolice?: string;
  assureur?: string;
  numeroSinistre?: string;
  estimationDegats?: number;
  photosUrls?: any; // JSON
}

export interface SinistreMortel {
  dateDeces?: string;
  lieuDeces?: string;
  certificatDeces?: string;
  certificatMedicoLegal?: string;
  numeroPvPolice?: string;
  causeDeces?: string;
  ayantsDroit?: any; // JSON
  indemniteReclamee?: number;
}

export interface Immobilier {
  adresseBien?: string;
  numeroTitre?: string;
  numeroCadastre?: string;
  referenceNotaire?: string;
  regimeFoncier?: RegimeFoncier;
  surfaceM2?: number;
  typeLitige?: string;
  chefQuartier?: string;
  temoinsBornage?: any; // JSON
}

export interface Sport {
  club?: string;
  competition?: string;
  dateIncident?: string;
  instanceSportive?: string;
  referenceContrat?: string;
  sanctions?: any; // JSON
}

export interface Contrat {
  partieA?: string;
  partieB?: string;
  dateEffet?: string;
  dateExpiration?: string;
  valeurContrat?: number;
  loiApplicable?: string;
  referenceNotaire?: string;
  contratUrl?: string;
}

export interface Contentieux {
  numeroAffaire?: string;
  tribunal?: string;
  juridiction?: string;
  demandeur?: string;
  defendeur?: string;
  avocatPlaignant?: string;
  avocatDefenseur?: string;
  etapeProcedure?: EtapeProcedures;
  montantReclame?: number;
  datesAudiences?: any; // JSON
  depots?: any; // JSON
  rapportHussier?: string;
}

export interface Autre {
  champs?: any; // JSON
}

// ============================================
// INTERFACES PRINCIPALES (Requêtes & Réponses)
// ============================================

// Interface pour un utilisateur responsable (simplifiée)
export interface Responsable {
  id: string;
  prenom: string;
  nom: string;
  email: string;
}

// Interface pour un client (simplifiée)
export interface Client {
  id: string;
  prenom: string;
  nom: string;
  entreprise?: string;
}

// Interface pour les relations d'un dossier
export interface Document {
  id: string;
  titre: string;
  type: string;
  creeLe: string;
}

export interface Facture {
  id: string;
  numero: string;
  montantTotal: number;
  statut: string;
  creeLe: string;
}

export interface Tache {
  id: string;
  titre: string;
  statut: string;
  dateLimite: string;
}

export interface Note {
  id: string;
  titre: string;
  creeLe: string;
}

export interface Honoraire {
  id: string;
  montantTTC: number;
  statut: string;
  dateEmission: string;
}

export interface Depense {
  id: string;
  categorie: string;
  montant: number;
  dateDepense: string;
}

export interface Provision {
  id: string;
  montant: number;
  solde: number;
  statut: string;
}

// Interface principale pour un Dossier (basée sur DossierResponse du backend)
export interface Dossier {
  id: string;
  numeroUnique: string;
  clientId: string;
  type: TypeDossier;
  titre: string;
  description?: string;
  responsableId?: string;
  statut: StatutDossier;
  valeurFinanciere?: number;
  risqueJuridique?: NiveauRisque;
  chancesSucces?: number;
  creeLe: string;
  misAJourLe: string;
  
  // Relations
  client: Client;
  responsable?: Responsable;
  documents: Document[];
  factures: Facture[];
  taches: Tache[];
  notes: Note[];
  honoraires: Honoraire[];
  depenses: Depense[];
  provisions: Provision[];
  
  // Sous-types
  sinistreCorporel?: SinistreCorporel;
  sinistreMateriel?: SinistreMateriel;
  sinistreMortel?: SinistreMortel;
  immobilier?: Immobilier;
  sport?: Sport;
  contrat?: Contrat;
  contentieux?: Contentieux;
  Autre?: Autre; // Note la majuscule 'Autre' pour correspondre au schéma Prisma
}

// Type pour la création d'un dossier (basé sur CreateDossierDto)
export interface CreateDossierRequest {
  clientId: string;
  titre: string;
  type: TypeDossier;
  description?: string;
  responsableId?: string;
  statut?: StatutDossier;
  valeurFinanciere?: number;
  risqueJuridique?: NiveauRisque;
  chancesSucces?: number;
  
  // Sous-types
  sinistreCorporel?: SinistreCorporel;
  sinistreMateriel?: SinistreMateriel;
  sinistreMortel?: SinistreMortel;
  immobilier?: Immobilier;
  sport?: Sport;
  contrat?: Contrat;
  contentieux?: Contentieux;
  autre?: Autre;
}

// Type pour la mise à jour d'un dossier (basé sur UpdateDossierDto)
export type UpdateDossierRequest = Partial<CreateDossierRequest>;

// Type pour les paramètres de requête (basé sur QueryDossierDto)
export interface QueryDossiersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  clientId?: string;
  responsableId?: string;
  type?: TypeDossier;
  statut?: StatutDossier;
  risqueJuridique?: NiveauRisque;
  titre?: string;
  dateMin?: string;
  dateMax?: string;
  chancesSuccesMin?: number;
  chancesSuccesMax?: number;
}

// Type pour la réponse paginée de la liste des dossiers
export interface DossierListResponse {
  data: Dossier[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Type pour la réponse des statistiques
export interface DossierStatsResponse {
  totalDossiers: number;
  dossiersParStatut: { statut: string; count: number }[];
  dossiersParType: { type: string; count: number }[];
  dossiersParRisque: { risque: string; count: number }[];
  dossiersParResponsable: { responsableId: string; responsableNom: string; count: number }[];
  dossiersRecentes: Dossier[];
}