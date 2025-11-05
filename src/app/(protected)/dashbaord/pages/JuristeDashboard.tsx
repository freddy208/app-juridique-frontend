// protected/dashboard/pages/JuristeDashboard.tsx
"use client"

import { motion } from "framer-motion"
import { containerVariants } from "../utils/animations"
import { KpiGrid } from "../components/kpi/KpiGrid"
import { DossiersTable } from "../components/tables/DossiersTable"
import { TachesTable } from "../components/tables/TachesTable"
import { AlertesWidget } from "../components/widgets/AlertesWidget"
import { EvenementsWidget } from "../components/widgets/EvenementsWidget"
import { useDashboardStats } from "../../../../lib/hooks/useDashboardStats"
import { EvenementCalendrier, Audience } from "../../../../lib/types/dashboard.types"

// Fonction pour transformer les données Audience en EvenementCalendrier
const transformerAudienceEnEvenement = (audiences: Audience[]): EvenementCalendrier[] => {
  return audiences.map((audience) => ({
    id: audience.id,
    titre: `Audience - ${audience.procedure.typeProcedure}`,
    debut: audience.dateAudience,
    fin: audience.dateAudience, // Utiliser la même date pour début et fin si pas de durée spécifiée
    statut: audience.statut,
  }))
}

export function JuristeDashboard() {
  const { stats, isLoading } = useDashboardStats()

  // Transformer les audiences en événements calendrier
  const evenementsFromAudiences = stats?.audiencesAvenir 
    ? transformerAudienceEnEvenement(stats.audiencesAvenir)
    : []

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
            Vue d&apos;ensemble de vos activités juridiques
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
          title="Audiences à venir"
          data={evenementsFromAudiences}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DossiersTable
          title="Vos dossiers assignés"
          data={stats?.dossiersAssignes || []}
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