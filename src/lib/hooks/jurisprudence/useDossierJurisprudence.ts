// src/hooks/jurisprudence/useDossierJurisprudence.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jurisprudenceApi } from '@/lib/api/jurisprudence.api';
import { 
  CreateDossierJurisprudenceDto, 
  UpdateDossierJurisprudenceDto 
} from '@/lib/types/jurisprudence.types';

export const useDossiersJurisprudences = (dossierId?: string, jurisprudenceId?: string) => {
  return useQuery({
    queryKey: ['dossiers-jurisprudences', dossierId, jurisprudenceId],
    queryFn: () => jurisprudenceApi.getDossiersJurisprudences(dossierId, jurisprudenceId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDossierJurisprudence = (id: string) => {
  return useQuery({
    queryKey: ['dossier-jurisprudence', id],
    queryFn: () => jurisprudenceApi.getDossierJurisprudence(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateDossierJurisprudence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDossierJurisprudenceDto) => jurisprudenceApi.createDossierJurisprudence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers-jurisprudences'] });
      queryClient.invalidateQueries({ queryKey: ['jurisprudences'] });
    },
  });
};

export const useUpdateDossierJurisprudence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDossierJurisprudenceDto }) => 
      jurisprudenceApi.updateDossierJurisprudence(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers-jurisprudences'] });
      queryClient.invalidateQueries({ queryKey: ['dossier-jurisprudence', id] });
    },
  });
};

export const useDeleteDossierJurisprudence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => jurisprudenceApi.deleteDossierJurisprudence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers-jurisprudences'] });
      queryClient.invalidateQueries({ queryKey: ['jurisprudences'] });
    },
  });
};