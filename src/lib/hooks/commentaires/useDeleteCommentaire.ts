// src/hooks/commentaires/useDeleteCommentaire.ts

import { useState } from 'react';
import { commentairesApi } from '@/lib/api/commentaires.api';

export const useDeleteCommentaire = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteCommentaire = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await commentairesApi.deleteCommentaire(id);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteCommentaire,
    isLoading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};