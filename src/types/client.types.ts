/**
 * Types pour le module Clients
 */

export type StatutClient = "ACTIF" | "INACTIF";

export interface Client {
  id: string;
  prenom: string;
  nom: string;
  nomEntreprise?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  statut: StatutClient;
  creeLe: string;
  modifieLe: string;
  
  // Relations (optionnelles)
  dossiers?: Array<{
    id: string;
    numeroUnique: string;
    titre: string
    type: string;
    statut: string;
  }>;
  factures?: Array<{
    id: string;
    montant: number;
    statut: string;
    dateEcheance: string;
  }>;
  
  // Statistiques calculées
  _count?: {
    dossiers: number;
    factures: number;
  };
}

export interface CreateClientDto {
  prenom: string;
  nom: string;
  nomEntreprise?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  statut?: StatutClient;
}

export interface ClientFilters {
  statut?: StatutClient;
  search?: string;
  typeClient?: "particulier" | "entreprise";
  avecDossierActif?: boolean;
}
// Types pour les relations du client
export interface ClientDossier {
  id: string;
  numeroUnique: string;
  titre: string;
  type: string;
  statut: string;
}

export interface ClientFacture {
  id: string;
  montant: number;
  statut: string;
  dateEcheance: string;
  payee: boolean;
}

export interface ClientNote {
  id: string;
  contenu: string;
  utilisateurId: string;
  creeLe: string;
  modifieLe: string;
}