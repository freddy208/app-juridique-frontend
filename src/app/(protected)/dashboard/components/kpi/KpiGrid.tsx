// protected/dashboard/components/kpi/KpiGrid.tsx
"use client"

import { motion } from "framer-motion"
import { KpiCard } from "./KpiCard"
import { containerVariants } from "../../utils/animations"
import { useDashboardStats } from "../../../../../lib/hooks/useDashboardStats"
import {
  FileText,
  Users,
  CreditCard,
  Calendar,
} from "lucide-react"

export function KpiGrid() {
  const { stats, isLoading } = useDashboardStats()

  if (!stats) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <KpiCard
        title="Dossiers actifs"
        value={stats.stats?.dossiers?.ACTIF || 0}
        change={{
          value: 12,
          isPositive: true,
        }}
        icon={FileText}
        color="blue"
        isLoading={isLoading}
      />
      <KpiCard
        title="Clients"
        value={stats.stats?.clients || 0}
        change={{
          value: 8,
          isPositive: true,
        }}
        icon={Users}
        color="green"
        isLoading={isLoading}
      />
      <KpiCard
        title="Factures en attente"
        value={stats.stats?.factures?.IMPAYEE?.count || 0}
        change={{
          value: 5,
          isPositive: false,
        }}
        icon={CreditCard}
        color="red"
        isLoading={isLoading}
      />
      <KpiCard
        title="Tâches en cours"
        value={stats.stats?.tachesEnCours || 0}
        change={{
          value: 15,
          isPositive: true,
        }}
        icon={Calendar}
        color="purple"
        isLoading={isLoading}
      />
    </motion.div>
  )
}