// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/api/users.service';
import type { User, CreateUserDto, UpdateUserDto } from '../services/api/users.service';

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des utilisateurs avec filtres
 */
export function useUsers(filters?: { role?: string; statut?: string }) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async (): Promise<User[]> => {
      return usersService.getUsers(filters);
    },
    staleTime: 30000,
  });
}

/**
 * Détails d'un utilisateur
 */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async (): Promise<User> => {
      if (!id) throw new Error('ID utilisateur requis');
      return usersService.getUserById(id);
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

/**
 * Liste des avocats
 */
export function useAvocats() {
  return useQuery({
    queryKey: ['avocats'],
    queryFn: async (): Promise<User[]> => usersService.getAvocats(),
    staleTime: 60000,
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Créer un utilisateur
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDto): Promise<User> => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Mettre à jour un utilisateur
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }): Promise<User> =>
      usersService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Changer le statut d'un utilisateur
 */
export function useChangeUserStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU' }): Promise<User> =>
      usersService.changeStatut(id, statut),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Réinitialiser le mot de passe d'un utilisateur
 */
export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => usersService.resetPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
