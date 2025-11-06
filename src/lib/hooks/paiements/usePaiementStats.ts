/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import  apiClient  from '@/lib/api/client';
import { paiementsEndpoints } from '@/lib/api/endpoints';
import { PaiementStats } from '@/lib/types/paiements.types';

export const usePaiementStats = () => {
  const [stats, setStats] = useState<PaiementStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(paiementsEndpoints.stats);
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des statistiques');
      console.error('Erreur lors de la récupération des statistiques:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};