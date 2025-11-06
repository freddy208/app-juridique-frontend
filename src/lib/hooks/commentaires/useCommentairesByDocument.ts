/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/commentaires/useCommentairesByDocument.ts

import { useState, useEffect } from 'react';
import { CommentaireResponse, QueryCommentairesDto, PaginationResult } from '@/lib/types/commentaires.types';
import { commentairesApi } from '@/lib/api/commentaires.api';

interface UseCommentairesByDocumentOptions {
  initialQuery?: QueryCommentairesDto;
  autoFetch?: boolean;
}

export const useCommentairesByDocument = (
  documentId: string, 
  options: UseCommentairesByDocumentOptions = {}
) => {
  const { initialQuery = {}, autoFetch = true } = options;
  const [commentaires, setCommentaires] = useState<PaginationResult<CommentaireResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<QueryCommentairesDto>(initialQuery);

  const fetchCommentaires = async (newQuery?: QueryCommentairesDto) => {
    if (!documentId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await commentairesApi.getCommentairesByDocument(documentId, newQuery || query);
      setCommentaires(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuery = (newQuery: Partial<QueryCommentairesDto>) => {
    const updatedQuery = { ...query, ...newQuery };
    setQuery(updatedQuery);
    return updatedQuery;
  };

  useEffect(() => {
    if (autoFetch && documentId) {
      fetchCommentaires();
    }
  }, [documentId, query]);

  return {
    commentaires,
    isLoading,
    error,
    fetchCommentaires,
    updateQuery,
    refetch: () => fetchCommentaires(),
  };
};