/**
 * ============================================
 * STATS GRID
 * ============================================
 * Grille responsive de KPI cards avec:
 * - Animations staggered (décalées)
 * - Adaptation automatique mobile/tablet/desktop
 * - Intégration avec les données du dashboard
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Scale,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { KPICard } from './KPICard';
import { cardsContainerVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const StatsGrid: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  // Calculer les statistiques à afficher
  const getStatsData = () => {
    if (!stats) {
      return {
        totalDossiers: 0,
        dossiersActifs: 0,
        totalClients: 0,
        tachesEnCours: 0,
        facturesEnAttente: 0,
        audiencesAvenir: 0,
        proceduresEnCours: 0,
        dossiersUrgents: 0,
      };
    }

    return {
      totalDossiers:
        (stats.stats?.dossiers?.EN_COURS || 0) +
        (stats.stats?.dossiers?.CLOS || 0) +
        (stats.stats?.dossiers?.ARCHIVE || 0),
      dossiersActifs: stats.stats?.dossiers?.EN_COURS || 0,
      totalClients: stats.stats?.clients || 0,
      tachesEnCours: stats.stats?.tachesEnCours || 0,
      facturesEnAttente: stats.facturesEnAttente?.length || 0,
      audiencesAvenir: stats.audiencesAvenir?.length || 0,
      proceduresEnCours: stats.proceduresEnCours?.length || 0,
      dossiersUrgents: stats.dossiersProchesEcheance?.length || 0,
    };
  };

  const statsData = getStatsData();

  return (
    <motion.div
      variants={cardsContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
    >
      {/* Total Dossiers */}
      <KPICard
        title="Total Dossiers"
        value={statsData.totalDossiers}
        icon={FileText}
        color="blue"
        trend={{ value: 12, isPositive: true }}
        isLoading={isLoading}
        delay={0}
      />

      {/* Dossiers Actifs */}
      <KPICard
        title="Dossiers Actifs"
        value={statsData.dossiersActifs}
        icon={TrendingUp}
        color="green"
        trend={{ value: 8, isPositive: true }}
        isLoading={isLoading}
        delay={0.1}
      />

      {/* Total Clients */}
      <KPICard
        title="Total Clients"
        value={statsData.totalClients}
        icon={Users}
        color="gold"
        trend={{ value: 15, isPositive: true }}
        isLoading={isLoading}
        delay={0.2}
      />

      {/* Tâches en cours */}
      <KPICard
        title="Tâches en cours"
        value={statsData.tachesEnCours}
        icon={Clock}
        color="orange"
        isLoading={isLoading}
        delay={0.3}
      />

      {/* Factures en attente */}
      <KPICard
        title="Factures en attente"
        value={statsData.facturesEnAttente}
        icon={DollarSign}
        color="red"
        trend={{ value: 5, isPositive: false }}
        isLoading={isLoading}
        delay={0.4}
      />

      {/* Audiences à venir */}
      <KPICard
        title="Audiences à venir"
        value={statsData.audiencesAvenir}
        icon={Scale}
        color="burgundy"
        isLoading={isLoading}
        delay={0.5}
      />

      {/* Procédures en cours */}
      <KPICard
        title="Procédures en cours"
        value={statsData.proceduresEnCours}
        icon={CheckCircle}
        color="blue"
        isLoading={isLoading}
        delay={0.6}
      />

      {/* Dossiers urgents */}
      <KPICard
        title="Dossiers urgents"
        value={statsData.dossiersUrgents}
        icon={AlertCircle}
        color="red"
        trend={{ value: 3, isPositive: false }}
        isLoading={isLoading}
        delay={0.7}
      />
    </motion.div>
  );
};