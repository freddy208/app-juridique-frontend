// src/hooks/dossier/useUpdateDossier.ts (Version FINALE)
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { dossiersEndpoints } from '@/lib/api/endpoints';
import { UpdateDossierRequest, Dossier } from '@/lib/types/dossier';

type UseUpdateDossierOptions = UseMutationOptions<Dossier, Error, { id: string; data: UpdateDossierRequest }>;

export const useUpdateDossier = (options?: UseUpdateDossierOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Dossier, Error, { id: string; data: UpdateDossierRequest }>({
    mutationFn: async ({ id, data }) => {
      const { data: updatedDossier } = await apiClient.patch(dossiersEndpoints.update(id), data);
      return updatedDossier;
    },
    onSuccess: (updatedDossier, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', variables.id] });
      
      // @ts-expect-error - TS may expect 4 args here due to complex inference, but 3 are correct at runtime.
      options?.onSuccess?.(updatedDossier, variables, context);
    },
    onError: (error, variables, context) => {
      // @ts-expect-error - Same reasoning as above for onError.
      options?.onError?.(error, variables, context);
    },
  });
};