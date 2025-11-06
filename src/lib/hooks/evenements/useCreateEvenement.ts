/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useCreateEvenement.ts
import { useState } from 'react';
import { CreateEvenementDto, Evenement } from '../../types/evenement';
import { evenementsEndpoints } from '@/lib/api/endpoints';
import apiClient from '@/lib/api/client';

interface UseCreateEvenementReturn {
  createEvenement: (data: CreateEvenementDto) => Promise<Evenement | null>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useCreateEvenement = (): UseCreateEvenementReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEvenement = async (data: CreateEvenementDto): Promise<Evenement | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post<Evenement>(
        evenementsEndpoints.create,
        data
      );
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'événement');
      console.error('Erreur lors de la création de l\'événement:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    createEvenement,
    loading,
    error,
    resetError,
  };
};