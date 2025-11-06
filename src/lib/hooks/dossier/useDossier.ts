// src/hooks/dossier/useDossier.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { dossiersEndpoints } from '@/lib/api/endpoints';
import { Dossier } from '@/lib/types/dossier';

type UseDossierOptions = Omit<UseQueryOptions<Dossier>, 'queryKey' | 'queryFn'>;

export const useDossier = (id: string, options?: UseDossierOptions) => {
  return useQuery<Dossier>({
    queryKey: ['dossier', id],
    queryFn: async () => {
      if (!id) return null; // Ne pas faire l'appel si l'id est vide
      const { data } = await apiClient.get(dossiersEndpoints.getById(id));
      return data;
    },
    enabled: !!id, // N'exécuter la requête que si l'id existe
    ...options,
  });
};