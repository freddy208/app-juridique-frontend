// src/hooks/factures.hooks.ts
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facturesEndpoints } from '@/lib/api/endpoints';
import apiClient from '@/lib/api/client';
import {
  FactureResponse,
  FactureStatsResponse,
  CreateFactureDto,
  UpdateFactureDto,
  QueryFactureDto,
  FactureFilterState,
  FactureState,
  StatutFacture
} from '@/lib/types/factures.types';

// Hook pour récupérer toutes les factures avec filtres
export const useFactures = (filters: QueryFactureDto = {}) => {
  const [filterState, setFilterState] = useState<FactureFilterState>({
    page: 1,
    limit: 10,
    sortBy: 'dateEmission',
    sortOrder: 'desc',
    ...filters
  });

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['factures', filterState],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filterState).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`${facturesEndpoints.getAll}?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateFilters = useCallback((newFilters: Partial<FactureFilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    factures: response?.data || [],
    pagination: response?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    isLoading,
    error,
    refetch,
    updateFilters,
    filterState
  };
};

// Hook pour récupérer une facture par son ID
export const useFacture = (id: string) => {
  const {
    data: facture,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facture', id],
    queryFn: async () => {
      const response = await apiClient.get(facturesEndpoints.getById(id));
      return response.data as FactureResponse;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    facture,
    isLoading,
    error,
    refetch
  };
};

// Hook pour créer une nouvelle facture
export const useCreateFacture = () => {
  const queryClient = useQueryClient();

  const createFactureMutation = useMutation({
    mutationFn: async (factureData: CreateFactureDto) => {
      const response = await apiClient.post(facturesEndpoints.create, factureData);
      return response.data as FactureResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['factureStats'] });
    },
  });

  return {
    createFacture: createFactureMutation.mutateAsync,
    isLoading: createFactureMutation.isPending,
    error: createFactureMutation.error,
    isSuccess: createFactureMutation.isSuccess
  };
};

// Hook pour mettre à jour une facture
export const useUpdateFacture = () => {
  const queryClient = useQueryClient();

  const updateFactureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFactureDto }) => {
      const response = await apiClient.patch(facturesEndpoints.update(id), data);
      return response.data as FactureResponse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['facture', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['factureStats'] });
    },
  });

  return {
    updateFacture: updateFactureMutation.mutateAsync,
    isLoading: updateFactureMutation.isPending,
    error: updateFactureMutation.error,
    isSuccess: updateFactureMutation.isSuccess
  };
};

// Hook pour supprimer une facture
export const useDeleteFacture = () => {
  const queryClient = useQueryClient();

  const deleteFactureMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(facturesEndpoints.delete(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['factureStats'] });
    },
  });

  return {
    deleteFacture: deleteFactureMutation.mutateAsync,
    isLoading: deleteFactureMutation.isPending,
    error: deleteFactureMutation.error,
    isSuccess: deleteFactureMutation.isSuccess
  };
};

// Hook pour marquer une facture comme envoyée
export const useEnvoyerFacture = () => {
  const queryClient = useQueryClient();

  const envoyerFactureMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(facturesEndpoints.envoyerFacture(id));
      return response.data as FactureResponse;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['facture', id] });
      queryClient.invalidateQueries({ queryKey: ['factureStats'] });
    },
  });

  return {
    envoyerFacture: envoyerFactureMutation.mutateAsync,
    isLoading: envoyerFactureMutation.isPending,
    error: envoyerFactureMutation.error,
    isSuccess: envoyerFactureMutation.isSuccess
  };
};

// Hook pour récupérer les statistiques des factures
export const useFactureStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['factureStats'],
    queryFn: async () => {
      const response = await apiClient.get(facturesEndpoints.getStats);
      return response.data as FactureStatsResponse;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch
  };
};

// Hook pour récupérer les factures en retard
export const useFacturesEnRetard = (filters: QueryFactureDto = {}) => {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facturesEnRetard', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`${facturesEndpoints.getEnRetard}?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    facturesEnRetard: response?.data || [],
    pagination: response?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    isLoading,
    error,
    refetch
  };
};

// Hook pour gérer l'état global des factures
export const useFactureState = () => {
  const [state, setState] = useState<FactureState>({
    factures: [],
    currentFacture: null,
    stats: null,
    loading: false,
    error: null,
    filter: {
      page: 1,
      limit: 10,
      sortBy: 'dateEmission',
      sortOrder: 'desc'
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setFactures = (factures: FactureResponse[]) => {
    setState(prev => ({ ...prev, factures }));
  };

  const setCurrentFacture = (facture: FactureResponse | null) => {
    setState(prev => ({ ...prev, currentFacture: facture }));
  };

  const setStats = (stats: FactureStatsResponse | null) => {
    setState(prev => ({ ...prev, stats }));
  };

  const setFilter = (filter: Partial<FactureFilterState>) => {
    setState(prev => ({ ...prev, filter: { ...prev.filter, ...filter } }));
  };

  const setPagination = (pagination: Partial<FactureState['pagination']>) => {
    setState(prev => ({ ...prev, pagination: { ...prev.pagination, ...pagination } }));
  };

  return {
    state,
    setLoading,
    setError,
    setFactures,
    setCurrentFacture,
    setStats,
    setFilter,
    setPagination
  };
};

// Hook pour les options de statut de facture
export const useFactureStatutOptions = () => {
  return [
    { value: StatutFacture.BROUILLON, label: 'Brouillon' },
    { value: StatutFacture.ENVOYEE, label: 'Envoyée' },
    { value: StatutFacture.PAYEE, label: 'Payée' },
    { value: StatutFacture.EN_RETARD, label: 'En retard' },
    { value: StatutFacture.IMPAYEE, label: 'Impayée' },
    { value: StatutFacture.PARTIELLE, label: 'Partiellement payée' }
  ];
};