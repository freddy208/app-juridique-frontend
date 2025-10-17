/**
 * Cloche de notifications Premium
 * Design sophistiqué pour cabinet d'avocats
 */

"use client";
import { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      tache: "bg-blue-50 text-blue-800 border-blue-200/60",
      audience: "bg-purple-50 text-purple-800 border-purple-200/60",
      facture: "bg-red-50 text-red-800 border-red-200/60",
      message: "bg-green-50 text-green-800 border-green-200/60",
    };
    return colors[type] || colors.message;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton cloche Premium */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative rounded-xl p-2 transition-all duration-200",
          "hover:bg-slate-100",
          isOpen && "bg-slate-100"
        )}
      >
        <Bell className="h-5 w-5 text-slate-700" />

        {/* Badge count avec animation */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 px-1 text-xs font-bold text-white shadow-lg shadow-red-500/30 ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Premium */}
      {isOpen && (
        <>
          {/* Overlay mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Premium */}
          <div className={cn(
            "absolute z-50 mt-2 rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-xl",
            "fixed left-4 right-4 bottom-auto top-auto md:absolute",
            "md:left-auto md:right-0 md:top-full md:w-96"
          )}>
            {/* Header Premium */}
            <div className="flex items-center justify-between border-b border-slate-200/60 p-4 bg-gradient-to-r from-slate-50/80 to-transparent">
              <h3 className="font-bold text-slate-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-slate-600 font-normal">
                    ({unreadCount} non {unreadCount > 1 ? "lues" : "lue"})
                  </span>
                )}
              </h3>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors px-2 py-1 rounded-lg hover:bg-amber-50"
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            {/* Liste notifications Premium */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-600 font-medium">
                    Aucune notification
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative border-b border-slate-100 p-4 transition-all",
                      !notification.read && "bg-amber-50/40 hover:bg-amber-50/60",
                      notification.read && "hover:bg-slate-50"
                    )}
                  >
                    {/* Indicateur non lu Premium */}
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 animate-pulse"></div>
                    )}

                    <div className="ml-2 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Type badge Premium */}
                        <span
                          className={cn(
                            "inline-block rounded-lg px-2.5 py-0.5 text-xs font-bold border",
                            getTypeColor(notification.type)
                          )}
                        >
                          {notification.type}
                        </span>

                        {/* Titre */}
                        <h4 className="mt-2 font-bold text-sm text-slate-900">
                          {notification.title}
                        </h4>

                        {/* Message */}
                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>

                        {/* Time */}
                        <p className="mt-2 text-xs text-slate-500 font-medium">
                          {notification.time}
                        </p>
                      </div>

                      {/* Actions Premium */}
                      <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded-lg p-2 hover:bg-slate-200/60 transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4 text-slate-700" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="rounded-lg p-2 hover:bg-red-100 transition-colors"
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

            {/* Footer Premium */}
            {notifications.length > 0 && (
              <div className="border-t border-slate-200/60 p-3 bg-gradient-to-r from-slate-50/50 to-transparent">
                <button className="w-full rounded-xl py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
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