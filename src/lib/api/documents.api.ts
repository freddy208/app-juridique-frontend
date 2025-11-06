// src/lib/api/documents.api.ts

import apiClient from './client';
import { documentsEndpoints } from './endpoints';
import {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  QueryDocumentsParams,
  Document,
  DocumentsResponse,
  DocumentStats,
  UploadProgress,
} from '@/lib/types/documents.types';

export const documentsApi = {
  // Récupérer tous les documents avec filtres
  getDocuments: async (params: QueryDocumentsParams = {}): Promise<DocumentsResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`${documentsEndpoints.getAll}?${searchParams.toString()}`);
    return response.data;
  },
  
  // Récupérer un document par son ID
  getDocument: async (id: string): Promise<Document> => {
    const response = await apiClient.get(documentsEndpoints.getById(id));
    return response.data;
  },
  
  // Téléverser un nouveau document
  uploadDocument: async (
    data: CreateDocumentRequest,
    onUploadProgress?: (progress: UploadProgress) => void
  ): Promise<Document> => {
    const formData = new FormData();
    
    // Ajouter les champs du formulaire
    formData.append('dossierId', data.dossierId);
    formData.append('titre', data.titre);
    formData.append('type', data.type);
    
    if (data.taille) formData.append('taille', String(data.taille));
    if (data.extension) formData.append('extension', data.extension);
    if (data.statut) formData.append('statut', data.statut);
    if (data.file) formData.append('file', data.file);
    
    const response = await apiClient.post(documentsEndpoints.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });
    
    return response.data;
  },
  
  // Mettre à jour un document
  updateDocument: async (id: string, data: UpdateDocumentRequest): Promise<Document> => {
    const response = await apiClient.patch(documentsEndpoints.update(id), data);
    return response.data;
  },
  
  // Supprimer un document
  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(documentsEndpoints.delete(id));
  },
  
  // Récupérer les statistiques des documents
  getDocumentStats: async (): Promise<DocumentStats> => {
    const response = await apiClient.get(documentsEndpoints.getStats);
    return response.data;
  },
  
  // Rechercher des documents par contenu OCR
  searchDocumentsByOCR: async (query: string, dossierId?: string): Promise<Document[]> => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (dossierId) params.append('dossierId', dossierId);
    
    const response = await apiClient.get(`${documentsEndpoints.searchByOCR}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer toutes les versions d'un document
  getDocumentVersions: async (id: string): Promise<Document[]> => {
    const response = await apiClient.get(documentsEndpoints.getVersions(id));
    return response.data;
  },
  
  // Télécharger un document
  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`${documentsEndpoints.getById(id)}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};