// src/types/note.types.ts

// Types de base pour les notes
export interface Note {
  id: string;
  titre?: string;
  contenu: string;
  clientId?: string;
  dossierId?: string;
  utilisateurId: string;
  statut: StatutNote;
  creeLe: Date;
  modifieLe: Date;
  client?: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
  };
  dossier?: {
    id: string;
    numeroUnique: string;
    titre: string;
  };
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
  };
}

export enum StatutNote {
  ACTIF = 'ACTIF',
  SUPPRIME = 'SUPPRIME',
}

// Types pour les formulaires
export interface CreateNoteForm {
  titre?: string;
  contenu: string;
  clientId?: string;
  dossierId?: string;
}

export interface UpdateNoteForm {
  titre?: string;
  contenu?: string;
  clientId?: string;
  dossierId?: string;
  statut?: StatutNote;
}

// Types pour les filtres et la pagination
export interface NotesQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  utilisateurId?: string;
  clientId?: string;
  dossierId?: string;
  statut?: StatutNote;
  typeCible?: 'client' | 'dossier';
  search?: string;
}

// Types pour les statistiques
export interface NoteStats {
  total: number;
  parType: {
    client: number;
    dossier: number;
  };
  parStatut: {
    actif: number;
    supprime: number;
  };
  recentes: Note[];
}

// Types pour les réponses de l'API
export interface NotesResponse {
  data: Note[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NoteResponse {
  data: Note;
}

// Types pour les états du frontend
export interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  stats: NoteStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: NotesQuery;
}