/**
 * Types pour le module Notifications
 */

export type TypeNotification =
  | "INFO"
  | "ALERTE"
  | "URGENT"
  | "TACHE"
  | "MESSAGE"
  | "FACTURE"
  | "AUDIENCE";

export interface Notification {
  id: string;
  utilisateurId: string;
  titre: string;
  message: string;
  type: TypeNotification;
  lien?: string | null;
  lu: boolean;
  creeLe: string;
}

export interface CreateNotificationDto {
  utilisateurId: string;
  titre: string;
  message: string;
  type?: TypeNotification;
  lien?: string | null;
}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {
  lu?: boolean;
}

export interface NotificationFilters {
  utilisateurId?: string;
  lu?: boolean;
  type?: TypeNotification;
  search?: string;
  skip?: number;
  take?: number;
}

export interface PaginatedNotifications {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
