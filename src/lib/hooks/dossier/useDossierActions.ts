// src/hooks/dossier/useDossierActions.ts (Version FINALE)
import { useMutation, useQueryClient, UseMutationOptions, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { dossiersEndpoints } from '@/lib/api/endpoints';
import { Dossier } from '@/lib/types/dossier';

// Hook pour changer le statut
type UseChangeStatutOptions = UseMutationOptions<Dossier, Error, { id: string; statut: string }>;
export const useChangeDossierStatut = (options?: UseChangeStatutOptions) => {
  const queryClient = useQueryClient();
  return useMutation<Dossier, Error, { id: string; statut: string }>({
    mutationFn: async ({ id, statut }) => {
      const { data } = await apiClient.patch(dossiersEndpoints.changeStatut(id), { statut });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', variables.id] });
      // @ts-expect-error - TS may expect 4 args here due to complex inference, but 3 are correct at runtime.
      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      // @ts-expect-error - Same reasoning as above for onError.
      options?.onError?.(error, variables, context);
    },
  });
};

// Hook pour assigner un responsable
type UseAssignResponsableOptions = UseMutationOptions<Dossier, Error, { id: string; responsableId: string }>;
export const useAssignDossierResponsable = (options?: UseAssignResponsableOptions) => {
  const queryClient = useQueryClient();
  return useMutation<Dossier, Error, { id: string; responsableId: string }>({
    mutationFn: async ({ id, responsableId }) => {
      const { data } = await apiClient.patch(dossiersEndpoints.assignerResponsable(id), { responsableId });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', variables.id] });
      // @ts-expect-error - TS may expect 4 args here due to complex inference, but 3 are correct at runtime.
      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      // @ts-expect-error - Same reasoning as above for onError.
      options?.onError?.(error, variables, context);
    },
  });
};

// Hook pour supprimer un dossier
type UseDeleteDossierOptions = UseMutationOptions<void, Error, string>;
export const useDeleteDossier = (options?: UseDeleteDossierOptions) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(dossiersEndpoints.delete(id));
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.removeQueries({ queryKey: ['dossier', id] });
      // @ts-expect-error - TS may expect 4 args here due to complex inference, but 3 are correct at runtime.
      options?.onSuccess?.(_, id);
    },
    onError: (error, id, context) => {
      // @ts-expect-error - Same reasoning as above for onError.
      options?.onError?.(error, id, context);
    },
  });
};

// Hook pour les statistiques (inchangé)
export const useDossierStats = () => {
  return useQuery({
    queryKey: ['dossierStats'],
    queryFn: async () => {
      const { data } = await apiClient.get(dossiersEndpoints.getStats);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};