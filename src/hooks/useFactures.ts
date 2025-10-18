/**
 * Hook useFactures
 * Gestion complète de la facturation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, buildQueryString, PaginatedResponse } from '@/lib/api';
import type { Facture, StatutFacture } from '@/types/facture.types';

// Types pour les filtres
type FactureFilters = {
  search?: string;
  clientId?: string;
  dossierId?: string;
  statut?: StatutFacture;
  payee?: boolean;
  skip?: number;
  take?: number;
};

// Types pour création/modification
type CreateFactureDto = {
  clientId: string;
  dossierId?: string;
  montant: number;
  dateEcheance: string;
  statut?: StatutFacture;
};

type UpdateFactureDto = Partial<CreateFactureDto>;

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des factures avec filtres
 */
export function useFactures(filters: FactureFilters = {}) {
  return useQuery({
    queryKey: ['factures', filters],
    queryFn: async (): Promise<PaginatedResponse<Facture>> => {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/invoices${queryString}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

/**
 * Détails d'une facture
 */
export function useFacture(id: string | undefined) {
  return useQuery({
    queryKey: ['factures', id],
    queryFn: async (): Promise<Facture> => {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

/**
 * Télécharger PDF d'une facture
 */
export function useFacturePdf(id: string | undefined) {
  return useQuery({
    queryKey: ['factures', id, 'pdf'],
    queryFn: async () => {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    },
    enabled: false, // On ne lance pas automatiquement, juste au clic
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Créer une facture
 */
export function useCreateFacture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFactureDto): Promise<Facture> => {
      const response = await api.post('/invoices', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
    },
  });
}

/**
 * Modifier une facture
 */
export function useUpdateFacture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFactureDto }): Promise<Facture> => {
      const response = await api.put(`/invoices/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['factures', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['factures'] });
    },
  });
}

/**
 * Changer le statut d'une facture
 */
export function useUpdateFactureStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutFacture }): Promise<Facture> => {
      const response = await api.patch(`/invoices/${id}/status`, { statut });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['factures', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['factures'] });
    },
  });
}

/**
 * Marquer une facture comme payée
 */
export function useMarkFacturePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Facture> => {
      const response = await api.patch(`/invoices/${id}/pay`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['factures', id] });
      queryClient.invalidateQueries({ queryKey: ['factures'] });
    },
  });
}

/**
 * Supprimer une facture (soft delete)
 */
export function useDeleteFacture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
    },
  });
}