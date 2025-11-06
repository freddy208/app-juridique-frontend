/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/correspondances/useCorrespondance.ts

import { useState, useEffect, useCallback } from 'react';
import { Correspondance, UpdateCorrespondanceDto } from '../../types/correspondance.types';
import { correspondancesApi } from '../../api/correspondances.api';
import { useToast } from '../use-toast';

export const useCorrespondance = (id?: string) => {
  const [correspondance, setCorrespondance] = useState<Correspondance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchCorrespondance = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await correspondancesApi.getCorrespondance(id);
      setCorrespondance(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération de la correspondance';
      setError(errorMessage);
      showToast({ 
        title: 'Erreur', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  const updateCorrespondance = useCallback(async (data: UpdateCorrespondanceDto) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCorrespondance = await correspondancesApi.updateCorrespondance(id, data);
      setCorrespondance(updatedCorrespondance);
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
  }, [id, showToast]);

  const deleteCorrespondance = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await correspondancesApi.deleteCorrespondance(id);
      setCorrespondance(null);
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
  }, [id, showToast]);

  useEffect(() => {
    if (id) {
      fetchCorrespondance();
    }
  }, [id, fetchCorrespondance]);

  return {
    correspondance,
    loading,
    error,
    fetchCorrespondance,
    updateCorrespondance,
    deleteCorrespondance,
  };
};