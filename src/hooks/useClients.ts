/**
 * Hook useClients
 * Gestion complète des clients avec React Query
 * ✅ CORRIGÉ : Aligné avec les réponses backend
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/api/clients.service"
import type { 
  Client, 
  StatutClient, 
  ClientFilters,
  CreateClientDto,
  UpdateClientDto,
  ClientDossier,
  ClientDocument,
  ClientFacture,
  ClientNote,
  ClientCorrespondance,
  ClientAudit,
  BackendPaginatedResponse,
} from '@/types/client.types';

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des clients avec filtres
 * ✅ CORRIGÉ : Gère la structure backend
 */
export function useClients(filters: ClientFilters = {}) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: (): Promise<BackendPaginatedResponse<Client>> => {
      return clientsService.getClients(filters, {
        skip: filters.skip || 0,
        take: filters.take || 10,
      });
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
    queryFn: (): Promise<Client> => {
      if (!id) throw new Error('Client ID required');
      return clientsService.getClientById(id);
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

/**
 * Dossiers d'un client
 * ✅ CORRIGÉ : Pagination backend
 */
export function useClientDossiers(
  clientId: string | undefined, 
  skip = 0, 
  take = 10
) {
  return useQuery({
    queryKey: ['clients', clientId, 'dossiers', skip, take],
    queryFn: (): Promise<BackendPaginatedResponse<ClientDossier>> => {
      if (!clientId) throw new Error('Client ID required');
      return clientsService.getClientDossiers(clientId, skip, take);
    },
    enabled: !!clientId,
  });
}

/**
 * Documents d'un client
 * ✅ CORRIGÉ : Pagination backend
 */
export function useClientDocuments(
  clientId: string | undefined,
  skip = 0,
  take = 10
) {
  return useQuery({
    queryKey: ['clients', clientId, 'documents', skip, take],
    queryFn: (): Promise<BackendPaginatedResponse<ClientDocument>> => {
      if (!clientId) throw new Error('Client ID required');
      return clientsService.getClientDocuments(clientId, skip, take);
    },
    enabled: !!clientId,
  });
}

/**
 * Factures d'un client
 * ✅ NOUVEAU : Endpoint implémenté
 */
export function useClientFactures(
  clientId: string | undefined,
  skip = 0,
  take = 10
) {
  return useQuery({
    queryKey: ['clients', clientId, 'factures', skip, take],
    queryFn: (): Promise<BackendPaginatedResponse<ClientFacture>> => {
      if (!clientId) throw new Error('Client ID required');
      return clientsService.getClientFactures(clientId, skip, take);
    },
    enabled: !!clientId,
  });
}

/**
 * Notes d'un client
 * ✅ CORRIGÉ : Pagination backend
 */
export function useClientNotes(
  clientId: string | undefined,
  skip = 0,
  take = 10
) {
  return useQuery({
    queryKey: ['clients', clientId, 'notes', skip, take],
    queryFn: (): Promise<BackendPaginatedResponse<ClientNote>> => {
      if (!clientId) throw new Error('Client ID required');
      return clientsService.getClientNotes(clientId, skip, take);
    },
    enabled: !!clientId,
  });
}

/**
 * Correspondances d'un client
 * ✅ CORRIGÉ : Pagination backend
 */
export function useClientCorrespondances(
  clientId: string | undefined,
  skip = 0,
  take = 10
) {
  return useQuery({
    queryKey: ['clients', clientId, 'correspondances', skip, take],
    queryFn: (): Promise<BackendPaginatedResponse<ClientCorrespondance>> => {
      if (!clientId) throw new Error('Client ID required');
      return clientsService.getClientCorrespondances(clientId, skip, take);
    },
    enabled: !!clientId,
  });
}

/**
 * ✅ NOUVEAU : Historique d'audit d'un client
 */
export function useClientAudit(
  clientId: string | undefined,
  skip = 0,
  take = 20
) {
  return useQuery({
    queryKey: ['clients', clientId, 'audit', skip, take],
    queryFn: (): Promise<BackendPaginatedResponse<ClientAudit>> => {
      if (!clientId) throw new Error('Client ID required');
      return clientsService.getClientAudit(clientId, skip, take);
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
    mutationFn: (data: CreateClientDto): Promise<Client> => {
      return clientsService.createClient(data);
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
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }): Promise<Client> => {
      return clientsService.updateClient(id, data);
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
    mutationFn: ({ id, statut }: { id: string; statut: StatutClient }): Promise<Client> => {
      return clientsService.changeStatut(id, statut);
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
    mutationFn: (id: string): Promise<void> => {
      return clientsService.deleteClient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

/**
 * ✅ NOUVEAU : Suppression en masse
 */
export function useBulkDeleteClients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]): Promise<{ success: boolean; message: string; deletedCount: number }> => {
      return clientsService.bulkDeleteClients(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

/**
 * Ajouter une note à un client
 * ✅ CORRIGÉ : Ajout du dossierId optionnel
 */
export function useAddClientNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      clientId, 
      contenu, 
      dossierId 
    }: { 
      clientId: string; 
      contenu: string;
      dossierId?: string;
    }): Promise<ClientNote> => {
      return clientsService.addClientNote(clientId, contenu, dossierId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId, 'notes'] });
    },
  });
}

/**
 * Ajouter une correspondance à un client
 * ✅ CORRIGÉ : Types corrects
 */
export function useAddClientCorrespondance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      clientId, 
      data 
    }: { 
      clientId: string; 
      data: { type: "APPEL" | "EMAIL" | "RENDEZ_VOUS" | "AUTRE"; contenu?: string } 
    }): Promise<ClientCorrespondance> => {
      return clientsService.addClientCorrespondance(clientId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.clientId, 'correspondances'] });
    },
  });
}

/**
 * ✅ NOUVEAU : Export des clients
 */
export function useExportClients() {
  return useMutation({
    mutationFn: (filters?: ClientFilters) => {
      return clientsService.exportClients(filters);
    },
  });
}