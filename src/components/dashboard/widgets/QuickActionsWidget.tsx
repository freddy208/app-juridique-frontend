/**
 * ============================================
 * QUICK ACTIONS WIDGET
 * ============================================
 * Widget d'actions rapides pour les tâches courantes
 * Boutons avec icônes et animations hover
 * Design moderne et intuitif
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Scale,
  BookOpen,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fadeInUpVariants } from '@/lib/dashboard/animations';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  route: string;
}

// ============================================
// ACTIONS RAPIDES
// ============================================

const quickActions: QuickAction[] = [
  {
    title: 'Nouveau Dossier',
    description: 'Créer un nouveau dossier juridique',
    icon: FileText,
    color: 'text-[#4169e1]',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    route: '/dashboard/dossiers/nouveau',
  },
  {
    title: 'Nouveau Client',
    description: 'Ajouter un nouveau client',
    icon: Users,
    color: 'text-[#d4af37]',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    route: '/dashboard/clients/nouveau',
  },
  {
    title: 'Nouvelle Audience',
    description: 'Planifier une audience',
    icon: Calendar,
    color: 'text-[#8b0000]',
    bgColor: 'bg-red-50 hover:bg-red-100',
    route: '/dashboard/audiences/nouveau',
  },
  {
    title: 'Nouvelle Facture',
    description: 'Créer une facture',
    icon: DollarSign,
    color: 'text-[#10b981]',
    bgColor: 'bg-green-50 hover:bg-green-100',
    route: '/dashboard/facturation/nouveau',
  },
  {
    title: 'Nouvelle Procédure',
    description: 'Démarrer une procédure',
    icon: Scale,
    color: 'text-[#f59e0b]',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    route: '/dashboard/procedures/nouveau',
  },
  {
    title: 'Jurisprudence',
    description: 'Rechercher une jurisprudence',
    icon: BookOpen,
    color: 'text-[#3b82f6]',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    route: '/dashboard/jurisprudence',
  },
  {
    title: 'Correspondance',
    description: 'Rédiger une correspondance',
    icon: Mail,
    color: 'text-[#ef4444]',
    bgColor: 'bg-red-50 hover:bg-red-100',
    route: '/dashboard/correspondances/nouveau',
  },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const QuickActionsWidget: React.FC = () => {
  const router = useRouter();

  const handleAction = (route: string) => {
    router.push(route);
  };

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.9 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="h-5 w-5 text-[#10b981]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
              Actions rapides
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Accès rapide aux fonctions courantes
          </p>
        </div>
      </div>

      {/* Grille d'actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.route)}
              className={cn(
                'p-4 rounded-lg border border-gray-200 text-left transition-all',
                action.bgColor
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg bg-white', action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};