// ============================================
// 2. Sidebar.tsx - Navigation latérale
// ============================================
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  CheckSquare,
  Calendar,
  MessageSquare,
  Receipt,
  UserCog,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Bell
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Menu items selon le rôle (à adapter dynamiquement)
const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: "Tableau de bord", 
    href: "/dashboard",
    badge: null
  },
  { 
    icon: FolderOpen, 
    label: "Dossiers", 
    href: "/dashboard/dossiers",
    badge: "12"
  },
  { 
    icon: Users, 
    label: "Clients", 
    href: "/dashboard/clients",
    badge: null
  },
  { 
    icon: FileText, 
    label: "Documents", 
    href: "/dashboard/documents",
    badge: "3"
  },
  { 
    icon: CheckSquare, 
    label: "Tâches", 
    href: "/dashboard/taches",
    badge: "8"
  },
  { 
    icon: Calendar, 
    label: "Calendrier", 
    href: "/dashboard/calendrier",
    badge: null
  },
  { 
    icon: MessageSquare, 
    label: "Messages", 
    href: "/dashboard/chat",
    badge: "5"
  },
  { 
    icon: Receipt, 
    label: "Factures", 
    href: "/dashboard/factures",
    badge: null
  },
  { 
    icon: UserCog, 
    label: "Équipe", 
    href: "/dashboard/equipe",
    badge: null,
    roles: ["ADMIN", "DG"] // Visible seulement pour certains rôles
  },
  { 
    icon: BarChart3, 
    label: "Rapports", 
    href: "/dashboard/rapports",
    badge: null,
    roles: ["ADMIN", "DG", "AVOCAT"]
  },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [userRole] = useState("AVOCAT"); // À remplacer par le vrai rôle du contexte

  // Filtrer les items selon le rôle
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        } hidden lg:block`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header - Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Scale className="w-8 h-8 text-amber-700 dark:text-amber-600 flex-shrink-0" strokeWidth={2.5} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden"
                  >
                    <span className="font-serif font-bold text-gray-900 dark:text-gray-100 text-lg whitespace-nowrap">
                      Cabinet 237
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
            
            {/* Toggle Button */}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-1">
              {filteredMenuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-600"
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "" : "group-hover:scale-110 transition-transform"
                      }`} />
                      
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-medium overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {!collapsed && item.badge && (
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Badge collapsed */}
                      {collapsed && item.badge && (
                        <span className="absolute right-1 top-1 w-2 h-2 bg-amber-600 rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Séparateur */}
          <div className="border-t border-gray-200 dark:border-gray-800"></div>

          {/* Footer - Paramètres & Profil */}
          <div className="p-3 space-y-1">
            <Link
              href="/dashboard/parametres"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium overflow-hidden whitespace-nowrap"
                  >
                    Paramètres
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Profil utilisateur */}
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
              collapsed ? "justify-center" : ""
            }`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white font-semibold flex-shrink-0">
                ME
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      Maître Essomba
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Avocat
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!collapsed && (
                  <motion.button
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-gray-400 hover:text-amber-700 dark:hover:text-amber-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile - Overlay */}
      {/* À implémenter avec un état mobile séparé */}
    </>
  );
}

