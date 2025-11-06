/**
 * ============================================
 * STATS CARDS - Statistiques Dossiers
 * ============================================
 * Affiche les statistiques clés des dossiers
 * Utilise le hook useDossierStats (pas de données statiques)
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useDossierStats } from '@/lib/hooks/dossier/useDossierActions';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  delay: number;
}

// ============================================
// COMPOSANT CARTE STAT INDIVIDUELLE
// ============================================

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 font-mono">
                {value}
              </p>
            </div>
            <div className={cn('p-3 rounded-xl', bgColor)}>
              <Icon className={cn('h-6 w-6', color)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============================================
// SKELETON LOADING
// ============================================

const StatCardSkeleton: React.FC = () => {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const StatsCards: React.FC = () => {
  const { data: stats, isLoading, error } = useDossierStats();

  // État de chargement
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">
              Erreur lors du chargement des statistiques
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculer les statistiques
  const totalDossiers = stats?.totalDossiers || 0;
  
  const dossiersEnCours = stats?.dossiersParStatut?.find(
    (s: { statut: string; }) => s.statut === 'EN_COURS'
  )?.count || 0;

  const dossiersRisqueEleve = stats?.dossiersParRisque?.find(
    (r: { risque: string; }) => r.risque === 'ELEVE'
  )?.count || 0;

  const nombreResponsables = stats?.dossiersParResponsable?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Dossiers"
        value={totalDossiers}
        icon={FileText}
        color="text-[#4169e1]"
        bgColor="bg-blue-50"
        delay={0}
      />

      <StatCard
        title="Dossiers en cours"
        value={dossiersEnCours}
        icon={TrendingUp}
        color="text-green-600"
        bgColor="bg-green-50"
        delay={0.1}
      />

      <StatCard
        title="Risque élevé"
        value={dossiersRisqueEleve}
        icon={AlertTriangle}
        color="text-red-600"
        bgColor="bg-red-50"
        delay={0.2}
      />

      <StatCard
        title="Responsables actifs"
        value={nombreResponsables}
        icon={Users}
        color="text-[#d4af37]"
        bgColor="bg-yellow-50"
        delay={0.3}
      />
    </div>
  );
};