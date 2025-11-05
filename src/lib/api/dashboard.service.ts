// src/lib/api/dashboard.service.ts

import apiClient from "./client"
import { dashboardEndpoints } from "./endpoints"
import { DashboardResponse } from "../types/dashboard.types"

export const dashboardService = {
  /**
   * Récupère les données du dashboard pour l'utilisateur connecté
   */
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.get(dashboardEndpoints.get)
    return response.data
  },

  /**
   * Invalide le cache du dashboard pour l'utilisateur connecté
   */
  async invalidateDashboardCache(): Promise<void> {
    await apiClient.post(dashboardEndpoints.invalidateCache)
  },
}