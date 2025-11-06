/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/documents/useDocuments.ts

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api/documents.api';
import {
  Document,
  DocumentsResponse,
  DocumentStats,
  QueryDocumentsParams,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  UploadProgress,
} from '@/lib/types/documents.types';

// Hook pour récupérer la liste des documents
export const useDocuments = (params: QueryDocumentsParams = {}) => {
  const [queryParams, setQueryParams] = useState<QueryDocumentsParams>(params);
  
  const {
    data: documentsData,
    isLoading,
    error,
    refetch,
  } = useQuery<DocumentsResponse>({
    queryKey: ['documents', queryParams],
    queryFn: () => documentsApi.getDocuments(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateParams = useCallback((newParams: Partial<QueryDocumentsParams>) => {
    setQueryParams((prev: any) => ({ ...prev, ...newParams }));
  }, []);

  return {
    documents: documentsData?.data || [],
    pagination: documentsData?.pagination,
    isLoading,
    error,
    refetch,
    updateParams,
    queryParams,
  };
};

// Hook pour récupérer un document spécifique
export const useDocument = (id: string) => {
  const {
    data: document,
    isLoading,
    error,
    refetch,
  } = useQuery<Document>({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getDocument(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    document,
    isLoading,
    error,
    refetch,
  };
};

// Hook pour téléverser un document
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const mutation = useMutation({
    mutationFn: ({ data, onProgress }: { 
      data: CreateDocumentRequest; 
      onProgress?: (progress: UploadProgress) => void;
    }) => documentsApi.uploadDocument(data, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setUploadProgress(null);
    },
    onError: (error) => {
      console.error('Erreur lors du téléversement du document:', error);
      setUploadProgress(null);
    },
  });

  const uploadDocument = useCallback((
    data: CreateDocumentRequest,
    onProgress?: (progress: UploadProgress) => void
  ) => {
    if (onProgress) {
      setUploadProgress({ loaded: 0, total: 100, percentage: 0 });
    }
    
    return mutation.mutateAsync({
      data,
      onProgress: (progress) => {
        setUploadProgress(progress);
        if (onProgress) onProgress(progress);
      },
    });
  }, [mutation]);

  return {
    uploadDocument,
    isLoading: mutation.isPending,
    error: mutation.error,
    uploadProgress,
  };
};

// Hook pour mettre à jour un document
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequest }) =>
      documentsApi.updateDocument(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', id] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du document:', error);
    },
  });

  const updateDocument = useCallback((id: string, data: UpdateDocumentRequest) => {
    return mutation.mutateAsync({ id, data });
  }, [mutation]);

  return {
    updateDocument,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

// Hook pour supprimer un document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du document:', error);
    },
  });

  const deleteDocument = useCallback((id: string) => {
    return mutation.mutateAsync(id);
  }, [mutation]);

  return {
    deleteDocument,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

// Hook pour récupérer les statistiques des documents
export const useDocumentStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<DocumentStats>({
    queryKey: ['documentStats'],
    queryFn: () => documentsApi.getDocumentStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};

// Hook pour rechercher des documents par OCR
export const useSearchDocumentsByOCR = () => {
  const [query, setQuery] = useState('');
  const [dossierId, setDossierId] = useState<string | undefined>(undefined);

  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useQuery<Document[]>({
    queryKey: ['documentsOCR', query, dossierId],
    queryFn: () => documentsApi.searchDocumentsByOCR(query, dossierId),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const search = useCallback((newQuery: string, newDossierId?: string) => {
    setQuery(newQuery);
    setDossierId(newDossierId);
  }, []);

  return {
    results,
    isLoading,
    error,
    refetch,
    search,
    query,
    dossierId,
  };
};

// Hook pour récupérer les versions d'un document
export const useDocumentVersions = (id: string) => {
  const {
    data: versions,
    isLoading,
    error,
    refetch,
  } = useQuery<Document[]>({
    queryKey: ['documentVersions', id],
    queryFn: () => documentsApi.getDocumentVersions(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    versions,
    isLoading,
    error,
    refetch,
  };
};

// Hook pour télécharger un document
export const useDownloadDocument = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadDocument = useCallback(async (id: string, filename?: string) => {
    try {
      setIsDownloading(true);
      setError(null);
      
      const blob = await documentsApi.downloadDocument(id);
      
      // Créer un URL temporaire pour le téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Utiliser le nom de fichier fourni ou un nom par défaut
      link.setAttribute('download', filename || `document-${id}`);
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors du téléchargement du document:', err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    downloadDocument,
    isDownloading,
    error,
  };
};