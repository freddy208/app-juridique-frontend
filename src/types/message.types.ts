// types/message.types.ts

export type StatutMessage = "ENVOYE" | "LU" | "SUPPRIME";

export interface MessageChat {
  id: string;
  dossierId?: string;
  expediteurId: string;
  contenu: string;
  statut: StatutMessage;
  creeLe: string;
  modifieLe: string;

  // Relations
  expediteur: {
    id: string;
    prenom: string;
    nom: string;
  };
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  utilisateurId: string;
  type: string; // LIKE, LOVE, HAHA, etc.
  creeLe: string;
}

export interface CreateMessageDto {
  dossierId?: string;
  expediteurId: string;
  contenu: string;
}

export interface UpdateMessageDto {
  contenu?: string;
  statut?: StatutMessage;
}
