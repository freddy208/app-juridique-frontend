/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/messagerie/useReactions.ts

import { useState } from 'react';
import apiClient from '../../api/client';  // Correction ici
import { CreateReactionDto, Message } from '@/lib/types/messagerie.types';

export const useReactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ajouter une réaction à un message
  const addReaction = async (messageId: string, data: CreateReactionDto): Promise<Message | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/messagerie/messages/${messageId}/reactions`, data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de la réaction');
      console.error('Erreur lors de l\'ajout de la réaction:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Retirer une réaction d'un message
  const removeReaction = async (messageId: string): Promise<Message | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.delete(`/messagerie/messages/${messageId}/reactions`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du retrait de la réaction');
      console.error('Erreur lors du retrait de la réaction:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Effacer l'erreur
  const clearError = () => setError(null);

  return {
    loading,
    error,
    addReaction,
    removeReaction,
    clearError,
  };
};