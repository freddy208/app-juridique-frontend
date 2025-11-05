/**
 * ============================================
 * KPI CARD
 * ============================================
 * Carte d'indicateur de performance avec:
 * - Animation d'entrée fluide
 * - État de chargement (skeleton)
 * - Icône, titre, valeur, tendance
 * - Hover effect avec lift
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cardVariants, hoverLift, pulseVariants } from '@/lib/dashboard/animations';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'gold' | 'green' | 'orange' | 'red' | 'burgundy';
  isLoading?: boolean;
  delay?: number;
}

// ============================================
// CONFIGURATION COULEURS
// ============================================

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-[#4169e1]',
    iconBg: 'bg-blue-100',
  },
  gold: {
    bg: 'bg-yellow-50',
    icon: 'text-[#d4af37]',
    iconBg: 'bg-yellow-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-[#10b981]',
    iconBg: 'bg-green-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-[#f59e0b]',
    iconBg: 'bg-orange-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-[#ef4444]',
    iconBg: 'bg-red-100',
  },
  burgundy: {
    bg: 'bg-red-50',
    icon: 'text-[#8b0000]',
    iconBg: 'bg-red-100',
  },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  isLoading = false,
  delay = 0,
}) => {
  const colors = colorConfig[color];

  // État de chargement (skeleton)
  if (isLoading) {
    return (
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={cn('rounded-lg p-3', colors.iconBg)}>
            <div className="h-6 w-6 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverLift}
      transition={{ delay }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer"
    >
      {/* Header: Icône + Tendance */}
      <div className="flex items-start justify-between mb-4">
        {/* Icône */}
        <div className={cn('rounded-lg p-3', colors.iconBg)}>
          <Icon className={cn('h-6 w-6', colors.icon)} />
        </div>

        {/* Tendance */}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold',
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Titre */}
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      {/* Valeur */}
      <p className="text-3xl font-bold text-gray-900 font-['JetBrains_Mono']">
        {value}
      </p>
    </motion.div>
  );
};