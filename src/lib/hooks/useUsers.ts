// src/lib/hooks/useUsers.tsx
'use client';

/**
 * ============================================
 * HOOK: useUsers
 * ============================================
 * Gestion complète des utilisateurs avec React Query
 * - Liste avec pagination et filtres
 * - CRUD complet
 * - Actions en masse
 * - Gestion optimiste des mises à jour
 */

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

// ============================================
// QUERY KEYS
// ============================================

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

// ============================================
// HOOK: useUsers (Liste avec pagination)
// ============================================

export function useUsers(params: PaginationParams & UserFilters = {}) {
  const queryClient = useQueryClient();

  // Requête pour la liste des utilisateurs
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<User>>({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<User>>(
        usersEndpoints.getAll,
        { params }
      );
      return response.data;
    },
  });

  // Mutation: Créer un utilisateur
  const createMutation = useMutation({
    mutationFn: async (userData: CreateUserForm) => {
      const response = await apiClient.post<User>(
        usersEndpoints.create,
        userData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      // Invalider les requêtes concernées
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la création de l\'utilisateur';
      toast.error(message);
    },
  });

  // Mutation: Mettre à jour un utilisateur
  const updateMutation = useMutation({
    mutationFn: async ({ 
      id, 
      userData 
    }: { 
      id: string; 
      userData: UpdateUserForm 
    }) => {
      const response = await apiClient.patch<User>(
        usersEndpoints.update(id),
        userData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Utilisateur mis à jour avec succès');
      // Mise à jour optimiste
      queryClient.setQueryData<User>(
        userKeys.detail(variables.id),
        data
      );
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la mise à jour de l\'utilisateur';
      toast.error(message);
    },
  });

  // Mutation: Supprimer un utilisateur
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(usersEndpoints.delete(id));
      return response.data;
    },
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la suppression de l\'utilisateur';
      toast.error(message);
    },
  });

  // Mutation: Changer le statut
  const changeStatusMutation = useMutation({
    mutationFn: async ({ 
      id, 
      statusData 
    }: { 
      id: string; 
      statusData: ChangeStatusForm 
    }) => {
      const response = await apiClient.patch<User>(
        usersEndpoints.changeStatus(id),
        statusData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Statut de l\'utilisateur modifié avec succès');
      // Mise à jour optimiste
      queryClient.setQueryData<User>(
        userKeys.detail(variables.id),
        data
      );
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de la modification du statut';
      toast.error(message);
    },
  });

  // Mutation: Action en masse
  const bulkActionMutation = useMutation({
    mutationFn: async (bulkData: BulkActionForm) => {
      const response = await apiClient.post(
        usersEndpoints.bulkAction,
        bulkData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 
        'Erreur lors de l\'action en masse';
      toast.error(message);
    },
  });

  return {
    // Données
    users: usersData?.data || [],
    pagination: usersData ? {
      total: usersData.total,
      page: usersData.page,
      limit: usersData.limit,
      totalPages: usersData.totalPages,
    } : { 
      total: 0, 
      page: 1, 
      limit: 10, 
      totalPages: 0 
    },
    
    // États de chargement
    isLoading,
    error,
    
    // Actions
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
    
    // États des mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: changeStatusMutation.isPending,
    isBulkActioning: bulkActionMutation.isPending,
  };
}

// ============================================
// HOOK: useUser (Détail d'un utilisateur)
// ============================================

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
      const response = await apiClient.get<User>(
        usersEndpoints.getById(id!)
      );
      return response.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (userData: UpdateUserForm) => {
      const response = await apiClient.patch<User>(
        usersEndpoints.update(id!),
        userData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.setQueryData<User>(userKeys.detail(id!), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// ============================================
// HOOK: useUserProfile (Profil connecté)
// ============================================

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
      const response = await apiClient.get<User>(
        usersEndpoints.getMyProfile // ✅ CORRECTION: /users/me
      );
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateUserForm) => {
      const response = await apiClient.patch<User>(
        usersEndpoints.updateMyProfile, // ✅ CORRECTION: /users/me
        profileData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Profil mis à jour avec succès');
      queryClient.setQueryData<User>(['userProfile'], data);
      // Aussi mettre à jour dans authContext si nécessaire
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// ============================================
// HOOK: useUserStats
// ============================================

export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.stats);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  });
}

// ============================================
// HOOK: useUserPerformance
// ============================================

export function useUserPerformance() {
  return useQuery({
    queryKey: userKeys.performance(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.performance);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  });
}

// ============================================
// HOOK: useUserRoles
// ============================================

export function useUserRoles() {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.roles);
      return response.data;
    },
    staleTime: Infinity, // Ces données changent rarement
  });
}

// ============================================
// HOOK: useUserStatuses
// ============================================

export function useUserStatuses() {
  return useQuery({
    queryKey: userKeys.statuses(),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.statuses);
      return response.data;
    },
    staleTime: Infinity, // Ces données changent rarement
  });
}

// ============================================
// HOOK: useUserSearch
// ============================================

export function useUserSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: async () => {
      const response = await apiClient.get(usersEndpoints.search, {
        params: { q: query, limit },
      });
      return response.data;
    },
    enabled: !!query && query.length >= 2,
    staleTime: 30 * 1000, // Cache 30 secondes
  });
}

// ============================================
// HOOK: useUserForm (Gestion de formulaire)
// ============================================

export function useUserForm(
  userId?: string,
  onSuccess?: (user: User) => void
) {
  const queryClient = useQueryClient();
  const isEditMode = !!userId;

  // Charger l'utilisateur si en mode édition
  const { data: existingUser } = useQuery<User>({
    queryKey: userKeys.detail(userId!),
    queryFn: async () => {
      const response = await apiClient.get<User>(
        usersEndpoints.getById(userId!)
      );
      return response.data;
    },
    enabled: isEditMode,
  });

  // Mutation unifiée
  const mutation = useMutation({
    mutationFn: async (userData: CreateUserForm | UpdateUserForm) => {
      if (isEditMode) {
        const response = await apiClient.patch<User>(
          usersEndpoints.update(userId),
          userData
        );
        return response.data;
      } else {
        const response = await apiClient.post<User>(
          usersEndpoints.create,
          userData as CreateUserForm
        );
        return response.data;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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