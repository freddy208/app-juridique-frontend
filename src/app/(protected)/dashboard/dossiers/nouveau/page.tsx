/**
 * ============================================
 * PAGE NOUVEAU DOSSIER
 * ============================================
 * Page de création d'un nouveau dossier
 * Utilise le wizard en 2 étapes
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';// ✅ Correct
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DossierWizard } from '@/components/dossiers/forms/DossierWizard';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function NouveauDossierPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100"
          aria-label="Retour"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Playfair_Display']">
            Nouveau Dossier
          </h1>
          <p className="text-gray-600 mt-1">
            Créez un nouveau dossier en 2 étapes simples
          </p>
        </div>
      </motion.div>

      {/* Alerte informative */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-[#4169e1]" />
          <AlertTitle className="text-[#4169e1]">
            Processus de création en 2 étapes
          </AlertTitle>
          <AlertDescription className="text-gray-700">
            <strong>Étape 1 :</strong> Renseignez les informations générales du dossier (client, type, responsable...).
            <br />
            <strong>Étape 2 :</strong> Complétez les informations spécifiques selon le type de dossier sélectionné.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Wizard de création */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <DossierWizard />
      </motion.div>
    </div>
  );
}