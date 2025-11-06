/**
 * ============================================
 * FACTURES TAB CONTENT
 * ============================================
 * Contenu de l'onglet Factures
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, Plus, Calendar, FileText, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Facture, StatutFacture } from '../../../lib/types/factures.types';

// Fonctions utilitaires
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Configuration des statuts de facture
const STATUT_FACTURE_CONFIG: Record<StatutFacture, { label: string; color: string; bgColor: string }> = {
  [StatutFacture.BROUILLON]: {
    label: 'Brouillon',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  [StatutFacture.ENVOYEE]: {
    label: 'Envoyée',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [StatutFacture.PAYEE]: {
    label: 'Payée',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  [StatutFacture.PARTIELLE]: {
    label: 'Partiellement payée',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  [StatutFacture.EN_RETARD]: {
    label: 'En retard',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  [StatutFacture.IMPAYEE]: {
    label: 'Impayée',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  [StatutFacture.SUPPRIME]: {
    label: 'Supprimée',
    color: 'text-gray-700',
    bgColor: 'bg-gray-200',
  },
};

interface FacturesTabContentProps {
  factures?: Facture[];
  dossierId: string;
}

export const FacturesTabContent: React.FC<FacturesTabContentProps> = ({ 
  factures, 
  dossierId 
}) => {
  const router = useRouter();

  // Calculer les statistiques
  const totalFactures = factures?.length || 0;
  const montantTotal = factures?.reduce((sum, f) => sum + f.montantTotal, 0) || 0;
  const montantPaye = factures
    ?.filter(f => f.statut === StatutFacture.PAYEE)
    .reduce((sum, f) => sum + f.montantPaye, 0) || 0;
  const montantEnAttente = montantTotal - montantPaye;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Factures & Honoraires</CardTitle>
            <CardDescription>
              Gestion financière du dossier - {totalFactures} facture(s)
            </CardDescription>
          </div>
          <Button
            onClick={() => router.push(`/factures/nouveau?dossierId=${dossierId}`)}
            className="bg-[#4169e1] hover:bg-[#2e4fa8]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistiques financières */}
        {factures && factures.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Total facturé</p>
              </div>
              <p className="text-2xl font-bold text-blue-900 font-mono">
                {formatCurrency(montantTotal)}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-900">Montant payé</p>
              </div>
              <p className="text-2xl font-bold text-green-900 font-mono">
                {formatCurrency(montantPaye)}
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-medium text-orange-900">En attente</p>
              </div>
              <p className="text-2xl font-bold text-orange-900 font-mono">
                {formatCurrency(montantEnAttente)}
              </p>
            </div>
          </div>
        )}

        {/* Liste des factures */}
        {factures && factures.length > 0 ? (
          <div className="space-y-3">
            {factures.map((facture) => {
              const statutConfig = STATUT_FACTURE_CONFIG[facture.statut];

              return (
                <div
                  key={facture.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#4169e1] hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => router.push(`/factures/${facture.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="h-5 w-5 text-[#4169e1]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            Facture {facture.numero || `#${facture.id.substring(0, 8)}`}
                          </h4>
                          <Badge className={`${statutConfig.bgColor} ${statutConfig.color} border-0`}>
                            {statutConfig.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Émise le {formatDate(facture.dateEmission)}
                          </span>
                          {facture.dateEcheance && (
                            <span className="flex items-center gap-1">
                              Échéance: {formatDate(facture.dateEcheance)}
                            </span>
                          )}
                          {facture.client && (
                            <span className="flex items-center gap-1">
                              Client: {facture.client.prenom} {facture.client.nom}
                              {facture.client.entreprise && ` - ${facture.client.entreprise}`}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900 font-mono">
                            {formatCurrency(facture.montantTotal)}
                          </span>
                          {facture.montantPaye > 0 && facture.montantPaye < facture.montantTotal && (
                            <span className="text-sm text-gray-600">
                              Payé: {formatCurrency(facture.montantPaye)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Aucune facture</p>
            <p className="text-sm text-gray-500 mb-4">
              Aucune facture n&apos;a encore été créée pour ce dossier
            </p>
            <Button
              onClick={() => router.push(`/factures/nouveau?dossierId=${dossierId}`)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer la première facture
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};