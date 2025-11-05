// protected/dashboard/components/topbar/UserDropdown.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useUserRole } from "../../../../../lib/hooks/useUserRole"
import { dropdownVariants } from "../../utils/animations"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useUserRole()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-royal-blue-600 flex items-center justify-center text-white font-semibold">
          {user?.prenom?.charAt(0) || "U"}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
                {user?.prenom} {user?.nom}
              </div>
              <a
                href="/profile"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <User className="h-4 w-4 mr-2" />
                Mon Profil
              </a>
              <a
                href="/settings"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </a>
              <a
                href="/logout"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}