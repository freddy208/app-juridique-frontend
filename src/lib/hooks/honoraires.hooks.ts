import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  apiClient  from '@/lib/api/client';
import {
  HonoraireResponse,
  HonoraireStatsResponse,
  BaremeOHADA,
  CreateHonoraireDto,
  UpdateHonoraireDto,
  QueryHonoraireDto,
  CalculBaremeResponse,
  StatutHonoraire,
} from '@/lib/types/honoraires.types';

// Configuration des clés de requête
export const honorairesKeys = {
  all: ['honoraires'] as const,
  lists: () => [...honorairesKeys.all, 'list'] as const,
  list: (query: QueryHonoraireDto) => [...honorairesKeys.lists(), query] as const,
  details: () => [...honorairesKeys.all, 'detail'] as const,
  detail: (id: string) => [...honorairesKeys.details(), id] as const,
  stats: () => [...honorairesKeys.all, 'stats'] as const,
  baremes: () => [...honorairesKeys.all, 'baremes'] as const,
  enRetard: (query: QueryHonoraireDto) => [...honorairesKeys.all, 'en-retard', query] as const,
};

// Hook pour récupérer tous les honoraires
export const useHonoraires = (query: QueryHonoraireDto = {}) => {
  return useQuery({
    queryKey: honorairesKeys.list(query),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`/honoraires?${params.toString()}`);
      return response.data as { data: HonoraireResponse[]; total: number; page: number; limit: number };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer un honoraire par son ID
export const useHonoraire = (id: string) => {
  return useQuery({
    queryKey: honorairesKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/honoraires/${id}`);
      return response.data as HonoraireResponse;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer les statistiques des honoraires
export const useHonorairesStats = () => {
  return useQuery({
    queryKey: honorairesKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get('/honoraires/stats');
      return response.data as HonoraireStatsResponse;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les barèmes OHADA
export const useBaremesOHADA = () => {
  return useQuery({
    queryKey: honorairesKeys.baremes(),
    queryFn: async () => {
      const response = await apiClient.get('/honoraires/baremes-ohada');
      return response.data as BaremeOHADA[];
    },
    staleTime: 60 * 60 * 1000, // 1 heure
  });
};

// Hook pour calculer un honoraire selon un barème OHADA
export const useCalculerBaremeOHADA = (baremeId: string, montantBase: number) => {
  return useQuery({
    queryKey: ['calcul-bareme', baremeId, montantBase],
    queryFn: async () => {
      const response = await apiClient.get('/honoraires/calculer-bareme', {
        params: { baremeId, montantBase },
      });
      return response.data as CalculBaremeResponse;
    },
    enabled: !!baremeId && montantBase > 0,
  });
};

// Hook pour récupérer les honoraires en retard
export const useHonorairesEnRetard = (query: QueryHonoraireDto = {}) => {
  return useQuery({
    queryKey: honorairesKeys.enRetard(query),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`/honoraires/en-retard?${params.toString()}`);
      return response.data as { data: HonoraireResponse[]; total: number; page: number; limit: number };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour créer un honoraire
export const useCreateHonoraire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (honoraireData: CreateHonoraireDto) => {
      const response = await apiClient.post('/honoraires', honoraireData);
      return response.data as HonoraireResponse;
    },
    onSuccess: () => {
      // Invalider les requêtes liées aux honoraires
      queryClient.invalidateQueries({ queryKey: honorairesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.stats() });
    },
  });
};

// Hook pour mettre à jour un honoraire
export const useUpdateHonoraire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHonoraireDto }) => {
      const response = await apiClient.patch(`/honoraires/${id}`, data);
      return response.data as HonoraireResponse;
    },
    onSuccess: (_, { id }) => {
      // Invalider les requêtes liées à cet honoraire et à la liste des honoraires
      queryClient.invalidateQueries({ queryKey: honorairesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.stats() });
    },
  });
};

// Hook pour mettre à jour le statut d'un honoraire
export const useUpdateStatutHonoraire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutHonoraire }) => {
      const response = await apiClient.patch(`/honoraires/${id}/statut`, { statut });
      return response.data as HonoraireResponse;
    },
    onSuccess: (_, { id }) => {
      // Invalider les requêtes liées à cet honoraire et à la liste des honoraires
      queryClient.invalidateQueries({ queryKey: honorairesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.stats() });
    },
  });
};

// Hook pour supprimer un honoraire
export const useDeleteHonoraire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/honoraires/${id}`);
      return id;
    },
    onSuccess: (_, id) => {
      // Supprimer la requête de détail et invalider la liste des honoraires
      queryClient.removeQueries({ queryKey: honorairesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: honorairesKeys.stats() });
    },
  });
};