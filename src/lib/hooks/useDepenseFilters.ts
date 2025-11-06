/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useDepenseFilters.ts

import { useState, useMemo } from 'react';
import { QueryDepenseDto } from '@/lib/types/depenses.types';

export const useDepenseFilters = (initialFilters: Partial<QueryDepenseDto> = {}) => {
  const [filters, setFilters] = useState<QueryDepenseDto>({
    page: 1,
    limit: 10,
    sortBy: 'dateDepense',
    sortOrder: 'desc',
    ...initialFilters,
  });
  
  const updateFilter = (key: keyof QueryDepenseDto, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'dateDepense',
      sortOrder: 'desc',
      ...initialFilters,
    });
  };
  
  const applyFilters = (newFilters: Partial<QueryDepenseDto>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categorie) count++;
    if (filters.statut) count++;
    if (filters.dossierId) count++;
    if (filters.dateMin) count++;
    if (filters.dateMax) count++;
    return count;
  }, [filters]);
  
  const hasActiveFilters = activeFiltersCount > 0;
  
  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
    activeFiltersCount,
    hasActiveFilters,
  };
};