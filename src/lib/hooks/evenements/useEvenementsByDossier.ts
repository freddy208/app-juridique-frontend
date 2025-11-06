/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/evenements/useEvenementsByDossier.ts
import { useState, useEffect } from 'react';
import { Evenement, QueryEvenementsDto, PaginationResult } from '../../types/evenement';
import apiClient from '@/lib/api/client';
import { evenementsEndpoints } from '@/lib/api/endpoints';

interface UseEvenementsByDossierReturn {
  evenements: Evenement[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  fetchEvenements: (params?: QueryEvenementsDto) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useEvenementsByDossier = (dossierId: string, initialParams?: QueryEvenementsDto): UseEvenementsByDossierReturn => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialParams?.page || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [params, setParams] = useState<QueryEvenementsDto>(initialParams || {});

  const fetchEvenements = async (newParams?: QueryEvenementsDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = newParams || params;
      setParams(queryParams);
      
      const response = await apiClient.get<PaginationResult<Evenement>>(
        evenementsEndpoints.getByDossier(dossierId),
        { params: queryParams }
      );
      
      setEvenements(response.data.data);
      setTotalCount(response.data.total);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des événements du dossier');
      console.error('Erreur lors de la récupération des événements du dossier:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEvenements(params);
  };

  useEffect(() => {
    fetchEvenements();
  }, [dossierId]);

  return {
    evenements,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    fetchEvenements,
    refetch,
  };
};