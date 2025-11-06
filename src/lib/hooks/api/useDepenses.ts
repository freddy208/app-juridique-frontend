// src/hooks/api/useDepenses.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { depensesApi } from '@/lib/api/depenses.api';
import { 
  CreateDepenseDto, 
  UpdateDepenseDto, 
  QueryDepenseDto, 
} from '@/lib/types/depenses.types';

// Clés de requête pour React Query
export const depensesKeys = {
  all: ['depenses'] as const,
  lists: () => [...depensesKeys.all, 'list'] as const,
  list: (query: QueryDepenseDto) => [...depensesKeys.lists(), query] as const,
  details: () => [...depensesKeys.all, 'detail'] as const,
  detail: (id: string) => [...depensesKeys.details(), id] as const,
  stats: () => [...depensesKeys.all, 'stats'] as const,
  enAttente: (query: QueryDepenseDto) => [...depensesKeys.all, 'en-attente', query] as const,
  byDossier: (dossierId: string, query: QueryDepenseDto) => [...depensesKeys.all, 'dossier', dossierId, query] as const,
};

// Hook pour récupérer la liste des dépenses
export const useDepenses = (query: QueryDepenseDto = {}) => {
  return useQuery({
    queryKey: depensesKeys.list(query),
    queryFn: () => depensesApi.getDepenses(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer une dépense par son ID
export const useDepense = (id: string) => {
  return useQuery({
    queryKey: depensesKeys.detail(id),
    queryFn: () => depensesApi.getDepense(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour créer une dépense
export const useCreateDepense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDepenseDto) => depensesApi.createDepense(data),
    onSuccess: () => {
      // Invalider les requêtes liées aux dépenses
      queryClient.invalidateQueries({ queryKey: depensesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: depensesKeys.stats() });
    },
  });
};

// Hook pour mettre à jour une dépense
export const useUpdateDepense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepenseDto }) => 
      depensesApi.updateDepense(id, data),
    onSuccess: (_, { id }) => {
      // Invalider les requêtes liées à cette dépense
      queryClient.invalidateQueries({ queryKey: depensesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: depensesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: depensesKeys.stats() });
    },
  });
};

// Hook pour supprimer une dépense
export const useDeleteDepense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => depensesApi.deleteDepense(id),
    onSuccess: () => {
      // Invalider les requêtes liées aux dépenses
      queryClient.invalidateQueries({ queryKey: depensesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: depensesKeys.stats() });
    },
  });
};

// Hook pour valider une dépense
export const useValiderDepense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, valideParId }: { id: string; valideParId: string }) => 
      depensesApi.validerDepense(id, valideParId),
    onSuccess: (_, { id }) => {
      // Invalider les requêtes liées à cette dépense
      queryClient.invalidateQueries({ queryKey: depensesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: depensesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: depensesKeys.enAttente({}) });
      queryClient.invalidateQueries({ queryKey: depensesKeys.stats() });
    },
  });
};

// Hook pour rejeter une dépense
export const useRejeterDepense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, valideParId }: { id: string; valideParId: string }) => 
      depensesApi.rejeterDepense(id, valideParId),
    onSuccess: (_, { id }) => {
      // Invalider les requêtes liées à cette dépense
      queryClient.invalidateQueries({ queryKey: depensesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: depensesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: depensesKeys.enAttente({}) });
      queryClient.invalidateQueries({ queryKey: depensesKeys.stats() });
    },
  });
};

// Hook pour récupérer les statistiques des dépenses
export const useDepensesStats = () => {
  return useQuery({
    queryKey: depensesKeys.stats(),
    queryFn: () => depensesApi.getDepensesStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les dépenses en attente de validation
export const useDepensesEnAttente = (query: QueryDepenseDto = {}) => {
  return useQuery({
    queryKey: depensesKeys.enAttente(query),
    queryFn: () => depensesApi.getDepensesEnAttente(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer les dépenses d'un dossier
export const useDepensesByDossier = (dossierId: string, query: QueryDepenseDto = {}) => {
  return useQuery({
    queryKey: depensesKeys.byDossier(dossierId, query),
    queryFn: () => depensesApi.getDepensesByDossier(dossierId, query),
    enabled: !!dossierId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};