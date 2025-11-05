/**
 * ============================================
 * DASHBOARD PAGE
 * ============================================
 * Page principale du dashboard juridique
 * Affiche tous les widgets, graphiques et tableaux
 * Responsive et adapté selon le rôle utilisateur
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { StatsGrid } from '@/components/dashboard/cards/StatsGrid';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { CasesChart } from '@/components/dashboard/charts/CasesChart';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { RecentCasesTable } from '@/components/dashboard/tables/RecentCasesTable';
import { UpcomingHearingsTable } from '@/components/dashboard/tables/UpcomingHearingsTable';
import { UrgentTasksTable } from '@/components/dashboard/tables/UrgentTasksTable';
import { AlertsWidget } from '@/components/dashboard/widgets/AlertsWidget';
import { CalendarWidget } from '@/components/dashboard/widgets/CalendarWidget';
import { QuickActionsWidget } from '@/components/dashboard/widgets/QuickActionsWidget';
import { fadeInVariants } from '@/lib/dashboard/animations';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header avec message de bienvenue */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-2"
        >
          Bienvenue, {user?.prenom} {user?.nom}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600"
        >
          Voici un aperçu de votre activité juridique
        </motion.p>
      </div>

      {/* Grille de statistiques KPI */}
      <StatsGrid />

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <CasesChart />
      </div>

      {/* Graphique de performance (pleine largeur) */}
      <div className="grid grid-cols-1">
        <PerformanceChart />
      </div>

      {/* Tableaux et widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Colonne principale (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <RecentCasesTable />
          <UpcomingHearingsTable />
          <UrgentTasksTable />
        </div>

        {/* Sidebar widgets (1/3) */}
        <div className="space-y-6">
          <AlertsWidget />
          <CalendarWidget />
          <QuickActionsWidget />
        </div>
      </div>

      {/* Footer avec informations système */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500"
      >
        <p>
          Cabinet Juridique - Dashboard v2.0.0 | © 2025 Tous droits réservés
        </p>
        <p className="mt-1">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </motion.div>
    </motion.div>
  );
}