/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/forms/useDepenseForm.ts

import { useState } from 'react';
import { CreateDepenseDto, UpdateDepenseDto, CategorieDepense } from '@/lib/types/depenses.types';

interface UseDepenseFormProps {
  initialValues?: Partial<CreateDepenseDto | UpdateDepenseDto>;
  onSubmit: (data: CreateDepenseDto | UpdateDepenseDto) => Promise<void>;
}

export const useDepenseForm = ({ initialValues, onSubmit }: UseDepenseFormProps) => {
  const [formData, setFormData] = useState<Partial<CreateDepenseDto | UpdateDepenseDto>>({
    categorie: CategorieDepense.AUTRE,
    montant: 0,
    description: '',
    dateDepense: new Date().toISOString().split('T')[0],
    ...initialValues,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description?.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.montant || formData.montant <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    }
    
    if (!formData.dateDepense) {
      newErrors.dateDepense = 'La date de dépense est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreateDepenseDto | UpdateDepenseDto);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData({
      categorie: CategorieDepense.AUTRE,
      montant: 0,
      description: '',
      dateDepense: new Date().toISOString().split('T')[0],
      ...initialValues,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
};