// protected/dashboard/pages/AvocatDashboard.tsx
"use client"

import { motion } from "framer-motion"
import { BarChart } from "../components/charts/BarChart"
import { LineChart } from "../components/charts/LineChart"
import { containerVariants } from "../utils/animations"
import { KpiGrid } from "../components/kpi/KpiGrid"
import { DossiersTable } from "../components/tables/DossiersTable"
import { TachesTable } from "../components/tables/TachesTable"
import { AlertesWidget } from "../components/widgets/AlertesWidget"
import { EvenementsWidget } from "../components/widgets/EvenementsWidget"
import { useDashboardStats } from "../../../../lib/hooks/useDashboardStats"

export function AvocatDashboard() {
  const { stats, isLoading } = useDashboardStats()

  // Données mock pour les graphiques
  const chiffreAffairesData = [
    { month: "Jan", amount: 4000 },
    { month: "Fév", amount: 3000 },
    { month: "Mar", amount: 5000 },
    { month: "Avr", amount: 4500 },
    { month: "Mai", amount: 6000 },
    { month: "Jun", amount: 5500 },
  ]

  const dossiersParMoisData = [
    { month: "Jan", nouveaux: 4, terminés: 2 },
    { month: "Fév", nouveaux: 3, terminés: 3 },
    { month: "Mar", nouveaux: 5, terminés: 4 },
    { month: "Avr", nouveaux: 4, terminés: 5 },
    { month: "Mai", nouveaux: 6, terminés: 3 },
    { month: "Jun", nouveaux: 5, terminés: 4 },
  ]

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
            Vue d&apos;ensemble de votre activité
          </p>
        </div>
      </div>

      <KpiGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Chiffre d'affaires mensuel"
          data={chiffreAffairesData}
          dataKey="amount"
          xAxisDataKey="month"
          color="#4169e1"
          isLoading={isLoading}
        />
        <LineChart
          title="Évolution de vos dossiers"
          data={dossiersParMoisData}
          lines={[
            { dataKey: "nouveaux", color: "#4169e1", name: "Nouveaux" },
            { dataKey: "terminés", color: "#10b981", name: "Terminés" },
          ]}
          xAxisDataKey="month"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DossiersTable
            title="Vos dossiers récents"
            data={stats?.dossiersRecentes || []}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <AlertesWidget
            title="Vos alertes"
            data={stats?.alertes || []}
            isLoading={isLoading}
          />
          <EvenementsWidget
            title="Événements à venir"
            data={stats?.evenementsAvenir || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      <TachesTable
        title="Vos tâches en cours"
        data={stats?.tachesAssignees || []}
        isLoading={isLoading}
      />
    </motion.div>
  )
}