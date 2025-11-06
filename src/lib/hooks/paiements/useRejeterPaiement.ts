/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import  apiClient  from '@/lib/api/client';
import { paiementsEndpoints } from '@/lib/api/endpoints';
import { Paiement } from '@/lib/types/paiements.types';

export const useRejeterPaiement = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const rejeterPaiement = async (id: string, motif: string): Promise<Paiement | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await apiClient.patch(paiementsEndpoints.rejeter(id), { motif });
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du rejet du paiement');
      console.error('Erreur lors du rejet du paiement:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    isLoading,
    error,
    success,
    rejeterPaiement,
    reset,
  };
};