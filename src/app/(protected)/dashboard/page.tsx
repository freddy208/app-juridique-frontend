// protected/dashboard/page.tsx
"use client"

import DashboardLayout  from "./layout"
import { useUserRole } from "../../../lib/hooks/useUserRole"
import {
  AdminDashboard,
} from "./pages/AdminDashboard" 
import {
  AvocatDashboard,
} from "./pages/AvocatDashboard" 
import {
  AssistantDashboard,
} from "./pages/AssistantDashboard" 
import {
  StagiaireDashboard,
} from "./pages/StagiaireDashboard" 
import {
  JuristeDashboard,
} from "./pages/JuristeDashboard" 
import { RoleUtilisateur } from "../../../lib/types/dashboard.types"

export default function Dashboard() {
  const { role, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue-600"></div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (role) {
      case RoleUtilisateur.ADMIN:
      case RoleUtilisateur.DG:
        return <AdminDashboard />
      case RoleUtilisateur.AVOCAT:
        return <AvocatDashboard />
      case RoleUtilisateur.SECRETAIRE:
      case RoleUtilisateur.ASSISTANT:
        return <AssistantDashboard />
      case RoleUtilisateur.JURISTE:
        return <JuristeDashboard />
      case RoleUtilisateur.STAGIAIRE:
        return <StagiaireDashboard />
      default:
        return <div>Role non reconnu</div>
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}