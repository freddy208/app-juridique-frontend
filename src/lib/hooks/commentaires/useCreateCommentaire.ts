// src/hooks/commentaires/useCreateCommentaire.ts

import { useState } from 'react';
import { CreateCommentaireDto, CommentaireResponse } from '@/lib/types/commentaires.types';
import { commentairesApi } from '@/lib/api/commentaires.api';

export const useCreateCommentaire = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createCommentaire = async (commentaireData: CreateCommentaireDto): Promise<CommentaireResponse | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await commentairesApi.createCommentaire(commentaireData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCommentaire,
    isLoading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};