/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Hooks React Query pour le module Tâches
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTaches,
  getTacheById,
  createTache,
  updateTache,
  deleteTache,
  searchTaches,
  getTacheStats,
  getTachesEnRetard,
  getTachesAEcheanceProche,
  changerStatutTache,
  assignerTache,
  getTachesByDossier,
  getTachesByAssignee,
  getTachesByCreateur,
  getMyTaches,
  getMyTachesEnRetard,
  getMyTacheStats,
} from "../api/tache"
import { CreateTacheDto, UpdateTacheDto, StatutTache, UseTachesOptions, UseTacheOptions, UseTacheStatsOptions } from "../types/tache.types"

// Hooks pour les tâches
export const useTaches = (options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["taches", queryOptions],
    queryFn: () => getTaches(queryOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTache = ({ id, enabled = true }: UseTacheOptions) => {
  return useQuery({
    queryKey: ["tache", id],
    queryFn: () => getTacheById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useTacheStats = ({ utilisateurId, enabled = true }: UseTacheStatsOptions = {}) => {
  return useQuery({
    queryKey: ["tacheStats", utilisateurId],
    queryFn: () => getTacheStats(utilisateurId),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTachesEnRetard = (options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["tachesEnRetard", queryOptions],
    queryFn: () => getTachesEnRetard(queryOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTachesAEcheanceProche = (jours: number = 3, options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["tachesAEcheanceProche", jours, queryOptions],
    queryFn: () => getTachesAEcheanceProche(jours, queryOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTachesByDossier = (dossierId: string, options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["tachesByDossier", dossierId, queryOptions],
    queryFn: () => getTachesByDossier(dossierId, queryOptions),
    enabled: enabled && !!dossierId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTachesByAssignee = (assigneeId: string, options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["tachesByAssignee", assigneeId, queryOptions],
    queryFn: () => getTachesByAssignee(assigneeId, queryOptions),
    enabled: enabled && !!assigneeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useTachesByCreateur = (creeParId: string, options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["tachesByCreateur", creeParId, queryOptions],
    queryFn: () => getTachesByCreateur(creeParId, queryOptions),
    enabled: enabled && !!creeParId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hooks pour l'utilisateur connecté
export const useMyTaches = (options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["myTaches", queryOptions],
    queryFn: () => getMyTaches(queryOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMyTachesEnRetard = (options: UseTachesOptions = {}) => {
  const { enabled = true, ...queryOptions } = options
  
  return useQuery({
    queryKey: ["myTachesEnRetard", queryOptions],
    queryFn: () => getMyTachesEnRetard(queryOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMyTacheStats = (enabled = true) => {
  return useQuery({
    queryKey: ["myTacheStats"],
    queryFn: () => getMyTacheStats(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutations
export const useCreateTache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTacheDto) => createTache(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taches"] })
      queryClient.invalidateQueries({ queryKey: ["tacheStats"] })
      queryClient.invalidateQueries({ queryKey: ["myTaches"] })
      queryClient.invalidateQueries({ queryKey: ["myTacheStats"] })
    },
  })
}

export const useUpdateTache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTacheDto }) => updateTache(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taches"] })
      queryClient.invalidateQueries({ queryKey: ["tache", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tacheStats"] })
      queryClient.invalidateQueries({ queryKey: ["myTaches"] })
      queryClient.invalidateQueries({ queryKey: ["myTacheStats"] })
    },
  })
}

export const useDeleteTache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteTache(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taches"] })
      queryClient.invalidateQueries({ queryKey: ["tacheStats"] })
      queryClient.invalidateQueries({ queryKey: ["myTaches"] })
      queryClient.invalidateQueries({ queryKey: ["myTacheStats"] })
    },
  })
}

export const useChangerStatutTache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: StatutTache }) => changerStatutTache(id, statut),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taches"] })
      queryClient.invalidateQueries({ queryKey: ["tache", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tacheStats"] })
      queryClient.invalidateQueries({ queryKey: ["myTaches"] })
      queryClient.invalidateQueries({ queryKey: ["myTacheStats"] })
    },
  })
}

export const useAssignerTache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) => assignerTache(id, assigneeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taches"] })
      queryClient.invalidateQueries({ queryKey: ["tache", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tacheStats"] })
      queryClient.invalidateQueries({ queryKey: ["myTaches"] })
      queryClient.invalidateQueries({ queryKey: ["myTacheStats"] })
    },
  })
}

export const useSearchTaches = () => {
  return useMutation({
    mutationFn: ({ searchTerm, queryOptions }: { searchTerm: string; queryOptions?: any }) => 
      searchTaches(searchTerm, queryOptions),
  })
}