// src/types/messagerie.types.ts

export enum RoleUtilisateur {
  ADMIN = 'ADMIN',
  DG = 'DG',
  AVOCAT = 'AVOCAT',
  SECRETAIRE = 'SECRETAIRE',
  ASSISTANT = 'ASSISTANT',
  JURISTE = 'JURISTE',
  STAGIAIRE = 'STAGIAIRE',
}

export enum StatutDiscussion {
  ACTIF = 'ACTIF',
  SUPPRIME = 'SUPPRIME',
}

export enum StatutMessage {
  ENVOYE = 'ENVOYE',
  LU = 'LU',
  SUPPRIME = 'SUPPRIME',
}

export enum TypeNotification {
  INFO = 'INFO',
  ALERTE = 'ALERTE',
  URGENT = 'URGENT',
  TACHE = 'TACHE',
  MESSAGE = 'MESSAGE',
  FACTURE = 'FACTURE',
  AUDIENCE = 'AUDIENCE',
}

export interface Utilisateur {
  id: string;
  prenom: string;
  nom: string;
  role: RoleUtilisateur;
}

export interface Dossier {
  id: string;
  numeroUnique: string;
  titre: string;
  type: string;
  statut: string;
}

export interface Participant {
  id: string;
  prenom: string;
  nom: string;
  role: string;
  aRejointLe: Date;
  dernierMessageLu?: Date;
}

export interface DernierMessage {
  id: string;
  contenu: string;
  creeLe: Date;
  expediteur: {
    id: string;
    prenom: string;
    nom: string;
  };
}

export interface Discussion {
  id: string;
  titre?: string;
  statut: StatutDiscussion;
  creeLe: Date;
  modifieLe: Date;
  dernierMessage?: DernierMessage;
  nombreMessages: number;
  nombreMessagesNonLus: number;
  createur: Utilisateur;
  dossier?: Dossier;
  participants: Participant[];
}

export interface Reaction {
  id: string;
  type: string;
  creeLe: Date;
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
  };
}

export interface Fichier {
  id: string;
  nom: string;
  type: string;
  taille: number;
  url: string;
}

export interface Message {
  id: string;
  contenu: string;
  statut: StatutMessage;
  creeLe: Date;
  modifieLe: Date;
  expediteur: Utilisateur;
  discussion: {
    id: string;
    titre?: string;
  };
  fichiers?: Fichier[];
  reactions: Reaction[];
  estLu: boolean;
  estEdite: boolean;
}

export interface TopParticipant {
  id: string;
  prenom: string;
  nom: string;
  nombreMessages: number;
}

export interface MessagerieStats {
  totalDiscussions: number;
  totalMessages: number;
  messagesNonLus: number;
  discussionsActives: number;
  topParticipants: TopParticipant[];
  discussionsRecentes: Discussion[];
  messagesRecents: Message[];
}

export interface CreateDiscussionDto {
  titre?: string;
  dossierId?: string;
  participantsIds?: string[];
  messageInitial?: string;
}

export interface UpdateDiscussionDto {
  titre?: string;
  statut?: StatutDiscussion;
}

export interface CreateMessageDto {
  discussionId: string;
  contenu: string;
  fichiersIds?: string[];
}

export interface UpdateMessageDto {
  contenu?: string;
  statut?: StatutMessage;
}

export interface CreateReactionDto {
  type: string;
}

export interface QueryDiscussionsDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  createurId?: string;
  dossierId?: string;
  participantId?: string;
  statut?: StatutDiscussion;
  search?: string;
  nonLuesSeulement?: boolean;
  avecMessagesNonLus?: boolean;
}

export interface QueryMessagesDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  discussionId?: string;
  expediteurId?: string;
  statut?: StatutMessage;
  dateMin?: Date;
  dateMax?: Date;
  search?: string;
  nonLusSeulement?: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}