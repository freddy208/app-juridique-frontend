// src/app/(protected)/layout.tsx

"use client" // Indispensable car on utilise un Provider de contexte

import { SidebarProvider } from "./dashboard/hooks/useSidebar"

// Ce layout enveloppe toutes les pages du groupe de routes (protected)
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // On fournit le contexte à tous les enfants (dashboard, parametres, etc.)
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}