/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useDeleteEvenement.ts
import { useState } from 'react';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseDeleteEvenementReturn {
  deleteEvenement: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useDeleteEvenement = (): UseDeleteEvenementReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvenement = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.delete(evenementsEndpoints.delete(id));
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de l\'événement');
      console.error('Erreur lors de la suppression de l\'événement:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    deleteEvenement,
    loading,
    error,
    resetError,
  };
};