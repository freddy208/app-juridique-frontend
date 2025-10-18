/**
 * Hook useNotifications
 * Gestion des notifications utilisateur
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, PaginatedResponse } from '@/lib/api';
import type { Notification, TypeNotification } from '@/types/notification.types';

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste de toutes les notifications
 */
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<PaginatedResponse<Notification>> => {
      const response = await api.get('/notifications');
      return response.data;
    },
    staleTime: 10000, // 10 secondes
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });
}

/**
 * Nombre de notifications non lues
 */
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async (): Promise<number> => {
      const response = await api.get('/notifications/unread-count');
      return response.data.count || 0;
    },
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

/**
 * Notifications non lues seulement
 */
export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async (): Promise<Notification[]> => {
      const response = await api.get('/notifications/unread');
      return response.data;
    },
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

// ============================================
// MUTATIONS (POST, PATCH, DELETE)
// ============================================

/**
 * Marquer une notification comme lue
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

/**
 * Marquer toutes les notifications comme lues
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.patch('/notifications/mark-all-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

/**
 * Supprimer une notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

/**
 * Créer une notification (système interne)
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      utilisateurId: string;
      titre: string;
      message: string;
      type: TypeNotification;
      lien?: string;
    }): Promise<Notification> => {
      const response = await api.post('/notifications', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}