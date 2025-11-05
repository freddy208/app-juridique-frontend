/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * REVENUE CHART
 * ============================================
 * Graphique en aires du chiffre d'affaires
 * Utilise Recharts avec légendes et axes clairs
 * Responsive avec adaptation mobile
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DollarSign } from 'lucide-react';
import { fadeInUpVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';

// ============================================
// DONNÉES MOCK (12 derniers mois)
// ============================================

const generateRevenueData = () => {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return months.map((month, index) => ({
    mois: month,
    revenus: Math.floor(Math.random() * 50000) + 30000,
    objectif: 45000,
  }));
};

// ============================================
// TOOLTIP PERSONNALISÉ
// ============================================

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900 mb-2">
          {payload[0].payload.mois}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-[#4169e1]">
            Revenus: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-500">
            Objectif: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(payload[1].value)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const RevenueChart: React.FC = () => {
  const { isLoading } = useDashboardStats();
  const data = generateRevenueData();

  // Calculer le total
  const totalRevenue = data.reduce((sum, item) => sum + item.revenus, 0);

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-[#4169e1]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
              Chiffre d&apos;affaires
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Évolution mensuelle sur 12 mois
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total annuel</p>
          <p className="text-2xl font-bold text-[#4169e1] font-['JetBrains_Mono']">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
            }).format(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Graphique */}
      {isLoading ? (
        <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
          <p className="text-gray-400">Chargement des données...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4169e1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4169e1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="mois"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
              tickFormatter={(value) =>
                `${(value / 1000).toFixed(0)}k€`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                fontFamily: 'Inter',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenus"
              stroke="#4169e1"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name="Revenus"
            />
            <Area
              type="monotone"
              dataKey="objectif"
              stroke="#d4af37"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              name="Objectif"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};