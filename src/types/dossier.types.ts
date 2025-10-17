/**
 * Types pour le module Dossiers
 * Basé sur le schema Prisma
 */

// Énumérations depuis Prisma
export type TypeDossier =
  | "SINISTRE_CORPOREL"
  | "SINISTRE_MATERIEL"
  | "SINISTRE_MORTEL"
  | "IMMOBILIER"
  | "SPORT"
  | "CONTRAT"
  | "CONTENTIEUX"
  | "AUTRE";

export type StatutDossier = "OUVERT" | "EN_COURS" | "CLOS" | "ARCHIVE" | "SUPPRIME";

export type GraviteBlessure = "MINEUR" | "MOYEN" | "GRAVE" | "CRITIQUE";

export type CategorieVehicule = "VOITURE" | "MOTO" | "CAMION" | "AUTRE";

export type RegimeFoncier = "TITRE_FONCIER" | "COUTUMIER" | "BAIL";

export type EtapeProcedure = "INSTRUCTIVE" | "AUDIENCE" | "JUGEMENT" | "APPEL" | "EXECUTION";

// Interface principale Dossier
export interface Dossier {
  id: string;
  numeroUnique: string;
  clientId: string;
  titre: string;
  type: TypeDossier;
  description?: string;
  responsableId?: string;
  statut: StatutDossier;
  creeLe: string;
  modifieLe: string;

  client?: {
    id: string;
    prenom: string;
    nom: string;
    nomEntreprise?: string;
    email?: string;
    telephone?: string;
  };
  responsable?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    role: string;
  };

  sinistreCorporel?: SinistreCorporel;
  sinistreMateriel?: SinistreMateriel;
  sinistreMortel?: SinistreMortel;
  immobilier?: Immobilier;
  sport?: Sport;
  contrat?: Contrat;
  contentieux?: Contentieux;
}

// Sinistre Corporel
export interface SinistreCorporel {
  id: string;
  dossierId: string;
  dateAccident: string;
  lieuAccident: string;
  numeroPvPolice?: string;
  hopital?: string;
  rapportMedical?: string;
  graviteBlessure: GraviteBlessure;
  assureur?: string;
  numeroSinistre?: string;
  temoins?: Record<string, unknown>[]; // ✅ Liste d'objets JSON
  prejudice?: number;
  creeLe: string;
  modifieLe: string;
}

// Sinistre Matériel
export interface SinistreMateriel {
  id: string;
  dossierId: string;
  dateAccident: string;
  lieuAccident: string;
  categorieVehicule?: CategorieVehicule;
  marqueVehicule?: string;
  modeleVehicule?: string;
  immatriculation?: string;
  numeroChassis?: string;
  numeroPvPolice?: string;
  assureur?: string;
  numeroSinistre?: string;
  estimationDegats?: number;
  photosUrls?: string[]; // ✅ Tableau d’URL au lieu de any
  creeLe: string;
  modifieLe: string;
}

// Sinistre Mortel
export interface SinistreMortel {
  id: string;
  dossierId: string;
  dateDeces: string;
  lieuDeces?: string;
  certificatDeces?: string;
  certificatMedicoLegal?: string;
  numeroPvPolice?: string;
  causeDeces?: string;
  ayantsDroit?: Record<string, unknown>[]; // ✅ JSON structuré
  indemniteReclamee?: number;
  creeLe: string;
  modifieLe: string;
}

// Immobilier
export interface Immobilier {
  id: string;
  dossierId: string;
  adresseBien: string;
  numeroTitre?: string;
  numeroCadastre?: string;
  referenceNotaire?: string;
  regimeFoncier?: RegimeFoncier;
  surfaceM2?: number;
  typeLitige?: string;
  chefQuartier?: string;
  temoinsBornage?: Record<string, unknown>[]; // ✅ Liste d’objets JSON
  creeLe: string;
  modifieLe: string;
}

// Sport
export interface Sport {
  id: string;
  dossierId: string;
  club?: string;
  competition?: string;
  dateIncident?: string;
  instanceSportive?: string;
  referenceContrat?: string;
  sanctions?: Record<string, unknown>[]; // ✅ JSON typé
  creeLe: string;
  modifieLe: string;
}

// Contrat
export interface Contrat {
  id: string;
  dossierId: string;
  partieA: string;
  partieB: string;
  dateEffet: string;
  dateExpiration?: string;
  valeurContrat?: number;
  loiApplicable?: string;
  referenceNotaire?: string;
  contratUrl?: string;
  creeLe: string;
  modifieLe: string;
}

// Contentieux
export interface Contentieux {
  id: string;
  dossierId: string;
  numeroAffaire?: string;
  tribunal?: string;
  juridiction?: string;
  demandeur?: string;
  defendeur?: string;
  avocatPlaignant?: string;
  avocatDefenseur?: string;
  etapeProcedure?: EtapeProcedure;
  montantReclame?: number;
  datesAudiences?: string[]; // ✅ Liste de dates (chaînes)
  depots?: Record<string, unknown>[]; // ✅ Liste d’objets JSON
  rapportHussier?: string;
  creeLe: string;
  modifieLe: string;
}

// DTOs
export interface CreateDossierDto {
  clientId: string;
  titre: string;
  type: TypeDossier;
  description?: string;
  responsableId?: string;

  sinistreCorporel?: Partial<Omit<SinistreCorporel, "id" | "dossierId" | "creeLe" | "modifieLe">>;
  sinistreMateriel?: Partial<Omit<SinistreMateriel, "id" | "dossierId" | "creeLe" | "modifieLe">>;
  sinistreMortel?: Partial<Omit<SinistreMortel, "id" | "dossierId" | "creeLe" | "modifieLe">>;
  immobilier?: Partial<Omit<Immobilier, "id" | "dossierId" | "creeLe" | "modifieLe">>;
  sport?: Partial<Omit<Sport, "id" | "dossierId" | "creeLe" | "modifieLe">>;
  contrat?: Partial<Omit<Contrat, "id" | "dossierId" | "creeLe" | "modifieLe">>;
  contentieux?: Partial<Omit<Contentieux, "id" | "dossierId" | "creeLe" | "modifieLe">>;
}

export interface UpdateDossierDto extends Partial<CreateDossierDto> {
  statut?: StatutDossier;
}

export interface DossierFilters {
  type?: TypeDossier;
  statut?: StatutDossier;
  clientId?: string;
  responsableId?: string;
  dateDebut?: string;
  dateFin?: string;
  search?: string;
}
