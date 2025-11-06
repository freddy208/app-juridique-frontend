/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/correspondances/useClientCorrespondances.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  Correspondance, 
  QueryCorrespondanceDto, 
  PaginationResult,
  CreateCorrespondanceDto 
} from '../../types/correspondance.types';
import { correspondancesApi } from '../../api/correspondances.api';
import { useToast } from '../use-toast';

interface UseClientCorrespondancesOptions {
  initialQuery?: QueryCorrespondanceDto;
  autoFetch?: boolean;
}

export const useClientCorrespondances = (
  clientId?: string, 
  options: UseClientCorrespondancesOptions = {}
) => {
  const { initialQuery = {}, autoFetch = true } = options;
  const [correspondances, setCorrespondances] = useState<PaginationResult<Correspondance> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchCorrespondances = useCallback(async (query: QueryCorrespondanceDto = {}) => {
    if (!clientId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await correspondancesApi.getCorrespondancesByClient(clientId, { ...initialQuery, ...query });
      setCorrespondances(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des correspondances du client';
      setError(errorMessage);
      showToast({ 
        title: 'Erreur', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, initialQuery, showToast]);

  const createCorrespondance = useCallback(async (data: CreateCorrespondanceDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCorrespondance = await correspondancesApi.createCorrespondance({ ...data, clientId });
      setCorrespondances(prev => 
        prev ? { ...prev, data: [newCorrespondance, ...prev.data] } : null
      );
      showToast({ 
        title: 'Succès', 
        description: 'Correspondance créée avec succès', 
        variant: 'success' 
      });
      return newCorrespondance;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de la correspondance';
      setError(errorMessage);
      showToast({ 
        title: 'Erreur', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clientId, showToast]);

  useEffect(() => {
    if (clientId && autoFetch) {
      fetchCorrespondances();
    }
  }, [clientId, autoFetch, fetchCorrespondances]);

  return {
    correspondances,
    loading,
    error,
    fetchCorrespondances,
    createCorrespondance,
  };
};