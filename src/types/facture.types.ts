/**
 * Types pour le module Factures
 */

export type StatutFacture = "BROUILLON" | "ENVOYEE" | "PAYEE" | "EN_RETARD" | "SUPPRIME";

export interface Facture {
  id: string;
  dossierId?: string;
  clientId: string;
  montant: number;
  dateEcheance: string;
  payee: boolean;
  statut: StatutFacture;
  creeLe: string;
  modifieLe: string;
  
  // Relations
  client?: {
    id: string;
    prenom: string;
    nom: string;
    nomEntreprise?: string;
    email?: string;
    telephone?: string;
  };
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
}

export interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  montant: number;
}

export interface CreateFactureDto {
  dossierId?: string;
  clientId: string;
  montant: number;
  dateEcheance: string;
  lignes?: LigneFacture[];
  notes?: string;
}

export interface UpdateFactureDto extends Partial<CreateFactureDto> {
  statut?: StatutFacture;
  payee?: boolean;
}

export interface FactureFilters {
  clientId?: string;
  dossierId?: string;
  statut?: StatutFacture;
  dateDebut?: string;
  dateFin?: string;
  payee?: boolean;
  enRetard?: boolean;
}