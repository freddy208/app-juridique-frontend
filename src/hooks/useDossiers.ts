/**
 * Hook useDossiers
 * Gestion complète des dossiers avec React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, buildQueryString, PaginatedResponse } from '@/lib/api';
import type { Dossier, StatutDossier, TypeDossier } from '@/types/dossier.types';

// Types pour les filtres
type DossierFilters = {
  search?: string;
  clientId?: string;
  responsableId?: string;
  type?: TypeDossier;
  statut?: StatutDossier;
  skip?: number;
  take?: number;
};

// Types pour création/modification
type CreateDossierDto = {
  titre: string;
  type: TypeDossier;
  clientId: string;
  responsableId?: string;
  description?: string;
  detailsSpecifiques?: Record<string, unknown>; // ✅ ajouté
};

type UpdateDossierDto = Partial<CreateDossierDto>;

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des dossiers avec filtres
 */
export function useDossiers(filters: DossierFilters = {}) {
  return useQuery({
    queryKey: ['dossiers', filters],
    queryFn: async (): Promise<PaginatedResponse<Dossier>> => {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/dossiers${queryString}`);
      return response.data;
    },
    staleTime: 30000, // 30 secondes
  });
}

/**
 * Détails d'un dossier
 */
export function useDossier(id: string | undefined) {
  return useQuery({
    queryKey: ['dossiers', id],
    queryFn: async (): Promise<Dossier> => {
      const response = await api.get(`/dossiers/${id}`);
      return response.data;
    },
    enabled: !!id, // Ne lance la requête que si id existe
    staleTime: 60000, // 1 minute
  });
}

/**
 * Documents d'un dossier
 */
export function useDossierDocuments(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'documents'],
    queryFn: async () => {
      const response = await api.get(`/dossiers/${dossierId}/documents`);
      return response.data;
    },
    enabled: !!dossierId,
  });
}

/**
 * Tâches d'un dossier
 */
export function useDossierTaches(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'tasks'],
    queryFn: async () => {
      const response = await api.get(`/dossiers/${dossierId}/tasks`);
      return response.data;
    },
    enabled: !!dossierId,
  });
}

/**
 * Événements d'un dossier
 */
export function useDossierEvenements(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'events'],
    queryFn: async () => {
      const response = await api.get(`/dossiers/${dossierId}/events`);
      return response.data;
    },
    enabled: !!dossierId,
  });
}

/**
 * Messages d'un dossier
 */
export function useDossierMessages(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'chat'],
    queryFn: async () => {
      const response = await api.get(`/dossiers/${dossierId}/chat`);
      return response.data;
    },
    enabled: !!dossierId,
  });
}

/**
 * Notes d'un dossier
 */
export function useDossierNotes(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'notes'],
    queryFn: async () => {
      const response = await api.get(`/dossiers/${dossierId}/notes`);
      return response.data;
    },
    enabled: !!dossierId,
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Créer un dossier
 */
export function useCreateDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDossierDto): Promise<Dossier> => {
      const response = await api.post('/dossiers', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalider le cache pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
    },
  });
}

/**
 * Modifier un dossier
 */
export function useUpdateDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDossierDto }): Promise<Dossier> => {
      const response = await api.put(`/dossiers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
    },
  });
}

/**
 * Changer le statut d'un dossier
 */
export function useUpdateDossierStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutDossier }): Promise<Dossier> => {
      const response = await api.patch(`/dossiers/${id}/status`, { statut });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
    },
  });
}

/**
 * Réassigner un dossier
 */
export function useReassignDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, responsableId }: { id: string; responsableId: string }): Promise<Dossier> => {
      const response = await api.patch(`/dossiers/${id}/assign`, { responsableId });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
    },
  });
}

/**
 * Supprimer un dossier (soft delete)
 */
export function useDeleteDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/dossiers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
    },
  });
}

/**
 * Ajouter une note à un dossier
 */
export function useAddDossierNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dossierId, contenu }: { dossierId: string; contenu: string }) => {
      const response = await api.post(`/dossiers/${dossierId}/notes`, { contenu });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers', variables.dossierId, 'notes'] });
    },
  });
}