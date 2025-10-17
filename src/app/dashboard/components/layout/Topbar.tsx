/**
 * Barre du haut (topbar) du dashboard
 * Design harmonieux avec palette professionnelle
 */
"use client";
import { Menu, Search } from "lucide-react";
import UserMenu from "../shared/UserMenu";
import NotificationBell from "../shared/NotificationBell";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Bouton toggle sidebar (mobile) */}
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          {/* Barre de recherche */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un dossier, client..."
                className="w-64 rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationBell />

          {/* Séparateur */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}