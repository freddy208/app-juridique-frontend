/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/commentaires/useMyCommentairesStats.ts

import { useState, useEffect } from 'react';
import { CommentaireStatsResponse } from '@/lib/types/commentaires.types';
import { commentairesApi } from '@/lib/api/commentaires.api';

export const useMyCommentairesStats = (autoFetch: boolean = true) => {
  const [stats, setStats] = useState<CommentaireStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await commentairesApi.getMyCommentairesStats();
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};