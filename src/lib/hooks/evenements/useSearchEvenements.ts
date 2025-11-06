/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/evenements/useSearchEvenements.ts
import { useState } from 'react';
import { QueryEvenementsDto, Evenement, PaginationResult } from '../../types/evenement';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseSearchEvenementsReturn {
  searchEvenements: (searchTerm: string, params?: QueryEvenementsDto) => Promise<PaginationResult<Evenement> | null>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

export const useSearchEvenements = (): UseSearchEvenementsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchEvenements = async (searchTerm: string, params?: QueryEvenementsDto): Promise<PaginationResult<Evenement> | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<PaginationResult<Evenement>>(
        evenementsEndpoints.search,
        { 
          params: {
            q: searchTerm,
            ...params,
          }
        }
      );
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche d\'événements');
      console.error('Erreur lors de la recherche d\'événements:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    searchEvenements,
    loading,
    error,
    resetError,
  };
};