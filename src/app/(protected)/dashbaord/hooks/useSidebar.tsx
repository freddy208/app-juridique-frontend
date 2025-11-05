"use client"

import { useState, createContext, useContext, ReactNode } from "react"

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  
  return context
}