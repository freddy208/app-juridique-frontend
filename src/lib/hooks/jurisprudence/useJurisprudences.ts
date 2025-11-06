// src/hooks/jurisprudence/useJurisprudences.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jurisprudenceApi } from '@/lib/api/jurisprudence.api';
import { 
  QueryJurisprudenceDto, 
  CreateJurisprudenceDto, 
  UpdateJurisprudenceDto,
} from '@/lib/types/jurisprudence.types';

export const useJurisprudences = (query: QueryJurisprudenceDto = {}) => {
  return useQuery({
    queryKey: ['jurisprudences', query],
    queryFn: () => jurisprudenceApi.getJurisprudences(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useJurisprudence = (id: string) => {
  return useQuery({
    queryKey: ['jurisprudence', id],
    queryFn: () => jurisprudenceApi.getJurisprudence(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateJurisprudence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateJurisprudenceDto) => jurisprudenceApi.createJurisprudence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jurisprudences'] });
    },
  });
};

export const useUpdateJurisprudence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJurisprudenceDto }) => 
      jurisprudenceApi.updateJurisprudence(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jurisprudences'] });
      queryClient.invalidateQueries({ queryKey: ['jurisprudence', id] });
    },
  });
};

export const useDeleteJurisprudence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => jurisprudenceApi.deleteJurisprudence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jurisprudences'] });
    },
  });
};

export const useSearchJurisprudences = () => {
  return useMutation({
    mutationFn: ({ query, limit }: { query: string; limit?: number }) => 
      jurisprudenceApi.searchJurisprudences(query, limit),
  });
};

export const useJurisprudencesSimilaires = (id: string, limit?: number) => {
  return useQuery({
    queryKey: ['jurisprudences-similaires', id, limit],
    queryFn: () => jurisprudenceApi.getJurisprudencesSimilaires(id, limit),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJurisprudencesRecommandees = (dossierId: string, limit?: number) => {
  return useQuery({
    queryKey: ['jurisprudences-recommandees', dossierId, limit],
    queryFn: () => jurisprudenceApi.getJurisprudencesRecommandees(dossierId, limit),
    enabled: !!dossierId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJurisprudencesByDossier = (dossierId: string, query: QueryJurisprudenceDto = {}) => {
  return useQuery({
    queryKey: ['jurisprudences-dossier', dossierId, query],
    queryFn: () => jurisprudenceApi.getJurisprudencesByDossier(dossierId, query),
    enabled: !!dossierId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useJurisprudenceStats = () => {
  return useQuery({
    queryKey: ['jurisprudence-stats'],
    queryFn: () => jurisprudenceApi.getJurisprudenceStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};