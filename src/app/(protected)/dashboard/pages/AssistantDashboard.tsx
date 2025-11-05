// protected/dashboard/pages/AssistantDashboard.tsx
"use client"

import { motion } from "framer-motion"
import { containerVariants } from "../utils/animations"
import { KpiGrid } from "../components/kpi/KpiGrid"
import { DossiersTable } from "../components/tables/DossiersTable"
import { TachesTable } from "../components/tables/TachesTable"
import { AlertesWidget } from "../components/widgets/AlertesWidget"
import { EvenementsWidget } from "../components/widgets/EvenementsWidget"
import { useDashboardStats } from "../../../../lib/hooks/useDashboardStats"

export function AssistantDashboard() {
  const { stats, isLoading } = useDashboardStats()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d&apos;ensemble de vos tâches et activités
          </p>
        </div>
      </div>

      <KpiGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TachesTable
          title="Vos tâches en cours"
          data={stats?.tachesAssignees || []}
          isLoading={isLoading}
        />
        <EvenementsWidget
          title="Événements à venir"
          data={stats?.evenementsAvenir || []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DossiersTable
          title="Dossiers récemment modifiés"
          data={stats?.dossiersRecentes || []}
          isLoading={isLoading}
        />
        <AlertesWidget
          title="Vos alertes"
          data={stats?.alertes || []}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  )
}