// src/hooks/useDashboard.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardService } from "../../lib/api/dashboard.service"
import { DashboardResponse } from "../types/dashboard.types"

export const useDashboard = () => {
  const queryClient = useQueryClient()

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  const invalidateDashboardMutation = useMutation({
    mutationFn: dashboardService.invalidateDashboardCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
    invalidateCache: invalidateDashboardMutation.mutate,
    isInvalidating: invalidateDashboardMutation.isPending,
  }
}