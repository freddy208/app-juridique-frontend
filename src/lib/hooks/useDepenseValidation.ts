// src/hooks/useDepenseValidation.ts

import { useState } from 'react';
import { useValiderDepense, useRejeterDepense } from './api/useDepenses';

export const useDepenseValidation = () => {
  const validerDepenseMutation = useValiderDepense();
  const rejeterDepenseMutation = useRejeterDepense();
  const [selectedDepenseIds, setSelectedDepenseIds] = useState<string[]>([]);
  
  const toggleSelection = (id: string) => {
    setSelectedDepenseIds(prev => 
      prev.includes(id) 
        ? prev.filter(depenseId => depenseId !== id)
        : [...prev, id]
    );
  };
  
  const selectAll = (ids: string[]) => {
    setSelectedDepenseIds(ids);
  };
  
  const clearSelection = () => {
    setSelectedDepenseIds([]);
  };
  
  const validerDepense = async (id: string, valideParId: string) => {
    await validerDepenseMutation.mutateAsync({ id, valideParId });
    // Retirer de la sélection après validation
    setSelectedDepenseIds(prev => prev.filter(depenseId => depenseId !== id));
  };
  
  const validerDepensesSelectionnees = async (valideParId: string) => {
    await Promise.all(
      selectedDepenseIds.map(id => validerDepenseMutation.mutateAsync({ id, valideParId }))
    );
    clearSelection();
  };
  
  const rejeterDepense = async (id: string, valideParId: string) => {
    await rejeterDepenseMutation.mutateAsync({ id, valideParId });
    // Retirer de la sélection après rejet
    setSelectedDepenseIds(prev => prev.filter(depenseId => depenseId !== id));
  };
  
  const rejeterDepensesSelectionnees = async (valideParId: string) => {
    await Promise.all(
      selectedDepenseIds.map(id => rejeterDepenseMutation.mutateAsync({ id, valideParId }))
    );
    clearSelection();
  };
  
  return {
    selectedDepenseIds,
    toggleSelection,
    selectAll,
    clearSelection,
    validerDepense,
    validerDepensesSelectionnees,
    rejeterDepense,
    rejeterDepensesSelectionnees,
    isValidating: validerDepenseMutation.isPending || rejeterDepenseMutation.isPending,
  };
};