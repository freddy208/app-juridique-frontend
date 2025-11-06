/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/correspondances/useMyCorrespondancesStats.ts
import { useState, useEffect, useCallback } from 'react';
import { CorrespondanceStats } from '../../types/correspondance.types';
import { correspondancesApi } from '../../api/correspondances.api';
import { useToast } from '../use-toast';

export const useMyCorrespondancesStats = (autoFetch = true) => {
  const [stats, setStats] = useState<CorrespondanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await correspondancesApi.getMyCorrespondancesStats();
      setStats(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération de vos statistiques';
      setError(errorMessage);
      showToast({ 
        title: 'Erreur', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};