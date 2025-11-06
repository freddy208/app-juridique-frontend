/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/documents/useDocumentsManager.ts

import { useState, useCallback } from 'react';
import { 
  useDocuments, 
  useUploadDocument, 
  useUpdateDocument, 
  useDeleteDocument,
  useDocumentStats,
  useSearchDocumentsByOCR,
  useDocumentVersions,
  useDownloadDocument,
  useDocument
} from './useDocuments';
import { QueryDocumentsParams, CreateDocumentRequest, UpdateDocumentRequest } from '@/lib/types/documents.types';

export const useDocumentsManager = (initialParams: QueryDocumentsParams = {}) => {
  // État pour les filtres et la pagination
  const [filters, setFilters] = useState<QueryDocumentsParams>(initialParams);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  // Hooks pour les opérations CRUD
  const {
    documents,
    pagination,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
    updateParams,
  } = useDocuments(filters);
  
  const {
    document: selectedDocument,
    isLoading: isLoadingDocument,
    error: documentError,
    refetch: refetchDocument,
  } = useDocument(selectedDocumentId || '');
  
  const {
    uploadDocument,
    isLoading: isUploading,
    error: uploadError,
    uploadProgress,
  } = useUploadDocument();
  
  const {
    updateDocument,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateDocument();
  
  const {
    deleteDocument,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteDocument();
  
  const {
    stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useDocumentStats();
  
  const {
    results: ocrResults,
    isLoading: isSearchingOCR,
    error: ocrSearchError,
    search: searchByOCR,
    query: ocrQuery,
    dossierId: ocrDossierId,
  } = useSearchDocumentsByOCR();
  
  const {
    versions,
    isLoading: isLoadingVersions,
    error: versionsError,
    refetch: refetchVersions,
  } = useDocumentVersions(selectedDocumentId || '');
  
  const {
    downloadDocument,
    isDownloading,
    error: downloadError,
  } = useDownloadDocument();
  
  // Fonctions pour gérer les filtres
  const updateFilters = useCallback((newFilters: Partial<QueryDocumentsParams>) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    updateParams(newFilters);
  }, [updateParams]);
  
  const resetFilters = useCallback(() => {
    const defaultFilters: QueryDocumentsParams = {
      page: 1,
      limit: 10,
      sortBy: 'creeLe',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    updateParams(defaultFilters);
  }, [updateParams]);
  
  // Fonctions pour gérer la sélection de documents
  const selectDocument = useCallback((id: string) => {
    setSelectedDocumentId(id);
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedDocumentId(null);
  }, []);
  
  // Fonctions pour les opérations CRUD
  const handleUploadDocument = useCallback(async (
    data: CreateDocumentRequest,
    onProgress?: (progress: any) => void
  ) => {
    try {
      const result = await uploadDocument(data, onProgress);
      await refetchDocuments();
      await refetchStats();
      return result;
    } catch (error) {
      console.error('Erreur lors du téléversement du document:', error);
      throw error;
    }
  }, [uploadDocument, refetchDocuments, refetchStats]);
  
  const handleUpdateDocument = useCallback(async (id: string, data: UpdateDocumentRequest) => {
    try {
      const result = await updateDocument(id, data);
      if (id === selectedDocumentId) {
        await refetchDocument();
      }
      await refetchDocuments();
      await refetchStats();
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      throw error;
    }
  }, [updateDocument, selectedDocumentId, refetchDocument, refetchDocuments, refetchStats]);
  
  const handleDeleteDocument = useCallback(async (id: string) => {
    try {
      await deleteDocument(id);
      if (id === selectedDocumentId) {
        clearSelection();
      }
      await refetchDocuments();
      await refetchStats();
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      throw error;
    }
  }, [deleteDocument, selectedDocumentId, clearSelection, refetchDocuments, refetchStats]);
  
  const handleDownloadDocument = useCallback(async (id: string, filename?: string) => {
    try {
      await downloadDocument(id, filename);
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      throw error;
    }
  }, [downloadDocument]);
  
  const handleSearchByOCR = useCallback((query: string, dossierId?: string) => {
    searchByOCR(query, dossierId);
  }, [searchByOCR]);
  
  // État de chargement global
  const isLoading = isLoadingDocuments || isLoadingDocument || isUploading || 
    isUpdating || isDeleting || isLoadingStats || isSearchingOCR || 
    isLoadingVersions || isDownloading;
  
  // Erreurs globales
  const errors = {
    documents: documentsError,
    document: documentError,
    upload: uploadError,
    update: updateError,
    delete: deleteError,
    stats: statsError,
    ocrSearch: ocrSearchError,
    versions: versionsError,
    download: downloadError,
  };
  
  return {
    // Données
    documents,
    selectedDocument,
    pagination,
    stats,
    ocrResults,
    versions,
    filters,
    uploadProgress,
    ocrQuery,
    ocrDossierId,
    
    // États de chargement
    isLoading,
    isLoadingDocuments,
    isLoadingDocument,
    isUploading,
    isUpdating,
    isDeleting,
    isLoadingStats,
    isSearchingOCR,
    isLoadingVersions,
    isDownloading,
    
    // Erreurs
    errors,
    
    // Actions
    updateFilters,
    resetFilters,
    selectDocument,
    clearSelection,
    handleUploadDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    handleSearchByOCR,
    refetchDocuments,
    refetchDocument,
    refetchStats,
    refetchVersions,
  };
};