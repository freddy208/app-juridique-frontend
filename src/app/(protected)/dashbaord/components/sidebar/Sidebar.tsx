// protected/dashboard/components/sidebar/Sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Scale,
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Building,
  CreditCard,
  Mail,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserRole } from "../../../../../lib/hooks/useUserRole"
import { useSidebar } from "../..//hooks/useSidebar"
import { SidebarItem } from "./SidebarItem"

const navigationItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Dossiers",
    href: "/dossiers",
    icon: FolderOpen,
    subItems: [
      { title: "Tous les dossiers", href: "/dossiers" },
      { title: "Mes dossiers", href: "/dossiers/mes-dossiers" },
      { title: "Créer un dossier", href: "/dossiers/nouveau" },
    ],
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
    subItems: [
      { title: "Tous les clients", href: "/clients" },
      { title: "Ajouter un client", href: "/clients/nouveau" },
    ],
  },
  {
    title: "Calendrier",
    href: "/calendrier",
    icon: Calendar,
  },
  {
    title: "Facturation",
    href: "/facturation",
    icon: CreditCard,
    subItems: [
      { title: "Factures", href: "/facturation/factures" },
      { title: "Devis", href: "/facturation/devis" },
      { title: "Rapports", href: "/facturation/rapports" },
    ],
  },
  {
    title: "Correspondance",
    href: "/correspondance",
    icon: Mail,
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: BarChart3,
  },
  {
    title: "Utilisateurs",
    href: "/utilisateurs",
    icon: Building,
    requiredRole: ["ADMIN", "DG"],
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { role } = useUserRole()
  const { isOpen, toggleSidebar } = useSidebar()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return item.requiredRole.includes(role)
  })

  return (
    <div
      className={cn(
        "bg-royal-blue-900 text-white flex flex-col h-full transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-royal-blue-800">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-gold-500" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold text-gold-500"
            >
              JurisPro
            </motion.span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-royal-blue-800 p-1 rounded-md"
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNavigationItems.map((item) => (
          <div key={item.title}>
            <SidebarItem
              item={item}
              pathname={pathname}
              isOpen={isOpen}
              isExpanded={expandedItems.includes(item.title)}
              toggleExpanded={() => toggleExpanded(item.title)}
            />
            {item.subItems && isOpen && expandedItems.includes(item.title) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pl-10 space-y-1"
              >
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "block px-3 py-2 text-sm rounded-md transition-colors",
                      pathname === subItem.href
                        ? "bg-royal-blue-700 text-white"
                        : "text-royal-blue-200 hover:bg-royal-blue-800 hover:text-white"
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-royal-blue-800">
        <Link
          href="/logout"
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
            "text-royal-blue-200 hover:bg-royal-blue-800 hover:text-white"
          )}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && (
            <span className="ml-3">Déconnexion</span>
          )}
        </Link>
      </div>
    </div>
  )
}