// src/hooks/api/useClientDocuments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { clientsEndpoints } from '@/lib/api/endpoints';
import {
  DocumentIdentite,
  CreateDocumentIdentiteDto,
} from './../../types/client.types';

// Récupérer les documents d'identité d'un client
export const useClientDocuments = (clientId: string, enabled = true) => {
  const {
    data: documents,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clientDocuments', clientId],
    queryFn: async () => {
      const { data } = await apiClient.get<DocumentIdentite[]>(
        clientsEndpoints.getDocumentsIdentite(clientId)
      );
      return data;
    },
    enabled: enabled && !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    documents,
    isLoading,
    error,
    refetch,
  };
};

// Téléverser un document d'identité
export const useUploadDocumentIdentite = () => {
  const queryClient = useQueryClient();

  const uploadDocumentMutation = useMutation({
    mutationFn: async ({
      clientId,
      file,
      documentData,
    }: {
      clientId: string;
      file: File;
      documentData: CreateDocumentIdentiteDto;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', documentData.type);
      formData.append('titre', documentData.titre);
      
      if (documentData.numero) formData.append('numero', documentData.numero);
      if (documentData.dateDelivrance) 
        formData.append('dateDelivrance', documentData.dateDelivrance.toISOString());
      if (documentData.dateExpiration) 
        formData.append('dateExpiration', documentData.dateExpiration.toISOString());
      if (documentData.lieuDelivrance) 
        formData.append('lieuDelivrance', documentData.lieuDelivrance);

      const { data } = await apiClient.post<DocumentIdentite>(
        clientsEndpoints.uploadDocumentIdentite(clientId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data;
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clientDocuments', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
    },
  });

  return {
    uploadDocument: uploadDocumentMutation.mutateAsync,
    isUploading: uploadDocumentMutation.isPending,
    error: uploadDocumentMutation.error,
  };
};

// Supprimer un document d'identité
export const useDeleteDocumentIdentite = () => {
  const queryClient = useQueryClient();

  const deleteDocumentMutation = useMutation({
    mutationFn: async ({
      clientId,
      documentId,
    }: {
      clientId: string;
      documentId: string;
    }) => {
      await apiClient.delete(
        clientsEndpoints.deleteDocumentIdentite(clientId, documentId)
      );
      return { clientId, documentId };
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clientDocuments', clientId] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
    },
  });

  return {
    deleteDocument: deleteDocumentMutation.mutateAsync,
    isDeleting: deleteDocumentMutation.isPending,
    error: deleteDocumentMutation.error,
  };
};