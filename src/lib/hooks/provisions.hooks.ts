/**
 * Hooks pour la gestion des provisions
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  ProvisionResponse, 
  ProvisionStatsResponse,
  CreateProvisionDto,
  UpdateProvisionDto,
  AjouterMouvementDto,
  QueryProvisionDto,
  UseProvisionsOptions,
  UseProvisionOptions,
  UseProvisionStatsOptions,
  PaginatedProvisionsResponse
} from '@/lib/types/provision.types';
import { provisionsApi } from '../api/provisions.api';

// Hook pour récupérer la liste des provisions
export const useProvisions = (options: UseProvisionsOptions = {}) => {
  const { autoFetch = true, clientId, dossierId, statut, page = 1, limit = 10 } = options;
  
  const [provisions, setProvisions] = useState<ProvisionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProvisions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query: QueryProvisionDto = {
        page,
        limit,
        clientId,
        dossierId,
        statut,
      };
      
      const response: PaginatedProvisionsResponse = await provisionsApi.getProvisions(query);
      setProvisions(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [clientId, dossierId, statut, page, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchProvisions();
    }
  }, [autoFetch, fetchProvisions]);

  return {
    provisions,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchProvisions,
  };
};

// Hook pour récupérer une provision spécifique
export const useProvision = (options: UseProvisionOptions) => {
  const { autoFetch = true, id } = options;
  
  const [provision, setProvision] = useState<ProvisionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvision = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await provisionsApi.getProvision(id);
      setProvision(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchProvision();
    }
  }, [autoFetch, id, fetchProvision]);

  return {
    provision,
    loading,
    error,
    refetch: fetchProvision,
  };
};

// Hook pour récupérer les statistiques des provisions
export const useProvisionStats = (options: UseProvisionStatsOptions = {}) => {
  const { autoFetch = true, refreshInterval } = options;
  
  const [stats, setStats] = useState<ProvisionStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await provisionsApi.getStats();
      setStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
    
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoFetch, fetchStats, refreshInterval]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Hook pour les opérations CRUD sur les provisions
export const useProvisionActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProvision = useCallback(async (data: CreateProvisionDto): Promise<ProvisionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      return await provisionsApi.createProvision(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProvision = useCallback(async (id: string, data: UpdateProvisionDto): Promise<ProvisionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      return await provisionsApi.updateProvision(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProvision = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await provisionsApi.deleteProvision(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const ajouterMouvement = useCallback(async (id: string, data: AjouterMouvementDto): Promise<ProvisionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      return await provisionsApi.ajouterMouvement(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const restituerProvision = useCallback(async (id: string): Promise<ProvisionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      return await provisionsApi.restituerProvision(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProvisionsEpuisees = useCallback(async (query: QueryProvisionDto = {}): Promise<PaginatedProvisionsResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      return await provisionsApi.getProvisionsEpuisees(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createProvision,
    updateProvision,
    deleteProvision,
    ajouterMouvement,
    restituerProvision,
    getProvisionsEpuisees,
  };
};