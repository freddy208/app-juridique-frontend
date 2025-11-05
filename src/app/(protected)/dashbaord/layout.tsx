// protected/dashboard/layout/DashboardLayout.tsx
"use client"

import { motion } from "framer-motion"
import { Sidebar } from "./components/sidebar/Sidebar"
import { Topbar } from "./components/topbar/Topbar"
import { useSidebar } from "./hooks/useSidebar"
import { sidebarVariants, contentVariants } from "./utils/animations"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:relative z-30 h-full"
      >
        <Sidebar />
      </motion.div>
      
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <motion.div
        variants={contentVariants}
        animate={isOpen ? "sidebarOpen" : "sidebarClosed"}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </motion.div>
    </div>
  )
}