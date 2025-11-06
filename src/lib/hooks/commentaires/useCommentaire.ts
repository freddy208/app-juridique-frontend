/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/commentaires/useCommentaire.ts

import { useState, useEffect } from 'react';
import { CommentaireResponse } from '@/lib/types/commentaires.types';
import { commentairesApi } from '@/lib/api/commentaires.api';

export const useCommentaire = (id: string) => {
  const [commentaire, setCommentaire] = useState<CommentaireResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommentaire = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await commentairesApi.getCommentaire(id);
      setCommentaire(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentaire();
  }, [id]);

  return {
    commentaire,
    isLoading,
    error,
    refetch: fetchCommentaire,
  };
};