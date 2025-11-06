// src/lib/api/depenses.api.ts

import  apiClient  from './client';
import { 
  Depense, 
  CreateDepenseDto, 
  UpdateDepenseDto, 
  QueryDepenseDto, 
  DepensesStats,
  DepensesResponse 
} from '../types/depenses.types';

export const depensesApi = {
  // Récupérer toutes les dépenses avec filtres
  getDepenses: async (query: QueryDepenseDto = {}): Promise<DepensesResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/depenses?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer une dépense par son ID
  getDepense: async (id: string): Promise<Depense> => {
    const response = await apiClient.get(`/depenses/${id}`);
    return response.data;
  },
  
  // Créer une nouvelle dépense
  createDepense: async (depenseData: CreateDepenseDto): Promise<Depense> => {
    const response = await apiClient.post('/depenses', depenseData);
    return response.data;
  },
  
  // Mettre à jour une dépense
  updateDepense: async (id: string, depenseData: UpdateDepenseDto): Promise<Depense> => {
    const response = await apiClient.patch(`/depenses/${id}`, depenseData);
    return response.data;
  },
  
  // Supprimer une dépense
  deleteDepense: async (id: string): Promise<void> => {
    await apiClient.delete(`/depenses/${id}`);
  },
  
  // Valider une dépense
  validerDepense: async (id: string, valideParId: string): Promise<Depense> => {
    const response = await apiClient.patch(`/depenses/${id}/valider`, { valideParId });
    return response.data;
  },
  
  // Rejeter une dépense
  rejeterDepense: async (id: string, valideParId: string): Promise<Depense> => {
    const response = await apiClient.patch(`/depenses/${id}/rejeter`, { valideParId });
    return response.data;
  },
  
  // Récupérer les statistiques des dépenses
  getDepensesStats: async (): Promise<DepensesStats> => {
    const response = await apiClient.get('/depenses/stats');
    return response.data;
  },
  
  // Récupérer les dépenses en attente de validation
  getDepensesEnAttente: async (query: QueryDepenseDto = {}): Promise<DepensesResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/depenses/en-attente?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les dépenses d'un dossier
  getDepensesByDossier: async (dossierId: string, query: QueryDepenseDto = {}): Promise<DepensesResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/depenses/dossier/${dossierId}?${params.toString()}`);
    return response.data;
  },
};