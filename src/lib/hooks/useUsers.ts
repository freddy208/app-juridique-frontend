/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/hooks/useUsers.tsx - VERSION AVEC LOGS DÉTAILLÉS POUR DEBUG
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
      try {
        console.log('🚀 [useUsers] Démarrage de la requête avec params:', params);
        
        const response = await apiClient.get(
          usersEndpoints.getAll,
          { params }
        );
        
        // ✅ LOGS DÉTAILLÉS POUR DEBUG
        console.group('📦 [useUsers] Réponse complète du backend');
        console.log('1️⃣ Response object:', response);
        console.log('2️⃣ Response.data:', response.data);
        console.log('3️⃣ Type de response.data:', typeof response.data);
        console.log('4️⃣ response.data est un Array?', Array.isArray(response.data));
        console.log('5️⃣ response.data.data existe?', 'data' in (response.data || {}));
        console.log('6️⃣ response.data.data:', response.data?.data);
        console.log('7️⃣ response.data.data est un Array?', Array.isArray(response.data?.data));
        console.log('8️⃣ Nombre d\'utilisateurs dans data.data:', response.data?.data?.length);
        console.log('9️⃣ Premier utilisateur:', response.data?.data?.[0]);
        console.log('🔟 response.data.total:', response.data?.total);
        console.log('1️⃣1️⃣ response.data.page:', response.data?.page);
        console.log('1️⃣2️⃣ response.data.limit:', response.data?.limit);
        console.log('1️⃣3️⃣ response.data.totalPages:', response.data?.totalPages);
        console.log('1️⃣4️⃣ Structure complète:', JSON.stringify(response.data, null, 2));
        console.groupEnd();

        // ✅ Vérifier quelle structure nous avons
        let normalizedData: PaginatedResponse<User>;

        if (Array.isArray(response.data)) {
          // Cas 1: La réponse est directement un tableau
          console.warn('⚠️ [useUsers] La réponse est un tableau direct (structure inattendue)');
          normalizedData = {
            data: response.data,
            total: response.data.length,
            page: params.page || 1,
            limit: params.limit || 10,
            totalPages: Math.ceil(response.data.length / (params.limit || 10)),
          };
        } else if (response.data && 'data' in response.data) {
          // Cas 2: Structure attendue { data: User[], total, page, limit, totalPages }
          console.log('✅ [useUsers] Structure correcte avec data.data');
          normalizedData = response.data;
        } else if (response.data && 'users' in response.data) {
          // Cas 3: Structure alternative { users: User[], total, page, limit, totalPages }
          console.log('⚠️ [useUsers] Structure alternative avec "users"');
          normalizedData = {
            data: (response.data as any).users,
            total: response.data.total || (response.data as any).users.length,
            page: response.data.page || params.page || 1,
            limit: response.data.limit || params.limit || 10,
            totalPages: response.data.totalPages || 1,
          };
        } else {
          // Cas 4: Structure inconnue
          console.error('❌ [useUsers] Structure de réponse inconnue:', response.data);
          normalizedData = {
            data: [],
            total: 0,
            page: params.page || 1,
            limit: params.limit || 10,
            totalPages: 0,
          };
        }

        console.log('📋 [useUsers] Données normalisées finales:', {
          nombreUtilisateurs: normalizedData.data.length,
          total: normalizedData.total,
          page: normalizedData.page,
          limit: normalizedData.limit,
          totalPages: normalizedData.totalPages,
          premierUtilisateur: normalizedData.data[0],
        });

        return normalizedData;
      } catch (err) {
        console.error('💥 [useUsers] Erreur lors de la requête:', err);
        throw err;
      }
    },
    staleTime: 30000, // 30 secondes
    gcTime: 300000, // 5 minutes (anciennement cacheTime)
  });

  const createMutation = useMutation({
    mutationFn: async (userData: CreateUserForm) => {
      console.log('📝 [useUsers] Création utilisateur:', userData);
      const response = await apiClient.post<User>(
        usersEndpoints.create,
        userData
      );
      console.log('✅ [useUsers] Utilisateur créé:', response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      console.error('❌ [useUsers] Erreur création:', error);
      const message = error.response?.data?.message || 
        'Erreur lors de la création de l\'utilisateur';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UpdateUserForm }) => {
      console.log('✏️ [useUsers] Mise à jour utilisateur:', { id, userData });
      const response = await apiClient.patch<User>(
        usersEndpoints.update(id),
        userData
      );
      console.log('✅ [useUsers] Utilisateur mis à jour:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.setQueryData<User>(userKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      console.error('❌ [useUsers] Erreur mise à jour:', error);
      const message = error.response?.data?.message || 
        'Erreur lors de la mise à jour de l\'utilisateur';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ [useUsers] Suppression utilisateur:', id);
      const response = await apiClient.delete(usersEndpoints.delete(id));
      console.log('✅ [useUsers] Utilisateur supprimé:', response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      console.error('❌ [useUsers] Erreur suppression:', error);
      const message = error.response?.data?.message || 
        'Erreur lors de la suppression de l\'utilisateur';
      toast.error(message);
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, statusData }: { id: string; statusData: ChangeStatusForm }) => {
      console.log('🔄 [useUsers] Changement statut:', { id, statusData });
      const response = await apiClient.patch<User>(
        usersEndpoints.changeStatus(id),
        statusData
      );
      console.log('✅ [useUsers] Statut modifié:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Statut de l\'utilisateur modifié avec succès');
      queryClient.setQueryData<User>(userKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      console.error('❌ [useUsers] Erreur changement statut:', error);
      const message = error.response?.data?.message || 
        'Erreur lors de la modification du statut';
      toast.error(message);
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (bulkData: BulkActionForm) => {
      console.log('📦 [useUsers] Action en masse:', bulkData);
      const response = await apiClient.post(
        usersEndpoints.bulkAction,
        bulkData
      );
      console.log('✅ [useUsers] Action en masse effectuée:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      console.error('❌ [useUsers] Erreur action en masse:', error);
      const message = error.response?.data?.message || 
        'Erreur lors de l\'action en masse';
      toast.error(message);
    },
  });

  // ✅ LOGS pour le retour du hook
  console.log('🎯 [useUsers] État du hook:', {
    isLoading,
    hasError: !!error,
    error,
    hasData: !!usersData,
    usersDataStructure: usersData ? Object.keys(usersData) : null,
    nombreUtilisateurs: Array.isArray(usersData?.data) ? usersData.data.length : 0,
  });

  return {
    // ✅ CORRECTION CRITIQUE : Protection robuste contre les erreurs .map
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

// Autres hooks avec logs
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
      console.log('👤 [useUser] Récupération utilisateur:', id);
      const response = await apiClient.get<User>(usersEndpoints.getById(id!));
      console.log('✅ [useUser] Utilisateur récupéré:', response.data);
      return response.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (userData: UpdateUserForm) => {
      console.log('✏️ [useUser] Mise à jour:', { id, userData });
      const response = await apiClient.patch<User>(
        usersEndpoints.update(id!),
        userData
      );
      console.log('✅ [useUser] Utilisateur mis à jour:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.setQueryData<User>(userKeys.detail(id!), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      console.error('❌ [useUser] Erreur mise à jour:', error);
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
      console.log('👤 [useUserProfile] Récupération profil');
      const response = await apiClient.get<User>(usersEndpoints.getMyProfile);
      console.log('✅ [useUserProfile] Profil récupéré:', response.data);
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateUserForm) => {
      console.log('✏️ [useUserProfile] Mise à jour profil:', profileData);
      const response = await apiClient.patch<User>(
        usersEndpoints.updateMyProfile,
        profileData
      );
      console.log('✅ [useUserProfile] Profil mis à jour:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Profil mis à jour avec succès');
      queryClient.setQueryData<User>(['userProfile'], data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
    onError: (error: any) => {
      console.error('❌ [useUserProfile] Erreur:', error);
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
      console.log('📊 [useUserStats] Récupération stats');
      const response = await apiClient.get(usersEndpoints.stats);
      console.log('✅ [useUserStats] Stats récupérées:', response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserPerformance() {
  return useQuery({
    queryKey: userKeys.performance(),
    queryFn: async () => {
      console.log('📈 [useUserPerformance] Récupération performances');
      const response = await apiClient.get(usersEndpoints.performance);
      console.log('✅ [useUserPerformance] Performances récupérées:', response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserRoles() {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: async () => {
      console.log('🎭 [useUserRoles] Récupération rôles');
      const response = await apiClient.get(usersEndpoints.roles);
      console.log('✅ [useUserRoles] Rôles récupérés:', response.data);
      return response.data;
    },
    staleTime: Infinity,
  });
}

export function useUserStatuses() {
  return useQuery({
    queryKey: userKeys.statuses(),
    queryFn: async () => {
      console.log('🎨 [useUserStatuses] Récupération statuts');
      const response = await apiClient.get(usersEndpoints.statuses);
      console.log('✅ [useUserStatuses] Statuts récupérés:', response.data);
      return response.data;
    },
    staleTime: Infinity,
  });
}

export function useUserSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: async () => {
      console.log('🔍 [useUserSearch] Recherche:', { query, limit });
      const response = await apiClient.get(usersEndpoints.search, {
        params: { q: query, limit },
      });
      console.log('✅ [useUserSearch] Résultats:', response.data);
      return response.data;
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
      console.log('📝 [useUserForm] Chargement utilisateur existant:', userId);
      const response = await apiClient.get<User>(
        usersEndpoints.getById(userId!)
      );
      console.log('✅ [useUserForm] Utilisateur chargé:', response.data);
      return response.data;
    },
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: async (userData: CreateUserForm | UpdateUserForm) => {
      console.log(`${isEditMode ? '✏️' : '📝'} [useUserForm] ${isEditMode ? 'Mise à jour' : 'Création'}:`, userData);
      
      if (isEditMode) {
        const response = await apiClient.patch<User>(
          usersEndpoints.update(userId),
          userData
        );
        console.log('✅ [useUserForm] Utilisateur mis à jour:', response.data);
        return response.data;
      } else {
        const response = await apiClient.post<User>(
          usersEndpoints.create,
          userData as CreateUserForm
        );
        console.log('✅ [useUserForm] Utilisateur créé:', response.data);
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
    onError: (error: any) => {
      console.error('❌ [useUserForm] Erreur:', error);
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