/**
 * Cloche de notifications dans la topbar
 * Design harmonieux avec palette professionnelle
 */

"use client";
import { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "tache",
    title: "Nouvelle tâche assignée",
    message: "Préparer mémoire en défense - Dossier #2024-089",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: "2",
    type: "audience",
    title: "Audience demain",
    message: "TPI Douala - Salle 3 à 14h30",
    time: "Il y a 1h",
    read: false,
  },
  {
    id: "3",
    type: "facture",
    title: "Facture impayée",
    message: "Facture #2024-003 en retard de 5 jours",
    time: "Il y a 2h",
    read: true,
  },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tache: "bg-blue-50 text-blue-800 border-blue-100",
      audience: "bg-purple-50 text-purple-800 border-purple-100",
      facture: "bg-red-50 text-red-800 border-red-100",
      message: "bg-green-50 text-green-800 border-green-100",
    };
    return colors[type] || colors.message;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative rounded-lg p-2 transition-colors",
          "hover:bg-gray-100",
          isOpen && "bg-gray-100"
        )}
      >
        <Bell className="h-5 w-5 text-gray-700" />

        {/* Badge count */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay mobile uniquement */}
          <div 
            className="fixed inset-0 z-40 md:hidden bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className={cn(
            "absolute z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg",
            // Mobile : centré en bas de l'écran
            "fixed left-4 right-4 bottom-auto top-auto md:absolute",
            // Desktop : position normale à droite
            "md:left-auto md:right-0 md:top-full md:w-96"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    ({unreadCount} non {unreadCount > 1 ? "lues" : "lue"})
                  </span>
                )}
              </h3>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors"
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            {/* Liste notifications */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-600">
                    Aucune notification
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative border-b border-gray-100 p-4 transition-colors hover:bg-gray-50",
                      !notification.read && "bg-amber-50/30"
                    )}
                  >
                    {/* Indicateur non lu */}
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-600"></div>
                    )}

                    <div className="ml-2 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Type badge */}
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                            getTypeColor(notification.type)
                          )}
                        >
                          {notification.type}
                        </span>

                        {/* Titre */}
                        <h4 className="mt-1.5 font-semibold text-sm text-gray-900">
                          {notification.title}
                        </h4>

                        {/* Message */}
                        <p className="mt-0.5 text-sm text-gray-600">
                          {notification.message}
                        </p>

                        {/* Time */}
                        <p className="mt-1.5 text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded-lg p-1.5 hover:bg-gray-200 transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="rounded-lg p-1.5 hover:bg-red-100 transition-colors"
                          title="Supprimer"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <button className="w-full rounded-lg py-2 text-sm font-medium text-amber-700 hover:bg-amber-100/50 transition-colors">
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}