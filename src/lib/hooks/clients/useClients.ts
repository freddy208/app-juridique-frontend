/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/api/useClients.ts

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { clientsEndpoints } from '@/lib/api/endpoints';
import {
  ClientResponse,
  CreateClientDto,
  UpdateClientDto,
  QueryClientDto,
  PaginatedResponse,
} from './../../types/client.types';

// Récupérer tous les clients avec pagination et filtres
export const useClients = (query: QueryClientDto = {}) => {
  const [params, setParams] = useState<QueryClientDto>(query);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<ClientResponse>>(
        clientsEndpoints.getAll,
        { params }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateParams = (newParams: Partial<QueryClientDto>) => {
    setParams((prev: any) => ({ ...prev, ...newParams }));
  };

  return {
    clients: response?.data || [],
    total: response?.total || 0,
    page: response?.page || 1,
    limit: response?.limit || 10,
    totalPages: response?.totalPages || 0,
    isLoading,
    error,
    refetch,
    updateParams,
  };
};

// Récupérer un client par son ID
export const useClient = (id: string, enabled = true) => {
  const {
    data: client,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data } = await apiClient.get<ClientResponse>(
        clientsEndpoints.getById(id)
      );
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    client,
    isLoading,
    error,
    refetch,
  };
};

// Créer un nouveau client
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  const createClientMutation = useMutation({
    mutationFn: async (clientData: CreateClientDto) => {
      const { data } = await apiClient.post<ClientResponse>(
        clientsEndpoints.create,
        clientData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    createClient: createClientMutation.mutateAsync,
    isCreating: createClientMutation.isPending,
    error: createClientMutation.error,
  };
};

// Mettre à jour un client
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, clientData }: { id: string; clientData: UpdateClientDto }) => {
      const { data } = await apiClient.patch<ClientResponse>(
        clientsEndpoints.update(id),
        clientData
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
    },
  });

  return {
    updateClient: updateClientMutation.mutateAsync,
    isUpdating: updateClientMutation.isPending,
    error: updateClientMutation.error,
  };
};

// Supprimer un client
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(clientsEndpoints.delete(id));
      return id;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.removeQueries({ queryKey: ['client', id] });
    },
  });

  return {
    deleteClient: deleteClientMutation.mutateAsync,
    isDeleting: deleteClientMutation.isPending,
    error: deleteClientMutation.error,
  };
};