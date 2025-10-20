/**
 * Types pour le module Tâches
 */

export type StatutTache = "A_FAIRE" | "EN_COURS" | "TERMINEE" | "SUPPRIME";
export type TachePriorite = "BASSE" | "MOYENNE" | "HAUTE" | "URGENTE";

export interface Tache {
  id: string;
  dossierId?: string;
  titre: string;
  description?: string;
  assigneeId?: string;
  creeParId: string;
  dateLimite?: string;
  statut: StatutTache;
  priorite: TachePriorite; // ✅ ajouté
  creeLe: string;
  modifieLe: string;

  // Relations
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  assignee?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
  createur?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
}

export interface CreateTacheDto {
  dossierId?: string;
  titre: string;
  description?: string;
  assigneeId?: string;
  dateLimite?: string;
  priorite?: TachePriorite; // ✅ ajouté
}

export interface UpdateTacheDto extends Partial<CreateTacheDto> {
  statut?: StatutTache;
  priorite?: TachePriorite; // ✅ ajouté aussi pour les updates
}

export interface TacheFilters {
  dossierId?: string;
  assigneeId?: string;
  creeParId?: string;
  statut?: StatutTache;
  priorite?: TachePriorite; // ✅ pour filtrer par priorité si besoin
  dateDebut?: string;
  dateFin?: string;
  enRetard?: boolean;
  search?: string;
}
