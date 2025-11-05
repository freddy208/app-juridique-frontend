/**
 * ============================================
 * SIDEBAR - Navigation principale
 * ============================================
 * Sidebar bleu royal avec navigation icônes + texte
 * États: expanded/collapsed desktop, slide in/out mobile
 * Glassmorphism subtil, animations Framer Motion fluides
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Scale,
  Calendar,
  DollarSign,
  Briefcase,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  sidebarVariants,
  sidebarItemVariants,
  sidebarMenuVariants,
  mobileSidebarVariants,
  overlayVariants,
} from '@/lib/dashboard/animations';

// ============================================
// TYPES
// ============================================

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

// ============================================
// NAVIGATION ITEMS
// ============================================

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Clients',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    name: 'Dossiers',
    href: '/dashboard/dossiers',
    icon: FileText,
    badge: 12,
  },
  {
    name: 'Procédures',
    href: '/dashboard/procedures',
    icon: Scale,
  },
  {
    name: 'Audiences',
    href: '/dashboard/audiences',
    icon: Calendar,
  },
  {
    name: 'Facturation',
    href: '/dashboard/facturation',
    icon: DollarSign,
  },
  {
    name: 'Juristes',
    href: '/dashboard/juristes',
    icon: Briefcase,
  },
  {
    name: 'Jurisprudence',
    href: '/dashboard/jurisprudence',
    icon: BookOpen,
  },
  {
    name: 'Paramètres',
    href: '/dashboard/parametres',
    icon: Settings,
  },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Toggle collapse (desktop uniquement)
  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Vérifier si l'item est actif
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Rendu desktop
  if (!isMobile) {
    return (
      <motion.aside
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-screen bg-[#4169e1] text-white z-30 flex flex-col"
        style={{
          backdropFilter: 'blur(8px)',
          boxShadow: '4px 0 24px rgba(65, 105, 225, 0.15)',
        }}
      >
        {/* Header avec logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <Scale className="h-8 w-8 text-[#d4af37]" />
                <div>
                  <h1 className="text-lg font-bold font-['Playfair_Display']">
                    Cabinet Juridique
                  </h1>
                  <p className="text-xs text-white/70">Excellence & Droit</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <motion.nav
          variants={sidebarMenuVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-white/20"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <motion.div key={item.href} variants={sidebarItemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200',
                    'hover:bg-white/10 hover:translate-x-1',
                    active && 'bg-white/15 shadow-lg',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-[#d4af37]')} />
                  
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between flex-1 overflow-hidden"
                      >
                        <span className={cn('text-sm font-medium', active && 'text-[#d4af37]')}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="bg-[#d4af37] text-[#4169e1] text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {!isCollapsed && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-white/80 mb-1">Version 2.0.0</p>
              <p className="text-xs text-white/60">© 2025 Cabinet Juridique</p>
            </div>
          )}
        </div>
      </motion.aside>
    );
  }

  // Rendu mobile avec overlay
  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileSidebarVariants}
            className="fixed left-0 top-0 h-screen w-[280px] bg-[#4169e1] text-white z-50 flex flex-col"
            style={{
              backdropFilter: 'blur(8px)',
              boxShadow: '4px 0 24px rgba(65, 105, 225, 0.15)',
            }}
          >
            {/* Header avec bouton fermer */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Scale className="h-8 w-8 text-[#d4af37]" />
                <div>
                  <h1 className="text-lg font-bold font-['Playfair_Display']">
                    Cabinet Juridique
                  </h1>
                  <p className="text-xs text-white/70">Excellence & Droit</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200',
                      'hover:bg-white/10',
                      active && 'bg-white/15 shadow-lg'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-[#d4af37]')} />
                    <div className="flex items-center justify-between flex-1">
                      <span className={cn('text-sm font-medium', active && 'text-[#d4af37]')}>
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="bg-[#d4af37] text-[#4169e1] text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs text-white/80 mb-1">Version 2.0.0</p>
                <p className="text-xs text-white/60">© 2025 Cabinet Juridique</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};