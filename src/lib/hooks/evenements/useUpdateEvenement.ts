/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useUpdateEvenement.ts
import { useState } from 'react';
import { UpdateEvenementDto, Evenement } from '../../types/evenement';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseUpdateEvenementReturn {
  updateEvenement: (id: string, data: UpdateEvenementDto) => Promise<Evenement | null>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useUpdateEvenement = (): UseUpdateEvenementReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEvenement = async (id: string, data: UpdateEvenementDto): Promise<Evenement | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.patch<Evenement>(
        evenementsEndpoints.update(id),
        data
      );
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de l\'événement');
      console.error('Erreur lors de la mise à jour de l\'événement:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    updateEvenement,
    loading,
    error,
    resetError,
  };
};