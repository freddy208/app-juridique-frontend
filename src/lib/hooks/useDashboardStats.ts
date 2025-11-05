// src/lib/hooks/useDashboardStats.ts

import { useMemo } from "react"
import { useDashboard } from "./useDashboard"

export const useDashboardStats = () => {
  const { dashboardData, isLoading, error } = useDashboard()

  const stats = useMemo(() => {
    if (!dashboardData) return null

    return {
      stats: dashboardData.stats,
      chiffreAffaires: dashboardData.chiffreAffaires,
      dossiersParType: dashboardData.dossiersParType,
      performancesAvocats: dashboardData.performancesAvocats,
      alertesRecentes: dashboardData.alertesRecentes,
      evenementsAvenir: dashboardData.evenementsAvenir,
      facturesEnAttente: dashboardData.facturesEnAttente,
      dossiersProchesEcheance: dashboardData.dossiersProchesEcheance,
      tachesAssignees: dashboardData.tachesAssignees,
      dossiersRecentes: dashboardData.dossiersRecentes,
      facturesRecentes: dashboardData.facturesRecentes,
      correspondancesEnAttente: dashboardData.correspondancesEnAttente,
      proceduresEnCours: dashboardData.proceduresEnCours,
      audiencesAvenir: dashboardData.audiencesAvenir,
      jurisprudencesRecentes: dashboardData.jurisprudencesRecentes,
      dossiersAssignes: dashboardData.dossiersAssignes,
      documentsRecentes: dashboardData.documentsRecentes,
      alertes: dashboardData.alertes,
    }
  }, [dashboardData])

  return {
    stats,
    isLoading,
    error,
  }
}