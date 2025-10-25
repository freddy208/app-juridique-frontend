/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/hooks/useUsers.tsx - VERSION CORRIGÉE POUR DOUBLE ENVELOPPE
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api/client';
import { usersEndpoints } from '@/lib/api/endpoints';
import type {
  User,
  UserFilters,
  CreateUserForm,
  UpdateUserForm,
  ChangeStatusForm,
  BulkActionForm,
  PaginationParams,
  PaginatedResponse,
} from '@/lib/types/user.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: PaginationParams & UserFilters) => 
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  performance: () => [...userKeys.all, 'performance'] as const,
  roles: () => [...userKeys.all, 'roles'] as const,
  statuses: () => [...userKeys.all, 'statuses'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
};

export function useUsers(params: PaginationParams & UserFilters = {}) {
  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<User>>({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get(
        usersEndpoints.getAll,
        { params }
      );
      
      console.log('🔍 Structure reçue:', response.data);
      
      // ✅ CORRECTION : Votre backend enveloppe dans { statusCode, message, data, timestamp, path }
      // Donc les vraies données sont dans response.data.data
      
      let actualData = response.data;
      
      // Si c'est enveloppé dans { statusCode, message, data }
      if (actualData && 'statusCode' in actualData && 'data' in actualData) {
        console.log('✅ Détection enveloppe NestJS, extraction de response.data.data');
        actualData = actualData.data;
      }
      
      // Maintenant actualData contient { data: User[], total, page, limit, totalPages }
      console.log('📦 Données extraites:', actualData);
      console.log('👥 Utilisateurs:', actualData.data);
      console.log('📊 Total:', actualData.total);
      
      return actualData;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (userData: CreateUserForm) => {
      const response = await apiClient.post<any>(
        usersEndpoints.create,
        userData
      );
      // Extraire de l'enveloppe si nécessaire
      return response.data?.data || response.data;
    },
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la création de l\'utilisateur';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UpdateUserForm }) => {
      const response = await apiClient.patch<any>(
        usersEndpoints.update(id),
        userData
      );
      return response.data?.data || response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.setQueryData<User>(userKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la mise à jour de l\'utilisateur';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(usersEndpoints.delete(id));
      return response.data?.data || response.data;
    },
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la suppression de l\'utilisateur';
      toast.error(message);
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, statusData }: { id: string; statusData: ChangeStatusForm }) => {
      const response = await apiClient.patch<any>(
        usersEndpoints.changeStatus(id),
        statusData
      );
      return response.data?.data || response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Statut de l\'utilisateur modifié avec succès');
      queryClient.setQueryData<User>(userKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la modification du statut';
      toast.error(message);
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (bulkData: BulkActionForm) => {
      const response = await apiClient.post(
        usersEndpoints.bulkAction,
        bulkData
      );
      return response.data?.data || response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Action effectuée avec succès');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de l\'action en masse';
      toast.error(message);
    },
  });

  return {
    // ✅ Protection robuste
    users: Array.isArray(usersData?.data) ? usersData.data : [],
    pagination: usersData ? {
      total: usersData.total || 0,
      page: usersData.page || 1,
      limit: usersData.limit || 10,
      totalPages: usersData.totalPages || 0,
    } : { 
      total: 0, 
      page: 1, 
      limit: 10, 
      totalPages: 0 
    },
    
    isLoading,
    error,
    
    refetch,
    createUser: createMutation.mutate,
    createUserAsync: createMutation.mutateAsync,
    updateUser: updateMutation.mutate,
    updateUserAsync: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutate,
    deleteUserAsync: deleteMutation.mutateAsync,
    changeStatus: changeStatusMutation.mutate,
    changeStatusAsync: changeStatusMutation.mutateAsync,
    bulkAction: bulkActionMutation.mutate,
    bulkActionAsync: bulkActionMutation.mutateAsync,
    
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: changeStatusMutation.isPending,
    isBulkActioning: bulkActionMutation.isPending,
  };
}

export function useUser(id: string | undefined) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: userKeys.detail(id!),
    queryFn: async () => {
      const response = await apiClient.get<any>(usersEndpoints.getById(id!));
      return response.data?.data || response.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (userData: UpdateUserForm) => {
      const response = await apiClient.patch<any>(
        usersEndpoints.update(id!),
        userData
      );
      return response.data?.data || response.data;
    },
    onSuccess: (data) => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.setQueryData<User>(userKeys.detail(id!), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la mise à jour de l\'utilisateur';
      toast.error(message);
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateMutation.mutate,
    updateUserAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useUserProfile() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiClient.get<any>(usersEndpoints.getMyProfile);
      return response.data?.data || response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateUserForm) => {
      const response = await apiClient.patch<any>(
        usersEndpoints.updateMyProfile,
        profileData
      );
      return response.data?.data || response.data;
    },
    onSuccess: (data) => {
      toast.success('Profil mis à jour avec succès');
      queryClient.setQueryData<User>(['userProfile'], data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la mise à jour du profil';
      toast.error(message);
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}

export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.stats);
      return response.data?.data || response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserPerformance() {
  return useQuery({
    queryKey: userKeys.performance(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.performance);
      return response.data?.data || response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserRoles() {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.roles);
      return response.data?.data || response.data;
    },
    staleTime: Infinity,
  });
}

export function useUserStatuses() {
  return useQuery({
    queryKey: userKeys.statuses(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.statuses);
      return response.data?.data || response.data;
    },
    staleTime: Infinity,
  });
}

export function useUserSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.search, {
        params: { q: query, limit },
      });
      return response.data?.data || response.data;
    },
    enabled: !!query && query.length >= 2,
    staleTime: 30 * 1000,
  });
}

export function useUserForm(
  userId?: string,
  onSuccess?: (user: User) => void
) {
  const queryClient = useQueryClient();
  const isEditMode = !!userId;

  const { data: existingUser } = useQuery<User>({
    queryKey: userKeys.detail(userId!),
    queryFn: async () => {
      const response = await apiClient.get<any>(
        usersEndpoints.getById(userId!)
      );
      return response.data?.data || response.data;
    },
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: async (userData: CreateUserForm | UpdateUserForm) => {
      if (isEditMode) {
        const response = await apiClient.patch<any>(
          usersEndpoints.update(userId),
          userData
        );
        return response.data?.data || response.data;
      } else {
        const response = await apiClient.post<any>(
          usersEndpoints.create,
          userData as CreateUserForm
        );
        return response.data?.data || response.data;
      }
    },
    onSuccess: (data) => {
      const message = isEditMode 
        ? 'Utilisateur mis à jour avec succès'
        : 'Utilisateur créé avec succès';
      toast.success(message);
      
      if (isEditMode) {
        queryClient.setQueryData<User>(userKeys.detail(userId!), data);
      }
      
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      
      onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        `Erreur lors de ${isEditMode ? 'la mise à jour' : 'la création'} de l'utilisateur`;
      toast.error(message);
    },
  });

  return {
    existingUser,
    isEditMode,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
}