/**
 * Hook useEvenements
 * Gestion complète du calendrier et événements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, buildQueryString, PaginatedResponse } from '@/lib/api';
import type { EvenementCalendrier, StatutEvenement } from '@/types/evenement.types';

// Types pour les filtres
type EvenementFilters = {
  search?: string;
  dossierId?: string;
  creeParId?: string;
  statut?: StatutEvenement;
  dateDebut?: string;
  dateFin?: string;
  skip?: number;
  take?: number;
};

// Types pour création/modification
type CreateEvenementDto = {
  titre: string;
  description?: string;
  debut: string;
  fin: string;
  dossierId?: string;
};

type UpdateEvenementDto = Partial<CreateEvenementDto>;

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des événements avec filtres
 */
export function useEvenements(filters: EvenementFilters = {}) {
  return useQuery({
    queryKey: ['evenements', filters],
    queryFn: async (): Promise<PaginatedResponse<EvenementCalendrier>> => {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/events${queryString}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

/**
 * Détails d'un événement
 */
export function useEvenement(id: string | undefined) {
  return useQuery({
    queryKey: ['evenements', id],
    queryFn: async (): Promise<EvenementCalendrier> => {
      const response = await api.get(`/events/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Créer un événement
 */
export function useCreateEvenement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEvenementDto): Promise<EvenementCalendrier> => {
      const response = await api.post('/events', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
    },
  });
}

/**
 * Modifier un événement
 */
export function useUpdateEvenement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEvenementDto }): Promise<EvenementCalendrier> => {
      const response = await api.put(`/events/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evenements', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
    },
  });
}

/**
 * Changer le statut d'un événement
 */
export function useUpdateEvenementStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutEvenement }): Promise<EvenementCalendrier> => {
      const response = await api.patch(`/events/${id}/status`, { statut });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evenements', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
    },
  });
}

/**
 * Supprimer un événement (soft delete)
 */
export function useDeleteEvenement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
    },
  });
}