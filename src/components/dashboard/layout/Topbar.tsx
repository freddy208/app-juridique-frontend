/**
 * ============================================
 * TOPBAR - Barre supérieure
 * ============================================
 * Fond blanc, sticky, logo doré, avatar avec dropdown
 * Animations slide + fade pour le dropdown
 * Responsive avec ajustements mobile
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// ✅ Correct
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/useAuth';
import { dropdownVariants } from '@/lib/dashboard/animations';
import { TOPBAR_CONFIG } from '@/lib/dashboard/constants';

// ============================================
// TYPES
// ============================================

interface TopbarProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, isMobile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-20 bg-white border-b border-gray-200"
      style={{ height: TOPBAR_CONFIG.height }}
    >
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Section gauche: Menu burger (mobile) + Logo */}
        <div className="flex items-center gap-4">
          {/* Burger menu (mobile uniquement) */}
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          )}

          {/* Logo doré */}
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10 lg:h-12 lg:w-12 text-[#d4af37]" />
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-['Playfair_Display']">
                Cabinet Juridique
              </h1>
              <p className="text-xs text-gray-500">Excellence & Expertise</p>
            </div>
          </div>
        </div>

        {/* Section centrale: Barre de recherche (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier, un client, une procédure..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Section droite: Notifications + Avatar */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Bouton recherche (mobile) */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ef4444] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Avatar avec dropdown */}
            {/* Avatar avec dropdown */}
            <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <Avatar className="h-9 w-9 lg:h-10 lg:w-10">
                <AvatarFallback className="bg-gradient-to-br from-[#4169e1] to-[#d4af37] text-white font-semibold text-sm">
                    {getUserInitials()}
                </AvatarFallback>
                </Avatar>

                <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                    {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                    {user?.role?.toLowerCase()}
                </p>
                </div>
                
                <ChevronDown
                className={`hidden lg:block h-4 w-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                }`}
                />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
                {isDropdownOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 overflow-hidden"
                >
                    {/* Info utilisateur */}
                    <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                        {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-[#4169e1] bg-opacity-10 text-[#4169e1] text-xs font-medium rounded">
                        {user?.role}
                    </span>
                    </div>

                    {/* Menu items */}
                    <button
                    onClick={() => {
                        router.push('/dashboard/profil');
                        setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                    <User className="h-4 w-4" />
                    Mon Profil
                    </button>

                    <button
                    onClick={() => {
                        router.push('/dashboard/parametres');
                        setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                    <Settings className="h-4 w-4" />
                    Paramètres
                    </button>

                    <hr className="my-2 border-gray-100" />

                    <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-red-50 transition-colors"
                    >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                    </button>
                </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
      </div>
    </motion.header>
  );
};