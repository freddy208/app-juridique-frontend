/**
 * ============================================
 * ALERTS WIDGET
 * ============================================
 * Widget d'alertes et notifications importantes
 * Affiche les alertes récentes avec priorité
 * Animations et design moderne
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
} from 'lucide-react';
import { fadeInUpVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// ============================================
// CONFIGURATION PRIORITÉS
// ============================================

const priorityConfig = {
  1: {
    icon: AlertTriangle,
    className: 'bg-red-50 border-red-200 text-red-700',
    iconClassName: 'text-red-500',
  },
  2: {
    icon: AlertTriangle,
    className: 'bg-orange-50 border-orange-200 text-orange-700',
    iconClassName: 'text-orange-500',
  },
  3: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-700',
    iconClassName: 'text-blue-500',
  },
  4: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-700',
    iconClassName: 'text-green-500',
  },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const AlertsWidget: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  const alertes = stats?.alertesRecentes || [];

  // Fonction pour marquer une alerte comme traitée
  const handleDismissAlert = (alertId: string) => {
    console.log('Dismiss alert:', alertId);
    // TODO: Implémenter l'API pour marquer comme traité
  };

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.7 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bell className="h-5 w-5 text-[#ef4444]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
              Alertes
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Notifications importantes
          </p>
        </div>
        
        {alertes.length > 0 && (
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {alertes.filter(a => !a.traite).length}
          </span>
        )}
      </div>

      {/* Liste des alertes */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ef4444] border-r-transparent" />
            <p className="mt-4 text-sm text-gray-600">Chargement des alertes...</p>
          </div>
        ) : alertes.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune alerte</p>
            <p className="text-sm text-gray-400 mt-1">Tout est sous contrôle</p>
          </div>
        ) : (
          alertes.slice(0, 5).map((alerte) => {
            const priority = priorityConfig[alerte.priorite as keyof typeof priorityConfig] ||
              priorityConfig[3];
            const Icon = priority.icon;

            return (
              <motion.div
                key={alerte.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={cn(
                  'p-4 rounded-lg border relative',
                  priority.className,
                  alerte.traite && 'opacity-50'
                )}
              >
                {/* Bouton fermer */}
                {!alerte.traite && (
                  <button
                    onClick={() => handleDismissAlert(alerte.id)}
                    className="absolute top-3 right-3 p-1 rounded hover:bg-white/50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Contenu */}
                <div className="flex gap-3 pr-6">
                  <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', priority.iconClassName)} />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {alerte.message}
                    </p>
                    <p className="text-xs opacity-75">
                      {formatDistanceToNow(new Date(alerte.creeLe), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {alertes.length > 5 && (
        <button className="w-full mt-4 text-sm font-medium text-[#ef4444] hover:text-[#dc2626] transition-colors">
          Voir toutes les alertes →
        </button>
      )}
    </motion.div>
  );
};