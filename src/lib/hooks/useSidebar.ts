/**
 * Hook pour gérer l'état de la sidebar
 * Gère l'ouverture/fermeture et la persistance
 */

import { useState, useEffect } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function useSidebar() {
  // État initial depuis localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored === "true";
  });

  // Sauvegarder l'état dans localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const toggle = () => setIsCollapsed((prev) => !prev);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);

  return {
    isCollapsed,
    toggle,
    collapse,
    expand,
  };
}