/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useEvenement.ts
import { useState, useEffect } from 'react';
import { Evenement } from '../../types/evenement';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseEvenementReturn {
  evenement: Evenement | null;
  loading: boolean;
  error: string | null;
  fetchEvenement: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useEvenement = (id?: string): UseEvenementReturn => {
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | undefined>(id);

  const fetchEvenement = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<Evenement>(
        evenementsEndpoints.getById(eventId)
      );
      
      setEvenement(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération de l\'événement');
      console.error('Erreur lors de la récupération de l\'événement:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    if (currentId) {
      await fetchEvenement(currentId);
    }
  };

  useEffect(() => {
    if (currentId) {
      fetchEvenement(currentId);
    }
  }, [currentId]);

  return {
    evenement,
    loading,
    error,
    fetchEvenement: (eventId: string) => {
      setCurrentId(eventId);
      return fetchEvenement(eventId);
    },
    refetch,
  };
};