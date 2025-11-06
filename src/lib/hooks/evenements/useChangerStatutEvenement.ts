/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useChangerStatutEvenement.ts
import { useState } from 'react';
import { StatutEvenement, Evenement } from '../../types/evenement';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseChangerStatutEvenementReturn {
  changerStatutEvenement: (id: string, statut: StatutEvenement) => Promise<Evenement | null>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useChangerStatutEvenement = (): UseChangerStatutEvenementReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const changerStatutEvenement = async (id: string, statut: StatutEvenement): Promise<Evenement | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.patch<Evenement>(
        evenementsEndpoints.changerStatut(id),
        { statut }
      );
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de statut de l\'événement');
      console.error('Erreur lors du changement de statut de l\'événement:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    changerStatutEvenement,
    loading,
    error,
    resetError,
  };
};