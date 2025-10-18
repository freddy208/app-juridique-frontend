// types/note.types.ts

export type StatutNote = "ACTIF" | "SUPPRIME";

export interface UtilisateurMini {
  id: string;
  prenom: string;
  nom: string;
}

export interface Note {
  id: string;
  clientId?: string;
  dossierId?: string;
  utilisateurId: string;
  contenu: string;
  statut: StatutNote;
  creeLe: string;
  modifieLe: string;
  utilisateur: UtilisateurMini;
}

export interface CreateNoteDto {
  clientId?: string;
  dossierId?: string;
  utilisateurId: string;
  contenu: string;
}

export interface UpdateNoteDto {
  contenu?: string;
  statut?: StatutNote;
}
