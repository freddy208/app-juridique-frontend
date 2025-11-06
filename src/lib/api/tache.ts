/**
 * API pour le module Tâches
 * Fonctions pour communiquer avec le backend
 */

import apiClient from "./client"
import { tachesEndpoints } from "./endpoints"
import {
  TacheResponse,
  TacheStatsResponse,
  CreateTacheDto,
  UpdateTacheDto,
  QueryTachesDto,
  StatutTache,
} from "../types/tache.types"

// CRUD de base
export const createTache = async (data: CreateTacheDto): Promise<TacheResponse> => {
  const response = await apiClient.post(tachesEndpoints.create, data)
  return response.data
}

export const getTaches = async (query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getAll, { params: query })
  return response.data
}

export const getTacheById = async (id: string): Promise<TacheResponse> => {
  const response = await apiClient.get(tachesEndpoints.getById(id))
  return response.data
}

export const updateTache = async (id: string, data: UpdateTacheDto): Promise<TacheResponse> => {
  const response = await apiClient.patch(tachesEndpoints.update(id), data)
  return response.data
}

export const deleteTache = async (id: string): Promise<void> => {
  await apiClient.delete(tachesEndpoints.delete(id))
}

// Actions spécifiques
export const searchTaches = async (searchTerm: string, query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.search, { params: { q: searchTerm, ...query } })
  return response.data
}

export const getTacheStats = async (utilisateurId?: string): Promise<TacheStatsResponse> => {
  const response = await apiClient.get(tachesEndpoints.getStats, { params: { utilisateurId } })
  return response.data
}

export const getTachesEnRetard = async (query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getEnRetard, { params: query })
  return response.data
}

export const getTachesAEcheanceProche = async (jours: number = 3, query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getEcheanceProche, { params: { jours, ...query } })
  return response.data
}

export const changerStatutTache = async (id: string, statut: StatutTache): Promise<TacheResponse> => {
  const response = await apiClient.patch(tachesEndpoints.changerStatut(id), { statut })
  return response.data
}

export const assignerTache = async (id: string, assigneeId: string): Promise<TacheResponse> => {
  const response = await apiClient.patch(tachesEndpoints.assigner(id), { assigneeId })
  return response.data
}

// Requêtes filtrées
export const getTachesByDossier = async (dossierId: string, query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getByDossier(dossierId), { params: query })
  return response.data
}

export const getTachesByAssignee = async (assigneeId: string, query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getByAssignee(assigneeId), { params: query })
  return response.data
}

export const getTachesByCreateur = async (creeParId: string, query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getByCreateur(creeParId), { params: query })
  return response.data
}

// Endpoints pour l'utilisateur connecté
export const getMyTaches = async (query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getMyTaches, { params: query })
  return response.data
}

export const getMyTachesEnRetard = async (query: QueryTachesDto = {}): Promise<{ data: TacheResponse[]; total: number; page: number; limit: number }> => {
  const response = await apiClient.get(tachesEndpoints.getMyTachesEnRetard, { params: query })
  return response.data
}

export const getMyTacheStats = async (): Promise<TacheStatsResponse> => {
  const response = await apiClient.get(tachesEndpoints.getMyStats)
  return response.data
}