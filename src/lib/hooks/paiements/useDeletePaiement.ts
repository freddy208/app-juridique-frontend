/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import  apiClient  from '@/lib/api/client';
import { paiementsEndpoints } from '@/lib/api/endpoints';

export const useDeletePaiement = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deletePaiement = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await apiClient.delete(paiementsEndpoints.delete(id));
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du paiement');
      console.error('Erreur lors de la suppression du paiement:', err);
      return false;
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
    deletePaiement,
    reset,
  };
};