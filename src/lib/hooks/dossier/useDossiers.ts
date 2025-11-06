// src/hooks/dossier/useDossiers.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { dossiersEndpoints } from '@/lib/api/endpoints';
import { DossierListResponse, QueryDossiersParams } from '@/lib/types/dossier';

// Type pour les options de requête, pour plus de flexibilité
type UseDossiersOptions = Omit<UseQueryOptions<DossierListResponse>, 'queryKey' | 'queryFn'>;

export const useDossiers = (params?: QueryDossiersParams, options?: UseDossiersOptions) => {
  return useQuery<DossierListResponse>({
    queryKey: ['dossiers', params],
    queryFn: async () => {
      const { data } = await apiClient.get(dossiersEndpoints.getAll, { params });
      return data;
    },
    ...options,
  });
};