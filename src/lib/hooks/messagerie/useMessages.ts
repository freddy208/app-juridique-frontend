/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/messagerie/useMessages.ts

import { useState, useEffect } from 'react';
import apiClient from '../../api/client';  // Correction ici
import { 
  Message, 
  CreateMessageDto, 
  UpdateMessageDto, 
  QueryMessagesDto,
  PaginationResult, 
  StatutMessage
} from '@/lib/types/messagerie.types';

export const useMessages = (discussionId?: string, initialQuery: QueryMessagesDto = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [query, setQuery] = useState<QueryMessagesDto>({
    page: 1,
    limit: 20,
    sortBy: 'creeLe',
    sortOrder: 'asc',
    discussionId,
    ...initialQuery,
  });

  // Récupérer la liste des messages
  const fetchMessages = async (newQuery?: QueryMessagesDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const finalQuery = newQuery || query;
      const params = new URLSearchParams();
      
      Object.entries(finalQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`/messagerie/messages?${params.toString()}`);
      const result: PaginationResult<Message> = response.data;
      
      // Si on récupère les messages d'une discussion spécifique, on remplace la liste
      // Sinon, on ajoute à la liste existante
      if (finalQuery.discussionId) {
        setMessages(result.data.reverse()); // Inverser pour afficher les plus récents en bas
      } else {
        setMessages(result.data);
      }
      
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
      
      if (newQuery) {
        setQuery(finalQuery);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des messages');
      console.error('Erreur lors de la récupération des messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un message par son ID
  const getMessage = async (id: string): Promise<Message | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/messagerie/messages/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération du message');
      console.error('Erreur lors de la récupération du message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau message
  const createMessage = async (data: CreateMessageDto): Promise<Message | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/messagerie/messages', data);
      const newMessage = response.data;
      
      // Ajouter le nouveau message à la liste
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du message');
      console.error('Erreur lors de la création du message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un message
  const updateMessage = async (id: string, data: UpdateMessageDto): Promise<Message | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.patch(`/messagerie/messages/${id}`, data);
      const updatedMessage = response.data;
      
      // Mettre à jour le message dans la liste
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? updatedMessage : message
        )
      );
      
      return updatedMessage;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du message');
      console.error('Erreur lors de la mise à jour du message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un message
  const deleteMessage = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await apiClient.delete(`/messagerie/messages/${id}`);
      
      // Supprimer le message de la liste
      setMessages(prev => prev.filter(message => message.id !== id));
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du message');
      console.error('Erreur lors de la suppression du message:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les messages d'une discussion
  const getMessagesByDiscussion = async (discussionId: string, newQuery?: QueryMessagesDto): Promise<PaginationResult<Message> | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const finalQuery = { ...query, discussionId, ...newQuery };
      const params = new URLSearchParams();
      
      Object.entries(finalQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`/messagerie/discussions/discussion/${discussionId}/messages?${params.toString()}`);
      const result: PaginationResult<Message> = response.data;
      
      // Inverser pour afficher les plus récents en bas
      result.data.reverse();
      
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des messages de la discussion');
      console.error('Erreur lors de la récupération des messages de la discussion:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Marquer un message comme lu
  const markMessageAsRead = async (id: string): Promise<boolean> => {
    try {
      await updateMessage(id, { statut: StatutMessage.LU  });
      return true;
    } catch (err) {
      console.error('Erreur lors du marquage du message comme lu:', err);
      return false;
    }
  };

  // Effacer l'erreur
  const clearError = () => setError(null);

  // Charger les messages au montage du composant si discussionId est fourni
  useEffect(() => {
    if (discussionId) {
      fetchMessages({ discussionId });
    }
  }, [discussionId]);

  return {
    messages,
    loading,
    error,
    pagination,
    query,
    fetchMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage,
    getMessagesByDiscussion,
    markMessageAsRead,
    setQuery,
    clearError,
  };
};