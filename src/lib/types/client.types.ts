// src/lib/types/client.ts

export enum TypeClient {
  PARTICULIER = 'PARTICULIER',
  ENTREPRISE = 'ENTREPRISE',
  ASSOCIATION = 'ASSOCIATION',
  ADMINISTRATION = 'ADMINISTRATION',
}

export enum StatutClient {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  ARCHIVE = 'ARCHIVE',
}

export enum TypeDocumentIdentite {
  CNI = 'CNI',
  PASSEPORT = 'PASSEPORT',
  PERMIS_CONDUIRE = 'PERMIS_CONDUIRE',
  ACTE_NAISSANCE = 'ACTE_NAISSANCE',
  REGISTRE_COMMERCE = 'REGISTRE_COMMERCE',
  STATUTS_ENTREPRISE = 'STATUTS_ENTREPRISE',
  AUTRE = 'AUTRE',
}

export interface Client {
  id: string;
  prenom: string;
  nom: string;
  entreprise?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  codePostal?: string;
  typeClient: TypeClient;
  statut: StatutClient;
  numeroClient?: string;
  profession?: string;
  creeLe: Date;
  modifieLe: Date;
  chiffreAffaires?: number;
  estVIP: boolean;
  derniereVisite?: Date;
}

export interface ClientResponse extends Omit<Client, 'chiffreAffaires'> {
  chiffreAffaires: number;
  nombreDossiers: number;
  derniereVisiteFormatee?: string;
  dateCreationFormatee: string;
  nomComplet: string;
}

export interface CreateClientDto {
  prenom: string;
  nom: string;
  entreprise?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  codePostal?: string;
  typeClient?: TypeClient;
  statut?: StatutClient;
  numeroClient?: string;
  profession?: string;
  estVIP?: boolean;
}

export type UpdateClientDto = Partial<CreateClientDto>

export interface QueryClientDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  typeClient?: TypeClient;
  statut?: StatutClient;
  ville?: string;
  pays?: string;
  estVIP?: boolean;
}

export interface ClientStatsResponse {
  totalClients: number;
  clientsActifs: number;
  clientsInactifs: number;
  clientsArchives: number;
  clientsVIP: number;
  clientsParType: {
    type: string;
    count: number;
    percentage: number;
  }[];
  clientsParVille: {
    ville: string;
    count: number;
  }[];
  topClientsParChiffreAffaires: {
    id: string;
    nomComplet: string;
    entreprise?: string;
    chiffreAffaires: number;
    nombreDossiers: number;
  }[];
  nouveauxClientsParMois: {
    mois: string;
    count: number;
  }[];
}

export interface DocumentIdentite {
  id: string;
  clientId: string;
  type: TypeDocumentIdentite;
  titre: string;
  numero?: string;
  dateDelivrance?: Date;
  dateExpiration?: Date;
  lieuDelivrance?: string;
  url: string;
  nomFichier: string;
  tailleFichier: number;
  publicId: string;
  creeLe: Date;
  modifieLe: Date;
}

export interface CreateDocumentIdentiteDto {
  type: TypeDocumentIdentite;
  titre: string;
  numero?: string;
  dateDelivrance?: Date;
  dateExpiration?: Date;
  lieuDelivrance?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}