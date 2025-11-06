// src/lib/api/correspondances.api.ts

import apiClient from "./client";
import { correspondancesEndpoints } from "./endpoints/correspondances.endpoints";
import {
  Correspondance,
  CorrespondanceStats,
  CreateCorrespondanceDto,
  UpdateCorrespondanceDto,
  QueryCorrespondanceDto,
  PaginationResult,
} from "../types/correspondance.types";

export const correspondancesApi = {
  // Récupérer toutes les correspondances avec filtres
  getCorrespondances: async (query: QueryCorrespondanceDto = {}): Promise<PaginationResult<Correspondance>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${correspondancesEndpoints.getAll}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer une correspondance par son ID
  getCorrespondance: async (id: string): Promise<Correspondance> => {
    const response = await apiClient.get(correspondancesEndpoints.getById(id));
    return response.data;
  },
  
  // Créer une nouvelle correspondance
  createCorrespondance: async (correspondanceData: CreateCorrespondanceDto): Promise<Correspondance> => {
    const response = await apiClient.post(correspondancesEndpoints.create, correspondanceData);
    return response.data;
  },
  
  // Mettre à jour une correspondance
  updateCorrespondance: async (id: string, correspondanceData: UpdateCorrespondanceDto): Promise<Correspondance> => {
    const response = await apiClient.patch(correspondancesEndpoints.update(id), correspondanceData);
    return response.data;
  },
  
  // Supprimer une correspondance
  deleteCorrespondance: async (id: string): Promise<void> => {
    await apiClient.delete(correspondancesEndpoints.delete(id));
  },
  
  // Rechercher des correspondances
  searchCorrespondances: async (searchTerm: string, query: QueryCorrespondanceDto = {}): Promise<PaginationResult<Correspondance>> => {
    const params = new URLSearchParams();
    params.append('q', searchTerm);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${correspondancesEndpoints.search}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les statistiques des correspondances
  getCorrespondancesStats: async (utilisateurId?: string): Promise<CorrespondanceStats> => {
    const endpoint = utilisateurId 
      ? `${correspondancesEndpoints.getStats}?utilisateurId=${utilisateurId}`
      : correspondancesEndpoints.getStats;
    const response = await apiClient.get(endpoint);
    return response.data;
  },
  
  // Récupérer les correspondances d'un client
  getCorrespondancesByClient: async (clientId: string, query: QueryCorrespondanceDto = {}): Promise<PaginationResult<Correspondance>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${correspondancesEndpoints.getByClient(clientId)}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les correspondances d'un utilisateur
  getCorrespondancesByUtilisateur: async (utilisateurId: string, query: QueryCorrespondanceDto = {}): Promise<PaginationResult<Correspondance>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${correspondancesEndpoints.getByUtilisateur(utilisateurId)}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les correspondances de l'utilisateur connecté
  getMyCorrespondances: async (query: QueryCorrespondanceDto = {}): Promise<PaginationResult<Correspondance>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${correspondancesEndpoints.getMyCorrespondances}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les statistiques des correspondances de l'utilisateur connecté
  getMyCorrespondancesStats: async (): Promise<CorrespondanceStats> => {
    const response = await apiClient.get(correspondancesEndpoints.getMyStats);
    return response.data;
  },
};