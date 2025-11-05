/**
 * ============================================
 * DASHBOARD LAYOUT
 * ============================================
 * Layout principal avec Sidebar + Topbar
 * Gestion responsive complète (mobile, tablet, desktop)
 * Adaptation automatique de l'espacement selon l'état de la sidebar
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SIDEBAR_CONFIG, TOPBAR_CONFIG, BREAKPOINTS } from '@/lib/dashboard/constants';

// ============================================
// TYPES
// ============================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < BREAKPOINTS.laptop;
      setIsMobile(mobile);
      
      // Fermer la sidebar mobile si on passe en desktop
      if (!mobile && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    // Vérification initiale
    checkScreenSize();

    // Écouter les changements de taille
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isMobileSidebarOpen]);

  // Calculer le padding left selon l'état de la sidebar (desktop uniquement)
  const getMainPaddingLeft = () => {
    if (isMobile) return 0;
    return isCollapsed ? SIDEBAR_CONFIG.width.collapsed : SIDEBAR_CONFIG.width.expanded;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main content wrapper */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: isMobile ? 0 : getMainPaddingLeft(),
        }}
      >
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          isMobile={isMobile}
        />

        {/* Main content */}
        <main
          className="p-4 lg:p-8"
          style={{
            minHeight: `calc(100vh - ${TOPBAR_CONFIG.height}px)`,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};