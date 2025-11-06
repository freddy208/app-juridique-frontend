// src/lib/api/commentaires.api.ts

import apiClient from './client';
import { 
  CommentaireResponse, 
  CommentaireStatsResponse, 
  CreateCommentaireDto, 
  UpdateCommentaireDto, 
  QueryCommentairesDto,
  PaginationResult 
} from '@/lib/types/commentaires.types';
import { commentairesEndpoints } from './endpoints';

export const commentairesApi = {
  // Récupérer tous les commentaires avec filtres
  getCommentaires: async (query: QueryCommentairesDto = {}): Promise<PaginationResult<CommentaireResponse>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${commentairesEndpoints.getAll}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer un commentaire par son ID
  getCommentaire: async (id: string): Promise<CommentaireResponse> => {
    const response = await apiClient.get(commentairesEndpoints.getById(id));
    return response.data;
  },
  
  // Créer un nouveau commentaire
  createCommentaire: async (commentaireData: CreateCommentaireDto): Promise<CommentaireResponse> => {
    const response = await apiClient.post(commentairesEndpoints.create, commentaireData);
    return response.data;
  },
  
  // Mettre à jour un commentaire
  updateCommentaire: async (id: string, commentaireData: UpdateCommentaireDto): Promise<CommentaireResponse> => {
    const response = await apiClient.patch(commentairesEndpoints.update(id), commentaireData);
    return response.data;
  },
  
  // Supprimer un commentaire
  deleteCommentaire: async (id: string): Promise<void> => {
    await apiClient.delete(commentairesEndpoints.delete(id));
  },
  
  // Rechercher des commentaires
  searchCommentaires: async (searchTerm: string, query: QueryCommentairesDto = {}): Promise<PaginationResult<CommentaireResponse>> => {
    const params = new URLSearchParams();
    params.append('q', searchTerm);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${commentairesEndpoints.search}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les statistiques des commentaires
  getCommentairesStats: async (utilisateurId?: string): Promise<CommentaireStatsResponse> => {
    const endpoint = utilisateurId 
      ? `${commentairesEndpoints.getStats}?utilisateurId=${utilisateurId}`
      : commentairesEndpoints.getStats;
    const response = await apiClient.get(endpoint);
    return response.data;
  },
  
  // Récupérer les commentaires d'un document
  getCommentairesByDocument: async (documentId: string, query: QueryCommentairesDto = {}): Promise<PaginationResult<CommentaireResponse>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${commentairesEndpoints.getByDocument(documentId)}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les commentaires d'une tâche
  getCommentairesByTache: async (tacheId: string, query: QueryCommentairesDto = {}): Promise<PaginationResult<CommentaireResponse>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${commentairesEndpoints.getByTache(tacheId)}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les commentaires d'un utilisateur
  getCommentairesByUtilisateur: async (utilisateurId: string, query: QueryCommentairesDto = {}): Promise<PaginationResult<CommentaireResponse>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${commentairesEndpoints.getByUtilisateur(utilisateurId)}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les commentaires de l'utilisateur connecté
  getMyCommentaires: async (query: QueryCommentairesDto = {}): Promise<PaginationResult<CommentaireResponse>> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${commentairesEndpoints.getMyCommentaires}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les statistiques des commentaires de l'utilisateur connecté
  getMyCommentairesStats: async (): Promise<CommentaireStatsResponse> => {
    const response = await apiClient.get(commentairesEndpoints.getMyStats);
    return response.data;
  },
};

export default commentairesApi;