/**
 * Hook useClients
 * Gestion complète des clients avec React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildQueryString, PaginatedResponse } from '@/lib/api';
import type { Client, StatutClient } from '@/types/client.types';

// Types pour les filtres
type ClientFilters = {
  search?: string;
  statut?: StatutClient;
  skip?: number;
  take?: number;
};

// Types pour création/modification
type CreateClientDto = {
  prenom: string;
  nom: string;
  nomEntreprise?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  statut?: StatutClient;
};

type UpdateClientDto = Partial<CreateClientDto>;

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des clients avec filtres
 */
export function useClients(filters: ClientFilters = {}) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async (): Promise<PaginatedResponse<Client>> => {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/clients${queryString}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

/**
 * Détails d'un client
 */
export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async (): Promise<Client> => {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

/**
 * Dossiers d'un client
 */
export function useClientDossiers(clientId: string | undefined) {
  return useQuery({
    queryKey: ['clients', clientId, 'dossiers'],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/dossiers`);
      return response.data;
    },
    enabled: !!clientId,
  });
}

/**
 * Documents d'un client
 */
export function useClientDocuments(clientId: string | undefined) {
  return useQuery({
    queryKey: ['clients', clientId, 'documents'],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/documents`);
      return response.data;
    },
    enabled: !!clientId,
  });
}

/**
 * Notes d'un client
 */
export function useClientNotes(clientId: string | undefined) {
  return useQuery({
    queryKey: ['clients', clientId, 'notes'],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/notes`);
      return response.data;
    },
    enabled: !!clientId,
  });
}

/**
 * Correspondances d'un client
 */
export function useClientCorrespondances(clientId: string | undefined) {
  return useQuery({
    queryKey: ['clients', clientId, 'correspondances'],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/correspondances`);
      return response.data;
    },
    enabled: !!clientId,
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Créer un client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientDto): Promise<Client> => {
      const response = await api.post('/clients', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

/**
 * Modifier un client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClientDto }): Promise<Client> => {
      const response = await api.put(`/clients/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

/**
 * Changer le statut d'un client
 */
export function useUpdateClientStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutClient }): Promise<Client> => {
      const response = await api.patch(`/clients/${id}/status`, { statut });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

/**
 * Supprimer un client (soft delete)
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

/**
 * Ajouter une note à un client
 */
export function useAddClientNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, contenu }: { clientId: string; contenu: string }) => {
      const response = await api.post(`/clients/${clientId}/notes`, { contenu });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId, 'notes'] });
    },
  });
}

/**
 * Ajouter une correspondance à un client
 */
export function useAddClientCorrespondance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      clientId, 
      data 
    }: { 
      clientId: string; 
      data: { type: string; contenu?: string } 
    }) => {
      const response = await api.post(`/clients/${clientId}/correspondances`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId, 'correspondances'] });
    },
  });
}