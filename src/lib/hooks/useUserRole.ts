// src/hooks/useUserRole.ts

import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api/client"
import { RoleUtilisateur } from "../types/dashboard.types"

export const useUserRole = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/profile")
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const role = user?.role as RoleUtilisateur

  const isAdmin = role === RoleUtilisateur.ADMIN || role === RoleUtilisateur.DG
  const isAvocat = role === RoleUtilisateur.AVOCAT
  const isAssistant = role === RoleUtilisateur.SECRETAIRE || role === RoleUtilisateur.ASSISTANT
  const isJuriste = role === RoleUtilisateur.JURISTE
  const isStagiaire = role === RoleUtilisateur.STAGIAIRE

  return {
    user,
    role,
    isLoading,
    error,
    isAdmin,
    isAvocat,
    isAssistant,
    isJuriste,
    isStagiaire,
  }
}