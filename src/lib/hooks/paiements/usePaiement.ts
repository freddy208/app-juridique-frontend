/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import  apiClient  from '@/lib/api/client';
import { paiementsEndpoints } from '@/lib/api/endpoints';
import { Paiement } from '@/lib/types/paiements.types';

export const usePaiement = (id: string) => {
  const [paiement, setPaiement] = useState<Paiement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaiement = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(paiementsEndpoints.getById(id));
      setPaiement(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération du paiement');
      console.error('Erreur lors de la récupération du paiement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiement();
  }, [id]);

  const refetch = () => {
    fetchPaiement();
  };

  return {
    paiement,
    isLoading,
    error,
    refetch,
  };
};