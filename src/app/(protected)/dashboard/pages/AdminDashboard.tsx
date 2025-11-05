// protected/dashboard/pages/AdminDashboard.tsx
"use client"

import { motion } from "framer-motion"
import { BarChart } from "../components/charts/BarChart"
import { LineChart } from "../components/charts/LineChart"
import { PieChart } from "../components/charts/PieChart"
import { containerVariants } from "../utils/animations"
import { KpiGrid } from "../components/kpi/KpiGrid"
import { DossiersTable } from "../components/tables/DossiersTable"
import { AlertesWidget } from "../components/widgets/AlertesWidget"
import { useDashboardStats } from "../../../../lib/hooks/useDashboardStats"

export function AdminDashboard() {
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

  const dossiersParTypeData = [
    { name: "Civil", value: 30 },
    { name: "Pénal", value: 20 },
    { name: "Affaires", value: 25 },
    { name: "Fiscal", value: 15 },
    { name: "Autre", value: 10 },
  ]

  const colors = [
    "#4169e1", // Bleu Royal
    "#d4af37", // Or
    "#8b0000", // Bordeaux
    "#10b981", // Vert juridique
    "#f59e0b", // Orange
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
            Vue d&apos;ensemble de l&apos;activité du cabinet
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
          title="Évolution des dossiers"
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
            title="Dossiers récents"
            data={stats?.dossiersRecentes || []}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <PieChart
            title="Répartition des dossiers par type"
            data={dossiersParTypeData}
            dataKey="value"
            nameKey="name"
            colors={colors}
            isLoading={isLoading}
          />
          <AlertesWidget
            title="Alertes récentes"
            data={stats?.alertesRecentes || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  )
}