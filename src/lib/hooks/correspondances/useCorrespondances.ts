/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/correspondances/useCorrespondances.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  Correspondance, 
  QueryCorrespondanceDto, 
  PaginationResult,
  CreateCorrespondanceDto,
  UpdateCorrespondanceDto
} from '../../../lib/types/correspondance.types';
import { correspondancesApi } from '../../api/correspondances.api';
import { useToast } from '../use-toast';

interface UseCorrespondancesOptions {
  initialQuery?: QueryCorrespondanceDto;
  autoFetch?: boolean;
}

export const useCorrespondances = (options: UseCorrespondancesOptions = {}) => {
  const { initialQuery = {}, autoFetch = true } = options;
  const [correspondances, setCorrespondances] = useState<PaginationResult<Correspondance> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchCorrespondances = useCallback(async (query: QueryCorrespondanceDto = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await correspondancesApi.getCorrespondances({ ...initialQuery, ...query });
      setCorrespondances(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des correspondances';
      setError(errorMessage);
      showToast({ 
        title: 'Erreur', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [initialQuery, showToast]);

  const createCorrespondance = useCallback(async (data: CreateCorrespondanceDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCorrespondance = await correspondancesApi.createCorrespondance(data);
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
  }, [showToast]);

  const updateCorrespondance = useCallback(async (id: string, data: UpdateCorrespondanceDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCorrespondance = await correspondancesApi.updateCorrespondance(id, data);
      setCorrespondances(prev => 
        prev ? {
          ...prev,
          data: prev.data.map(item => item.id === id ? updatedCorrespondance : item)
        } : null
      );
      showToast({ 
        title: 'Succès', 
        description: 'Correspondance mise à jour avec succès', 
        variant: 'success' 
      });
      return updatedCorrespondance;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour de la correspondance';
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
  }, [showToast]);

  const deleteCorrespondance = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await correspondancesApi.deleteCorrespondance(id);
      setCorrespondances(prev => 
        prev ? { ...prev, data: prev.data.filter(item => item.id !== id) } : null
      );
      showToast({ 
        title: 'Succès', 
        description: 'Correspondance supprimée avec succès', 
        variant: 'success' 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de la correspondance';
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
  }, [showToast]);

  useEffect(() => {
    if (autoFetch) {
      fetchCorrespondances();
    }
  }, [autoFetch, fetchCorrespondances]);

  return {
    correspondances,
    loading,
    error,
    fetchCorrespondances,
    createCorrespondance,
    updateCorrespondance,
    deleteCorrespondance,
  };
};