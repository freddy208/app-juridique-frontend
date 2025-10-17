/**
 * Sidebar principale du dashboard
 * S'adapte dynamiquement aux permissions de l'utilisateur
 */

"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/auth/context/AuthProvider";
import { usePermissionsContext } from "@/app/auth/context/PermissionsProvider";
import { getFilteredNavigation } from "@/constants/navigation";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { user } = useAuth();
  const { hasAccess, isLoading } = usePermissionsContext();
  const pathname = usePathname();

  // Filtrer la navigation selon les permissions
  const navigation = getFilteredNavigation(hasAccess);

  // Fermer la sidebar mobile quand on change de page
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [isMobileOpen, onMobileClose, pathname]);

  // Fermer si clic sur overlay (mobile)
  const handleOverlayClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  if (isLoading) {
    return (
        <aside
        className={cn(
            "fixed left-0 top-0 h-full border-r border-gray-200 bg-white transition-all duration-300",
            // Desktop
            "hidden lg:block z-40",
            isCollapsed ? "lg:w-20" : "lg:w-72",
            // Mobile
            isMobileOpen ? "z-50 block translate-x-0 w-72" : "z-0 hidden -translate-x-full",
            "lg:!translate-x-0 lg:!block"
        )}
        >
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300",
          // Desktop
          "hidden lg:block",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          // Mobile
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full",
          "lg:!translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header avec logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4 transition-all duration-300",
              isCollapsed ? "justify-center px-2" : "justify-between"
            )}
          >
            {/* Logo + Nom */}
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 group",
                isCollapsed && "justify-center"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg transition-transform group-hover:scale-110">
                <Scale className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                    Cabinet 237
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Gestion Juridique
                  </span>
                </div>
              )}
            </Link>

            {/* Bouton toggle (desktop uniquement) */}
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Réduire la sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation scrollable */}
          <nav className="flex-1 overflow-y-auto px-3 py-6">
            {navigation.map((section) => (
              <SidebarSection
                key={section.id}
                label={section.label}
                isCollapsed={isCollapsed}
              >
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                    isCollapsed={isCollapsed}
                    badge={item.badge}
                    description={item.description}
                  />
                ))}
              </SidebarSection>
            ))}
          </nav>

          {/* Footer avec info user */}
          <div
            className={cn(
              "border-t border-gray-200 dark:border-gray-800 p-4",
              isCollapsed && "p-2"
            )}
          >
            {isCollapsed ? (
              // Mode collapsed : juste l'avatar
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-md">
                  {user?.prenom?.[0] || user?.email[0].toUpperCase()}
                </div>
                {/* Bouton expand */}
                <button
                  onClick={onToggle}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Agrandir la sidebar"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            ) : (
              // Mode expanded : infos complètes
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-md">
                  {user?.prenom?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.prenom && user?.nom
                      ? `${user.prenom} ${user.nom}`
                      : user?.email}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || "Utilisateur"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}