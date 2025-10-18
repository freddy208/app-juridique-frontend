/**
 * Types pour le module Événements du calendrier
 */

export type StatutEvenement = "PREVU" | "TERMINE" | "ANNULE" | "SUPPRIME";

export interface EvenementCalendrier {
  id: string;
  dossierId?: string | null;
  titre: string;
  description?: string | null;
  debut: string; // ISO
  fin: string;   // ISO
  creeParId: string;
  statut: StatutEvenement;
  creeLe: string;
  modifieLe: string;
}

export interface CreateEvenementDto {
  dossierId?: string | null;
  titre: string;
  description?: string | null;
  debut: string;
  fin: string;
  creeParId: string;
  statut?: StatutEvenement;
}

/**
 * DTO de mise à jour d’un événement
 * (équivalent à une version partielle du DTO de création)
 */
export type UpdateEvenementDto = Partial<CreateEvenementDto>;

export interface EvenementFilters {
  dossierId?: string;
  creeParId?: string;
  statut?: StatutEvenement;
  search?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface PaginatedEvenements {
  data: EvenementCalendrier[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
