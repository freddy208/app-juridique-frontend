/**
 * Sidebar Premium - Design Juridique Sophistiqué
 * Inspiration : Cabinets d'avocats de luxe
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

  const navigation = getFilteredNavigation(hasAccess);

  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [isMobileOpen, onMobileClose, pathname]);

  const handleOverlayClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  if (isLoading) {
    return (
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full border-r border-slate-800 bg-slate-900 transition-all duration-300 hidden lg:block",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar Premium */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full transition-all duration-300",
          // Style Premium : Fond bleu marine foncé
          "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
          "border-r border-slate-800/50",
          // Desktop
          "hidden lg:block lg:z-40",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          // Mobile
          "lg:translate-x-0",
          isMobileOpen ? "z-50 block translate-x-0 w-72" : "hidden -translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header Premium avec logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-slate-800/50 px-4 transition-all duration-300",
              "bg-gradient-to-r from-slate-900 to-slate-800/50",
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
              {/* Logo or avec effet luxe */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-lg shadow-amber-900/30 transition-transform group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-amber-900/40">
                <Scale className="h-6 w-6 text-white drop-shadow-md" strokeWidth={2.5} />
                {/* Effet brillance */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-serif font-bold text-white tracking-tight">
                    Cabinet 237
                  </span>
                  <span className="text-xs text-slate-400 font-medium tracking-wide">
                    Gestion Juridique
                  </span>
                </div>
              )}
            </Link>

            {/* Bouton toggle premium */}
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600 transition-all"
                title="Réduire la sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Navigation scrollable avec style premium */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
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

          {/* Footer Premium avec info user */}
          <div
            className={cn(
              "border-t border-slate-800/50 p-4",
              "bg-gradient-to-r from-slate-900 to-slate-800/50",
              isCollapsed && "p-2"
            )}
          >
            {isCollapsed ? (
              // Mode collapsed
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-md ring-2 ring-amber-500/20">
                  {user?.prenom?.[0] || user?.email[0].toUpperCase()}
                </div>
                {/* Bouton expand */}
                <button
                  onClick={onToggle}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 transition-all"
                  title="Agrandir la sidebar"
                >
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            ) : (
              // Mode expanded avec style premium
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-md ring-2 ring-amber-500/20">
                  {user?.prenom?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {user?.prenom && user?.nom
                      ? `${user.prenom} ${user.nom}`
                      : user?.email}
                  </p>
                  <p className="truncate text-xs text-slate-400">
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