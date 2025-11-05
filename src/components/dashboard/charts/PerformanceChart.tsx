/**
 * ============================================
 * PERFORMANCE CHART
 * ============================================
 * Graphique radar de la performance des avocats
 * Affiche le chiffre d'affaires par avocat
 * Utilise Recharts avec design moderne
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Users } from 'lucide-react';
import { fadeInUpVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';

// ============================================
// DONNÉES MOCK
// ============================================

const generatePerformanceData = () => {
  const avocats = [
    'Me Dupont',
    'Me Martin',
    'Me Bernard',
    'Me Dubois',
    'Me Laurent',
  ];

  return avocats.map((nom) => ({
    avocat: nom,
    performance: Math.floor(Math.random() * 40) + 60, // Entre 60 et 100
  }));
};

// ============================================
// TOOLTIP PERSONNALISÉ
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900 mb-1">
          {payload[0].payload.avocat}
        </p>
        <p className="text-sm text-[#4169e1]">
          Performance: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const PerformanceChart: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();
  
  // Utiliser les données réelles si disponibles, sinon mock
  const data = stats?.performancesAvocats
    ? stats.performancesAvocats.map((avocat) => ({
        avocat: `${avocat.prenom} ${avocat.nom}`,
        performance: Math.min(100, (avocat.chiffreAffaires / 1000) * 10), // Normaliser à 100
      }))
    : generatePerformanceData();

  const moyennePerformance = Math.round(
    data.reduce((sum, item) => sum + item.performance, 0) / data.length
  );

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gold-100 rounded-lg">
              <Users className="h-5 w-5 text-[#d4af37]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
              Performance des avocats
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Indicateurs de performance globale
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Moyenne</p>
          <p className="text-2xl font-bold text-[#d4af37] font-['JetBrains_Mono']">
            {moyennePerformance}%
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
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="avocat"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="#6b7280"
              style={{ fontSize: '11px', fontFamily: 'Inter' }}
            />
            <Radar
              name="Performance"
              dataKey="performance"
              stroke="#4169e1"
              fill="#4169e1"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                fontFamily: 'Inter',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};