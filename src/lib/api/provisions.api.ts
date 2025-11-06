/**
 * API client pour les provisions
 */

import  apiClient  from './client';
import {
  ProvisionResponse,
  ProvisionStatsResponse,
  CreateProvisionDto,
  UpdateProvisionDto,
  AjouterMouvementDto,
  QueryProvisionDto,
  PaginatedProvisionsResponse
} from '@/lib/types/provision.types';

export const provisionsApi = {
  // Récupérer toutes les provisions avec filtres
  getProvisions: async (query: QueryProvisionDto = {}): Promise<PaginatedProvisionsResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/provisions?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer une provision par son ID
  getProvision: async (id: string): Promise<ProvisionResponse> => {
    const response = await apiClient.get(`/provisions/${id}`);
    return response.data;
  },
  
  // Créer une nouvelle provision
  createProvision: async (provisionData: CreateProvisionDto): Promise<ProvisionResponse> => {
    const response = await apiClient.post('/provisions', provisionData);
    return response.data;
  },
  
  // Mettre à jour une provision
  updateProvision: async (id: string, provisionData: UpdateProvisionDto): Promise<ProvisionResponse> => {
    const response = await apiClient.patch(`/provisions/${id}`, provisionData);
    return response.data;
  },
  
  // Supprimer une provision
  deleteProvision: async (id: string): Promise<void> => {
    await apiClient.delete(`/provisions/${id}`);
  },
  
  // Ajouter un mouvement à une provision
  ajouterMouvement: async (id: string, mouvementData: AjouterMouvementDto): Promise<ProvisionResponse> => {
    const response = await apiClient.post(`/provisions/${id}/mouvements`, mouvementData);
    return response.data;
  },
  
  // Marquer une provision comme restituée
  restituerProvision: async (id: string): Promise<ProvisionResponse> => {
    const response = await apiClient.patch(`/provisions/${id}/restituer`);
    return response.data;
  },
  
  // Récupérer les statistiques des provisions
  getStats: async (): Promise<ProvisionStatsResponse> => {
    const response = await apiClient.get('/provisions/stats');
    return response.data;
  },
  
  // Récupérer les provisions épuisées
  getProvisionsEpuisees: async (query: QueryProvisionDto = {}): Promise<PaginatedProvisionsResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/provisions/epuisees?${params.toString()}`);
    return response.data;
  },
};