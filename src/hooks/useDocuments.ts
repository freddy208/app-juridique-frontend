/**
 * Hook useDocuments
 * Gestion complète des documents avec upload Supabase
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, buildQueryString, PaginatedResponse } from '@/lib/api';
import type { Document, StatutDocument } from '@/types/document.types';

// Types pour les filtres
type DocumentFilters = {
  search?: string;
  dossierId?: string;
  type?: string;
  statut?: StatutDocument;
  skip?: number;
  take?: number;
};

// Types pour création/modification
type CreateDocumentDto = {
  titre: string;
  type: string;
  dossierId: string;
  url: string;
};

type UpdateDocumentDto = {
  titre?: string;
  type?: string;
};

// ============================================
// QUERIES (GET)
// ============================================

/**
 * Liste des documents avec filtres
 */
export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async (): Promise<PaginatedResponse<Document>> => {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/documents${queryString}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

/**
 * Détails d'un document
 */
export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: async (): Promise<Document> => {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
}

/**
 * Versions d'un document
 */
export function useDocumentVersions(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'versions'],
    queryFn: async () => {
      const response = await api.get(`/documents/${documentId}/versions`);
      return response.data;
    },
    enabled: !!documentId,
  });
}

/**
 * Commentaires d'un document
 */
export function useDocumentComments(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'comments'],
    queryFn: async () => {
      const response = await api.get(`/documents/${documentId}/comments`);
      return response.data;
    },
    enabled: !!documentId,
  });
}

// ============================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================

/**
 * Upload un document
 * Note: Le fichier doit d'abord être uploadé sur Supabase Storage
 * puis on enregistre les métadonnées en base
 */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDocumentDto): Promise<Document> => {
      const response = await api.post('/documents', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Modifier les métadonnées d'un document
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDocumentDto }): Promise<Document> => {
      const response = await api.put(`/documents/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Changer le statut d'un document
 */
export function useUpdateDocumentStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutDocument }): Promise<Document> => {
      const response = await api.patch(`/documents/${id}/status`, { statut });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Supprimer un document (soft delete)
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Ajouter une nouvelle version d'un document
 */
export function useAddDocumentVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, url }: { documentId: string; url: string }) => {
      const response = await api.post(`/documents/${documentId}/versions`, { url });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents', variables.documentId, 'versions'] });
    },
  });
}

/**
 * Ajouter un commentaire sur un document
 */
export function useAddDocumentComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, contenu }: { documentId: string; contenu: string }) => {
      const response = await api.post(`/documents/${documentId}/comments`, { contenu });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.documentId, 'comments'] });
    },
  });
}

/**
 * Modifier un commentaire
 */
export function useUpdateDocumentComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      documentId, 
      commentId, 
      contenu 
    }: { 
      documentId: string; 
      commentId: string; 
      contenu: string 
    }) => {
      const response = await api.patch(`/documents/${documentId}/comments/${commentId}`, { contenu });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.documentId, 'comments'] });
    },
  });
}

/**
 * Supprimer un commentaire
 */
export function useDeleteDocumentComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, commentId }: { documentId: string; commentId: string }) => {
      await api.delete(`/documents/${documentId}/comments/${commentId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.documentId, 'comments'] });
    },
  });
}

// hook pour upload de fichiers dans cloudinary
export function useUploadDossierDocuments() {
  return useMutation({
    mutationFn: async ({ dossierId, files }: { dossierId: string; files: File[] }) => {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const response = await api.post(`/dossiers/${dossierId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
}
