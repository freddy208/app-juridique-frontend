/**
 * ============================================
 * TACHES TAB CONTENT
 * ============================================
 * Contenu de l'onglet Tâches
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { CheckSquare, Plus, User, Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TacheResponse, StatutTache, TachePriorite } from '../../../lib/types/tache.types';

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

interface TachesTabContentProps {
  taches?: TacheResponse[];
  dossierId: string;
}

// Configuration des statuts
const STATUT_CONFIG: Record<StatutTache, { label: string; color: string; bgColor: string }> = {
  [StatutTache.A_FAIRE]: {
    label: 'À faire',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  [StatutTache.EN_COURS]: {
    label: 'En cours',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [StatutTache.TERMINEE]: {
    label: 'Terminée',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
};

// Configuration des priorités
const PRIORITE_CONFIG: Record<TachePriorite, { label: string; icon: string; color: string }> = {
  [TachePriorite.BASSE]: {
    label: 'Basse',
    icon: '🟢',
    color: 'text-green-600',
  },
  [TachePriorite.MOYENNE]: {
    label: 'Moyenne',
    icon: '🟡',
    color: 'text-yellow-600',
  },
  [TachePriorite.HAUTE]: {
    label: 'Haute',
    icon: '🟠',
    color: 'text-orange-600',
  },
  [TachePriorite.URGENTE]: {
    label: 'Urgente',
    icon: '🔴',
    color: 'text-red-600',
  },
};

export const TachesTabContent: React.FC<TachesTabContentProps> = ({ 
  taches, 
  dossierId 
}) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tâches</CardTitle>
            <CardDescription>
              {taches?.length || 0} tâche(s) en lien avec ce dossier
            </CardDescription>
          </div>
          <Button
            onClick={() => router.push(`/taches/nouveau?dossierId=${dossierId}`)}
            className="bg-[#4169e1] hover:bg-[#2e4fa8]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer une tâche
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {taches && taches.length > 0 ? (
          <div className="space-y-3">
            {taches.map((tache) => {
              const statutConfig = STATUT_CONFIG[tache.statut];
              const prioriteConfig = PRIORITE_CONFIG[tache.priorite];

              return (
                <div
                  key={tache.id}
                  className={`p-4 border rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                    tache.enRetard ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-[#4169e1]'
                  }`}
                  onClick={() => router.push(`/taches/${tache.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {tache.titre}
                        </h4>
                        {tache.enRetard && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            En retard
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${statutConfig.bgColor} ${statutConfig.color} border-0`}>
                          {statutConfig.label}
                        </Badge>
                        
                        <span className={`text-xs font-medium ${prioriteConfig.color} flex items-center gap-1`}>
                          <span>{prioriteConfig.icon}</span>
                          {prioriteConfig.label}
                        </span>

                        {tache.dateLimite && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Échéance: {formatDate(tache.dateLimite)}
                          </span>
                        )}

                        {tache.assignee && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Assigné à: {tache.assignee.prenom} {tache.assignee.nom}
                          </span>
                        )}
                      </div>

                      {tache.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {tache.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <CheckSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Aucune tâche</p>
            <p className="text-sm text-gray-500 mb-4">
              Aucune tâche n&apos;a encore été créée pour ce dossier
            </p>
            <Button
              onClick={() => router.push(`/taches/nouveau?dossierId=${dossierId}`)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer la première tâche
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};