/**
 * Menu utilisateur Premium
 * Design sophistiqué pour cabinet d'avocats
 */

"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthProvider";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-purple-50 text-purple-800 border-purple-200/60",
      DG: "bg-blue-50 text-blue-800 border-blue-200/60",
      AVOCAT: "bg-amber-50 text-amber-800 border-amber-200/60",
      SECRETAIRE: "bg-green-50 text-green-800 border-green-200/60",
      JURISTE: "bg-indigo-50 text-indigo-800 border-indigo-200/60",
      ASSISTANT: "bg-slate-50 text-slate-800 border-slate-200/60",
      STAGIAIRE: "bg-pink-50 text-pink-800 border-pink-200/60",
    };
    return colors[role] || colors.ASSISTANT;
  };

  const menuItems = [
    {
      icon: User,
      label: "Mon profil",
      href: "/dashboard/parametres/profil",
    },
    {
      icon: Settings,
      label: "Paramètres",
      href: "/dashboard/parametres",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton trigger Premium */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200",
          "hover:bg-slate-100",
          isOpen && "bg-slate-100"
        )}
      >
        {/* Avatar Premium avec dégradé */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-sm font-bold text-white shadow-md ring-2 ring-amber-500/20">
          {user.prenom?.[0] || user.email[0].toUpperCase()}
        </div>

        {/* Info user */}
        <div className="hidden text-left md:block">
          <p className="text-sm font-bold text-slate-900">
            {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.email}
          </p>
          <p className="text-xs text-slate-600 font-medium">
            {user.role || "Utilisateur"}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-600 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Menu dropdown Premium */}
      {isOpen && (
        <div className={cn(
          "absolute top-full z-50 mt-2 rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-xl",
          "right-0 w-screen max-w-[calc(100vw-2rem)]",
          "sm:w-72 sm:right-0"
        )}>
          {/* Header Premium avec info user */}
          <div className="border-b border-slate-200/60 p-4 bg-gradient-to-r from-slate-50/80 to-transparent">
            <div className="flex items-start gap-3">
              {/* Avatar large Premium */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-lg font-bold text-white shadow-lg ring-2 ring-amber-500/20">
                {user.prenom?.[0] || user.email[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {user.prenom && user.nom
                    ? `${user.prenom} ${user.nom}`
                    : user.email}
                </p>
                <p className="text-sm text-slate-600 truncate font-medium">
                  {user.email}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-lg px-2.5 py-0.5 text-xs font-bold border",
                    getRoleBadgeColor(user.role || "ASSISTANT")
                  )}
                >
                  {user.role || "Utilisateur"}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items Premium */}
          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4 text-slate-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="border-t border-slate-200/60"></div>

          {/* Déconnexion Premium */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}