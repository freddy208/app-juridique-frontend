// src/hooks/useClientManagement.ts

import { useState } from 'react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../clients/useClients';
import { useClientDocuments, useUploadDocumentIdentite, useDeleteDocumentIdentite } from '../clients/useClientDocuments'
import { useClientStats } from '../clients/useClientStats';
import { QueryClientDto, CreateClientDto, UpdateClientDto, CreateDocumentIdentiteDto } from './../../types/client.types';
import { useClient } from './useClients';

export const useClientManagement = (initialQuery?: QueryClientDto) => {
  // État pour la gestion des clients
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  
  // Hooks pour les opérations CRUD
  const {
    clients,
    total,
    page,
    limit,
    totalPages,
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients,
    updateParams,
  } = useClients(initialQuery);
  
  const { client, isLoading: isLoadingClient, error: clientError } = useClient(
    selectedClientId || '',
    !!selectedClientId
  );
  
  const { createClient, isCreating, error: createError } = useCreateClient();
  const { updateClient, isUpdating, error: updateError } = useUpdateClient();
  const { deleteClient, isDeleting, error: deleteError } = useDeleteClient();
  
  // Hooks pour les documents
  const {
    documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useClientDocuments(selectedClientId || '', !!selectedClientId);
  
  const {
    uploadDocument,
    isUploading,
    error: uploadError,
  } = useUploadDocumentIdentite();
  
  const {
    deleteDocument,
    isDeleting: isDeletingDocument,
    error: deleteDocumentError,
  } = useDeleteDocumentIdentite();
  
  // Hook pour les statistiques
  const {
    stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useClientStats();
  
  // Fonctions de gestion
  const handleCreateClient = async (clientData: CreateClientDto) => {
    try {
      await createClient(clientData);
      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      return false;
    }
  };
  
  const handleUpdateClient = async (clientData: UpdateClientDto) => {
    if (!selectedClientId) return false;
    
    try {
      await updateClient({ id: selectedClientId, clientData });
      setIsEditModalOpen(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return false;
    }
  };
  
  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      if (selectedClientId === id) {
        setSelectedClientId(null);
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return false;
    }
  };
  
  const handleUploadDocument = async (
    file: File,
    documentData: CreateDocumentIdentiteDto
  ) => {
    if (!selectedClientId) return false;
    
    try {
      await uploadDocument({
        clientId: selectedClientId,
        file,
        documentData,
      });
      setIsDocumentModalOpen(false);
      return true;
    } catch (error) {
      console.error('Erreur lors du téléversement du document:', error);
      return false;
    }
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    if (!selectedClientId) return false;
    
    try {
      await deleteDocument({
        clientId: selectedClientId,
        documentId,
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      return false;
    }
  };
  
  const selectClient = (id: string) => {
    setSelectedClientId(id);
  };
  
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  
  const openEditModal = () => {
    if (selectedClientId) {
      setIsEditModalOpen(true);
    }
  };
  
  const openDocumentModal = () => {
    if (selectedClientId) {
      setIsDocumentModalOpen(true);
    }
  };
  
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDocumentModalOpen(false);
  };
  
  return {
    // État
    selectedClientId,
    isCreateModalOpen,
    isEditModalOpen,
    isDocumentModalOpen,
    
    // Données
    clients,
    client,
    documents,
    stats,
    total,
    page,
    limit,
    totalPages,
    
    // États de chargement
    isLoadingClients,
    isLoadingClient,
    isLoadingDocuments,
    isLoadingStats,
    isCreating,
    isUpdating,
    isDeleting,
    isUploading,
    isDeletingDocument,
    
    // Erreurs
    clientsError,
    clientError,
    documentsError,
    statsError,
    createError,
    updateError,
    deleteError,
    uploadError,
    deleteDocumentError,
    
    // Fonctions
    selectClient,
    openCreateModal,
    openEditModal,
    openDocumentModal,
    closeModals,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
    handleUploadDocument,
    handleDeleteDocument,
    refetchClients,
    refetchDocuments,
    updateParams,
  };
};