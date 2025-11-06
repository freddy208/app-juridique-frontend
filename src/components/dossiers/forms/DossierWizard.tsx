/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * DOSSIER WIZARD
 * ============================================
 * Formulaire de création de dossier en 2 étapes
 * Avec barre de progression et navigation fluide
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateDossier } from '@/lib/hooks/dossier/useCreateDossier';
import { CreateDossierRequest } from '@/lib/types/dossier';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Step1General } from './Step1General';
import { Step2Specific } from './Step2Specific';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const DossierWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateDossierRequest>>({});

  // Mutation de création
  const createMutation = useCreateDossier({
    onSuccess: (data: { numeroUnique: any; id: any; }) => {
      toast.success('✅ Dossier créé avec succès !', {
        description: `Le dossier ${data.numeroUnique} a été créé`,
      });
      router.push(`/dossiers/${data.id}`);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error("❌ Vous n'avez pas les permissions pour créer un dossier");
      } else {
        const message = error.response?.data?.message || 'Une erreur est survenue';
        toast.error('❌ Échec de la création du dossier', {
          description: message,
        });
      }
    },
  });

  // Gestion de la complétion de l'étape 1
  const handleStep1Complete = (data: Partial<CreateDossierRequest>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gestion de la complétion de l'étape 2 (soumission finale)
  const handleStep2Complete = (data: Partial<CreateDossierRequest>) => {
    const finalData = { ...formData, ...data };
    createMutation.mutate(finalData as CreateDossierRequest);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        {/* Indicateurs d'étapes */}
        <div className="flex items-center justify-between mb-3">
          {/* Étape 1 */}
          <div className="text-center flex-1">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 font-bold transition-all ${
                currentStep === 1
                  ? 'bg-[#4169e1] text-white scale-110'
                  : 'bg-green-500 text-white'
              }`}
            >
              {currentStep === 1 ? '1' : '✓'}
            </div>
            <p
              className={`text-sm font-medium transition-colors ${
                currentStep === 1 ? 'text-[#4169e1]' : 'text-gray-600'
              }`}
            >
              Informations générales
            </p>
          </div>

          {/* Ligne de connexion */}
          <div className="flex-1 h-1 bg-gray-200 mx-4 relative">
            <div
              className={`absolute top-0 left-0 h-full bg-[#4169e1] transition-all duration-300 ${
                currentStep === 2 ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          {/* Étape 2 */}
          <div className="text-center flex-1">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 font-bold transition-all ${
                currentStep === 2
                  ? 'bg-[#4169e1] text-white scale-110'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <p
              className={`text-sm font-medium transition-colors ${
                currentStep === 2 ? 'text-[#4169e1]' : 'text-gray-500'
              }`}
            >
              Informations spécifiques
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <Progress value={currentStep === 1 ? 50 : 100} className="h-2" />
      </div>

      {/* Contenu des étapes */}
      {currentStep === 1 && (
        <Step1General initialData={formData} onComplete={handleStep1Complete} />
      )}

      {currentStep === 2 && formData.type && (
        <Step2Specific
          type={formData.type}
          initialData={formData}
          onComplete={handleStep2Complete}
          onBack={() => setCurrentStep(1)}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
};