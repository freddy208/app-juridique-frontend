/**
 * Menu utilisateur dans la topbar
 * Affiche profil, paramètres, déconnexion
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

  // Fermer le menu si clic en dehors
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

  // Badge rôle avec couleur
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      DG: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      AVOCAT: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      SECRETAIRE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      JURISTE: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      ASSISTANT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      STAGIAIRE: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
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
      {/* Bouton trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isOpen && "bg-gray-100 dark:bg-gray-800"
        )}
      >
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-md">
          {user.prenom?.[0] || user.email[0].toUpperCase()}
        </div>

        {/* Info user */}
        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.role || "Utilisateur"}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
          {/* Header avec info user */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start gap-3">
              {/* Avatar large */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-lg font-bold text-white shadow-lg">
                {user.prenom?.[0] || user.email[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.prenom && user.nom
                    ? `${user.prenom} ${user.nom}`
                    : user.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <span
                  className={cn(
                    "mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                    getRoleBadgeColor(user.role || "ASSISTANT")
                  )}
                >
                  {user.role || "Utilisateur"}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
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
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Déconnexion */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
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