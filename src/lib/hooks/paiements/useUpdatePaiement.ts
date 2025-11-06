/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import  apiClient  from '@/lib/api/client';
import { paiementsEndpoints } from '@/lib/api/endpoints';
import { UpdatePaiementDto, Paiement } from '@/lib/types/paiements.types';

export const useUpdatePaiement = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updatePaiement = async (id: string, paiementData: UpdatePaiementDto): Promise<Paiement | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await apiClient.patch(paiementsEndpoints.update(id), paiementData);
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du paiement');
      console.error('Erreur lors de la mise à jour du paiement:', err);
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
    updatePaiement,
    reset,
  };
};