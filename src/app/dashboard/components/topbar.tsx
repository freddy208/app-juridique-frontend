// ============================================
// 3. Topbar.tsx - Barre supérieure
// ============================================
"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Settings,
  Menu
} from "lucide-react";
import Breadcrumb from "./breadcrumb";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Notifications mockées
  const notifications = [
    { id: 1, title: "Nouvelle audience", message: "Dossier #2024-001 - Demain 10h", time: "Il y a 5 min", unread: true },
    { id: 2, title: "Document signé", message: "Contrat_Client_Mbida.pdf", time: "Il y a 1h", unread: true },
    { id: 3, title: "Tâche assignée", message: "Préparer conclusions pour lundi", time: "Il y a 2h", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Left - Breadcrumb */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <Breadcrumb />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Recherche globale */}
          <button className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Search className="w-4 h-4" />
            <span className="text-sm">Rechercher...</span>
            <kbd className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">⌘K</kbd>
          </button>

          {/* Recherche mobile */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Dropdown notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Notifications
                    </h3>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                      {unreadCount} nouvelles
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer ${
                        notif.unread ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {notif.time}
                          </p>
                        </div>
                        {notif.unread && (
                          <div className="w-2 h-2 bg-amber-600 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-amber-700 dark:text-amber-600 hover:text-amber-800 dark:hover:text-amber-500 font-medium">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profil utilisateur */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white font-semibold text-sm">
                ME
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Maître Essomba
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avocat
                </p>
              </div>
            </button>

            {/* Dropdown profil */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Maître Essomba
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    avocat@cabinet237.cm
                  </p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Mon profil</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Paramètres</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
