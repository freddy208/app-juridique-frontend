/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useEvenementsStats.ts
import { useState, useEffect } from 'react';
import { EvenementStats } from '../../types/evenement';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseEvenementsStatsReturn {
  stats: EvenementStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEvenementsStats = (utilisateurId?: string): UseEvenementsStatsReturn => {
  const [stats, setStats] = useState<EvenementStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = utilisateurId 
        ? evenementsEndpoints.getMyStats 
        : evenementsEndpoints.getStats;
      
      const response = await apiClient.get<EvenementStats>(endpoint);
      
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des statistiques');
      console.error('Erreur lors de la récupération des statistiques:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, [utilisateurId]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};