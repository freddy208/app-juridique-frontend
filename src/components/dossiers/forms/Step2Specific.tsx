/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * STEP 2 - INFORMATIONS SPÉCIFIQUES
 * ============================================
 * Affiche dynamiquement le formulaire selon le type de dossier
 * Contient les champs spécifiques à chaque type
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateDossierRequest, TypeDossier } from '@/lib/types/dossier';
import { TYPE_DOSSIER_CONFIG } from '@/lib/dossiers/constants';
import {
  SinistreCorporelForm,
  SinistreMaterielForm,
  SinistreMortelForm,
  ImmobilierForm,
  SportForm,
  ContratForm,
  ContentieuxForm,
  AutreForm,
} from './DossierSubForms';

// ============================================
// TYPES
// ============================================

interface Step2SpecificProps {
  type: TypeDossier;
  initialData?: Partial<CreateDossierRequest>;
  onComplete: (data: Partial<CreateDossierRequest>) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Step2Specific: React.FC<Step2SpecificProps> = ({
  type,
  initialData,
  onComplete,
  onBack,
  isSubmitting,
}) => {
  const form = useForm({
    defaultValues: initialData || {},
  });

  const typeConfig = TYPE_DOSSIER_CONFIG[type];

  const onSubmit = (data: any) => {
    onComplete(data);
  };

  // Rendu du formulaire selon le type
  const renderSpecificForm = () => {
    switch (type) {
      case TypeDossier.SINISTRE_CORPOREL:
        return <SinistreCorporelForm form={form} />;
      case TypeDossier.SINISTRE_MATERIEL:
        return <SinistreMaterielForm form={form} />;
      case TypeDossier.SINISTRE_MORTEL:
        return <SinistreMortelForm form={form} />;
      case TypeDossier.IMMOBILIER:
        return <ImmobilierForm form={form} />;
      case TypeDossier.SPORT:
        return <SportForm form={form} />;
      case TypeDossier.CONTRAT:
        return <ContratForm form={form} />;
      case TypeDossier.CONTENTIEUX:
        return <ContentieuxForm form={form} />;
      case TypeDossier.AUTRE:
        return <AutreForm form={form} />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Aucun formulaire spécifique pour ce type de dossier
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{typeConfig.icon}</span>
            <div>
              <CardTitle className="text-2xl font-['Playfair_Display']">
                {typeConfig.label}
              </CardTitle>
              <CardDescription>
                Informations spécifiques au type de dossier sélectionné
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Formulaire dynamique selon le type */}
              {renderSpecificForm()}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Retour
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Créer le dossier
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};