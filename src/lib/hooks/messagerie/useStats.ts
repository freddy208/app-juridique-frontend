/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/messagerie/useStats.ts

import { useState, useEffect } from 'react';
import apiClient from '../../api/client';  // Correction ici
import { MessagerieStats } from '@/lib/types/messagerie.types';

export const useMessagerieStats = (utilisateurId?: string) => {
  const [stats, setStats] = useState<MessagerieStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les statistiques de la messagerie
  const fetchStats = async (id?: string): Promise<MessagerieStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = id || utilisateurId;
      const endpoint = userId 
        ? `/messagerie/stats?utilisateurId=${userId}`
        : '/messagerie/stats';
      
      const response = await apiClient.get(endpoint);
      const statsData = response.data;
      
      setStats(statsData);
      return statsData;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des statistiques');
      console.error('Erreur lors de la récupération des statistiques:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Effacer l'erreur
  const clearError = () => setError(null);

  // Charger les statistiques au montage du composant
  useEffect(() => {
    fetchStats();
  }, [utilisateurId]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    clearError,
  };
};