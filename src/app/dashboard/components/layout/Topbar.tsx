/**
 * Topbar Premium - Design Juridique Sophistiqué
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
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Bouton toggle sidebar (mobile) */}
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>

          {/* Barre de recherche premium */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher un dossier, client..."
                className="w-72 rounded-xl border border-slate-300/60 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationBell />

          {/* Séparateur élégant */}
          <div className="h-8 w-px bg-slate-200"></div>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}