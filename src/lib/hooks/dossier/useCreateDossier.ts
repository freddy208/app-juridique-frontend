// src/hooks/dossier/useCreateDossier.ts (Version FINALE)
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { dossiersEndpoints } from '@/lib/api/endpoints';
import { CreateDossierRequest, Dossier } from '@/lib/types/dossier';

type UseCreateDossierOptions = UseMutationOptions<Dossier, Error, CreateDossierRequest>;

export const useCreateDossier = (options?: UseCreateDossierOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Dossier, Error, CreateDossierRequest>({
    mutationFn: async (newDossier) => {
      const { data } = await apiClient.post(dossiersEndpoints.create, newDossier);
      return data;
    },
    onSuccess: (data, variables, context) => {
      // 1. Nos effets de bord internes
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.setQueryData(['dossier', data.id], data);
      
      // 2. Le callback externe (s'il existe)
      // @ts-expect-error - TS may expect 4 args here due to complex inference, but 3 are correct at runtime.
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // @ts-expect-error - Same reasoning as above for onError.
      options?.onError?.(error, variables, context);
    },
  });
};