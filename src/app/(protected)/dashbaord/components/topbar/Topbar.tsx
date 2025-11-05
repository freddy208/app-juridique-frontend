// protected/dashboard/components/topbar/Topbar.tsx
"use client"

import { Bell, Search, Menu, Scale } from "lucide-react"
import { motion } from "framer-motion"
import { useSidebar } from "../../hooks/useSidebar"
import { UserDropdown } from "./UserDropdown"
import { topbarVariants } from "../../utils/animations"

export function Topbar() {
  const { toggleSidebar } = useSidebar()

  return (
    <motion.header
      variants={topbarVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-10"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex items-center space-x-2 text-2xl font-bold text-royal-blue-900">
          <Scale className="h-8 w-8 text-gold-500" />
          <span className="text-gold-500">JurisPro</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <UserDropdown />
      </div>
    </motion.header>
  )
}