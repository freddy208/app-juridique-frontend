/**
 * Hook useTaches
 * Gestion complète des tâches avec React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, buildQueryString, PaginatedResponse } from '@/lib/api';
import type { Tache, StatutTache } from '@/types/tache.types';

// Types pour les filtres
type TacheFilters = {
  search?: string;
  dossierId?: string;
  assigneeId?: string;
  creeParId?: string;
  statut?: StatutTache;
  skip?: number;
  take?: number;
};

// Types pour création/modification
type CreateTacheDto = {
  titre: string;
  description?: string;
  dossierId?: string;
  assigneeId?: string;
  dateLimite?: string;
  priorite?: "BASSE" | "MOYENNE" | "HAUTE" | "URGENTE"; // ✅ ajouté
};

type UpdateTacheDto = Partial<CreateTacheDto> & {
  statut?: StatutTache;
};

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des tâches avec filtres
 */
export function useTaches(filters: TacheFilters = {}) {
  return useQuery({
    queryKey: ['taches', filters],
    queryFn: async (): Promise<PaginatedResponse<Tache>> => {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/tasks${queryString}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

/**
 * Détails d'une tâche
 */
export function useTache(id: string | undefined) {
  return useQuery({
    queryKey: ['taches', id],
    queryFn: async (): Promise<Tache> => {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

/**
 * Commentaires d'une tâche
 */
export function useTacheComments(tacheId: string | undefined) {
  return useQuery({
    queryKey: ['taches', tacheId, 'comments'],
    queryFn: async () => {
      const response = await api.get(`/tasks/${tacheId}/comments`);
      return response.data;
    },
    enabled: !!tacheId,
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Créer une tâche
 */
export function useCreateTache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTacheDto): Promise<Tache> => {
      const response = await api.post('/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taches'] });
    },
  });
}

/**
 * Modifier une tâche
 */
export function useUpdateTache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTacheDto }): Promise<Tache> => {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taches', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['taches'] });
    },
  });
}

/**
 * Changer le statut d'une tâche
 */
export function useUpdateTacheStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutTache }): Promise<Tache> => {
      const response = await api.patch(`/tasks/${id}/status`, { statut });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taches', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['taches'] });
    },
  });
}

/**
 * Supprimer une tâche (soft delete)
 */
export function useDeleteTache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taches'] });
    },
  });
}

/**
 * Ajouter un commentaire sur une tâche
 */
export function useAddTacheComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tacheId, contenu }: { tacheId: string; contenu: string }) => {
      const response = await api.post(`/tasks/${tacheId}/comments`, { contenu });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taches', variables.tacheId, 'comments'] });
    },
  });
}

/**
 * Modifier un commentaire
 */
export function useUpdateTacheComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tacheId, 
      commentId, 
      contenu 
    }: { 
      tacheId: string; 
      commentId: string; 
      contenu: string 
    }) => {
      const response = await api.patch(`/tasks/${tacheId}/comments/${commentId}`, { contenu });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taches', variables.tacheId, 'comments'] });
    },
  });
}

/**
 * Supprimer un commentaire
 */
export function useDeleteTacheComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tacheId, commentId }: { tacheId: string; commentId: string }) => {
      await api.delete(`/tasks/${tacheId}/comments/${commentId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taches', variables.tacheId, 'comments'] });
    },
  });
}