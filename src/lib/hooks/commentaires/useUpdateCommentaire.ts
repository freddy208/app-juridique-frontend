// src/hooks/commentaires/useUpdateCommentaire.ts

import { useState } from 'react';
import { UpdateCommentaireDto, CommentaireResponse } from '@/lib/types/commentaires.types';
import { commentairesApi } from '@/lib/api/commentaires.api';

export const useUpdateCommentaire = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateCommentaire = async (id: string, commentaireData: UpdateCommentaireDto): Promise<CommentaireResponse | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await commentairesApi.updateCommentaire(id, commentaireData);
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
    updateCommentaire,
    isLoading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};