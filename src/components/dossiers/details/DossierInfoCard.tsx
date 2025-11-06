/**
 * ============================================
 * DOSSIER INFO CARD
 * ============================================
 * Carte d'affichage des informations principales
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Calendar } from 'lucide-react';
import { Dossier } from '@/lib/types/dossier';
import { formatCurrency, formatDate } from '@/lib/dossiers/constants';

interface DossierInfoCardProps {
  dossier: Dossier;
}

export const DossierInfoCard: React.FC<DossierInfoCardProps> = ({ dossier }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#4169e1]" />
          Informations du dossier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grille d'informations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Client</p>
            <p className="font-semibold text-gray-900">
              {dossier.client.prenom} {dossier.client.nom}
            </p>
            {dossier.client.entreprise && (
              <p className="text-sm text-gray-600 mt-0.5">{dossier.client.entreprise}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Responsable</p>
            <p className="font-semibold text-gray-900">
              {dossier.responsable
                ? `${dossier.responsable.prenom} ${dossier.responsable.nom}`
                : 'Non assigné'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Valeur financière</p>
            <p className="font-semibold text-gray-900 font-mono">
              {formatCurrency(dossier.valeurFinanciere)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Chances de succès</p>
            <p className="font-semibold text-gray-900 font-mono">
              {dossier.chancesSucces ? `${dossier.chancesSucces}%` : 'Non évalué'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Créé le
            </p>
            <p className="font-semibold text-gray-900">{formatDate(dossier.creeLe)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Mis à jour le
            </p>
            <p className="font-semibold text-gray-900">{formatDate(dossier.misAJourLe)}</p>
          </div>
        </div>

        {/* Description */}
        {dossier.description && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
            <p className="text-gray-900 leading-relaxed">{dossier.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};