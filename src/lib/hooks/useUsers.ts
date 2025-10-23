
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api/client';
import { 
  UserFilters, 
  CreateUserForm, 
  UpdateUserForm, 
  UpdateProfileForm,
  ChangePasswordForm,
  BulkActionForm,
  PaginationParams,
} from '@/lib/types/user.types';

export function useUsers(params: PaginationParams & UserFilters = {}) {
  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', params],
    queryFn: () => 
      apiClient.get('/users', { params }).then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (userData: CreateUserForm) => 
      apiClient.post('/users', userData),
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserForm }) => 
      apiClient.patch(`/users/${id}`, userData),
    onSuccess: () => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    },
  });

  const changeStatusMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, statusData }: { id: string; statusData: any }) => 
      apiClient.patch(`/users/${id}/status`, statusData),
    onSuccess: () => {
      toast.success('Statut de l\'utilisateur modifié avec succès');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification du statut');
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: (bulkData: BulkActionForm) => 
      apiClient.post('/users/bulk-action', bulkData),
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'action en masse');
    },
  });

  return {
    users: usersData?.data || [],
    pagination: usersData ? {
      total: usersData.total,
      page: usersData.page,
      limit: usersData.limit,
      totalPages: usersData.totalPages,
    } : { total: 0, page: 1, limit: 10, totalPages: 0 },
    isLoading,
    error,
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    changeStatus: changeStatusMutation.mutate,
    bulkAction: bulkActionMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: changeStatusMutation.isPending,
    isBulkActioning: bulkActionMutation.isPending,
  };
}

export function useUser(id: string) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => 
      apiClient.get(`/users/${id}`).then(res => res.data),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (userData: UpdateUserForm) => 
      apiClient.patch(`/users/${id}`, userData),
    onSuccess: () => {
      toast.success('Utilisateur mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateMutation.mutate,
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
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => 
      apiClient.get('/users/profile').then(res => res.data),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileForm) => 
      apiClient.patch('/users/profile', profileData),
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: ChangePasswordForm) => 
      apiClient.post('/auth/change-password', passwordData),
    onSuccess: () => {
      toast.success('Mot de passe changé avec succès');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}

export function useUserStats() {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => 
      apiClient.get('/users/stats').then(res => res.data),
  });
}

export function useUserPerformance() {
  return useQuery({
    queryKey: ['userPerformance'],
    queryFn: () => 
      apiClient.get('/users/performance').then(res => res.data),
  });
}

export function useUserRoles() {
  return useQuery({
    queryKey: ['userRoles'],
    queryFn: () => 
      apiClient.get('/users/roles').then(res => res.data),
  });
}

export function useUserStatuses() {
  return useQuery({
    queryKey: ['userStatuses'],
    queryFn: () => 
      apiClient.get('/users/statuses').then(res => res.data),
  });
}

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['userSearch', query],
    queryFn: () => 
      apiClient.get('/users/search', { params: { q: query } }).then(res => res.data),
    enabled: !!query && query.length > 2,
  });
}