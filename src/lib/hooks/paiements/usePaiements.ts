/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import  apiClient  from '@/lib/api/client';
import { paiementsEndpoints } from '@/lib/api/endpoints';
import { QueryPaiementDto, PaginatedPaiementsResponse, Paiement } from '@/lib/types/paiements.types';

export const usePaiements = (query: QueryPaiementDto = {}) => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchPaiements = async (params: QueryPaiementDto = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`${paiementsEndpoints.getAll}?${queryParams.toString()}`);
      const data: PaginatedPaiementsResponse = response.data;
      
      setPaiements(data.data);
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des paiements');
      console.error('Erreur lors de la récupération des paiements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements(query);
  }, [JSON.stringify(query)]);

  const refetch = (newQuery?: QueryPaiementDto) => {
    if (newQuery) {
      return fetchPaiements(newQuery);
    }
    return fetchPaiements(query);
  };

  return {
    paiements,
    isLoading,
    error,
    pagination,
    refetch,
  };
};