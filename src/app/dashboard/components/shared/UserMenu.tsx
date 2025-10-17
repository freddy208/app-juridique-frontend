/**
 * Menu utilisateur dans la topbar
 * Design harmonieux avec palette professionnelle
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
      ADMIN: "bg-purple-50 text-purple-800 border-purple-200",
      DG: "bg-blue-50 text-blue-800 border-blue-200",
      AVOCAT: "bg-amber-50 text-amber-800 border-amber-200",
      SECRETAIRE: "bg-green-50 text-green-800 border-green-200",
      JURISTE: "bg-indigo-50 text-indigo-800 border-indigo-200",
      ASSISTANT: "bg-gray-50 text-gray-800 border-gray-200",
      STAGIAIRE: "bg-pink-50 text-pink-800 border-pink-200",
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
          "hover:bg-gray-100",
          isOpen && "bg-gray-100"
        )}
      >
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-sm font-bold text-white shadow-md">
          {user.prenom?.[0] || user.email[0].toUpperCase()}
        </div>

        {/* Info user */}
        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-gray-900">
            {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.email}
          </p>
          <p className="text-xs text-gray-600">
            {user.role || "Utilisateur"}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-600 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg",
          // Mobile : pleine largeur
          "right-0 w-screen max-w-[calc(100vw-2rem)]",
          // Desktop : taille fixe
          "sm:w-72 sm:right-0"
        )}>
          {/* Header avec info user */}
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-start gap-3">
              {/* Avatar large */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-lg font-bold text-white shadow-md">
                {user.prenom?.[0] || user.email[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.prenom && user.nom
                    ? `${user.prenom} ${user.nom}`
                    : user.email}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {user.email}
                </p>
                <span
                  className={cn(
                    "mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold border",
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
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200"></div>

          {/* Déconnexion */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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