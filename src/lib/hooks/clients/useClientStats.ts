// src/hooks/api/useClientStats.ts

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { clientsEndpoints } from '@/lib/api/endpoints';
import { ClientStatsResponse } from './../../types/client.types';

export const useClientStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clientStats'],
    queryFn: async () => {
      const { data } = await apiClient.get<ClientStatsResponse>(
        clientsEndpoints.stats
      );
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};