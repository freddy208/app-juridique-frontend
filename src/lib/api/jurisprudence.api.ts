// src/lib/api/jurisprudence.api.ts

import  apiClient  from './client';
import {
  Jurisprudence,
  DossierJurisprudence,
  JurisprudenceStats,
  CreateJurisprudenceDto,
  UpdateJurisprudenceDto,
  CreateDossierJurisprudenceDto,
  UpdateDossierJurisprudenceDto,
  QueryJurisprudenceDto,
  PaginatedResponse
} from '../types/jurisprudence.types';

export const jurisprudenceApi = {
  // Gestion des jurisprudences
  getJurisprudences: async (query: QueryJurisprudenceDto = {}): Promise<PaginatedResponse<Jurisprudence>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    const response = await apiClient.get(`/jurisprudence?${params.toString()}`);
    return response.data;
  },
  
  getJurisprudence: async (id: string): Promise<Jurisprudence> => {
    const response = await apiClient.get(`/jurisprudence/${id}`);
    return response.data;
  },
  
  createJurisprudence: async (data: CreateJurisprudenceDto): Promise<Jurisprudence> => {
    const response = await apiClient.post('/jurisprudence', data);
    return response.data;
  },
  
  updateJurisprudence: async (id: string, data: UpdateJurisprudenceDto): Promise<Jurisprudence> => {
    const response = await apiClient.patch(`/jurisprudence/${id}`, data);
    return response.data;
  },
  
  deleteJurisprudence: async (id: string): Promise<void> => {
    await apiClient.delete(`/jurisprudence/${id}`);
  },
  
  // Gestion des associations dossier-jurisprudence
  getDossiersJurisprudences: async (dossierId?: string, jurisprudenceId?: string): Promise<DossierJurisprudence[]> => {
    const params = new URLSearchParams();
    if (dossierId) params.append('dossierId', dossierId);
    if (jurisprudenceId) params.append('jurisprudenceId', jurisprudenceId);
    
    const response = await apiClient.get(`/jurisprudence/dossiers?${params.toString()}`);
    return response.data;
  },
  
  getDossierJurisprudence: async (id: string): Promise<DossierJurisprudence> => {
    const response = await apiClient.get(`/jurisprudence/dossiers/${id}`);
    return response.data;
  },
  
  createDossierJurisprudence: async (data: CreateDossierJurisprudenceDto): Promise<DossierJurisprudence> => {
    const response = await apiClient.post('/jurisprudence/dossiers', data);
    return response.data;
  },
  
  updateDossierJurisprudence: async (id: string, data: UpdateDossierJurisprudenceDto): Promise<DossierJurisprudence> => {
    const response = await apiClient.patch(`/jurisprudence/dossiers/${id}`, data);
    return response.data;
  },
  
  deleteDossierJurisprudence: async (id: string): Promise<void> => {
    await apiClient.delete(`/jurisprudence/dossiers/${id}`);
  },
  
  // Recherche et recommandations
  searchJurisprudences: async (query: string, limit?: number): Promise<Jurisprudence[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    
    const response = await apiClient.get(`/jurisprudence/search/${query}?${params.toString()}`);
    return response.data;
  },
  
  getJurisprudencesSimilaires: async (id: string, limit?: number): Promise<Jurisprudence[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    
    const response = await apiClient.get(`/jurisprudence/${id}/similaires?${params.toString()}`);
    return response.data;
  },
  
  getJurisprudencesRecommandees: async (dossierId: string, limit?: number): Promise<Jurisprudence[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    
    const response = await apiClient.get(`/jurisprudence/dossiers/${dossierId}/recommandees?${params.toString()}`);
    return response.data;
  },
  
  // Statistiques
  getJurisprudenceStats: async (): Promise<JurisprudenceStats> => {
    const response = await apiClient.get('/jurisprudence/stats');
    return response.data;
  },
  
  // Endpoints spécifiques
  getJurisprudencesByDossier: async (dossierId: string, query: QueryJurisprudenceDto = {}): Promise<PaginatedResponse<Jurisprudence>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    const response = await apiClient.get(`/jurisprudence/dossier/${dossierId}?${params.toString()}`);
    return response.data;
  },
};