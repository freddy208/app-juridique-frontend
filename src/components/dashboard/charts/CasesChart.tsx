/**
 * ============================================
 * CASES CHART
 * ============================================
 * Graphique en barres de la répartition des dossiers par type
 * Utilise Recharts avec couleurs distinctes
 * Responsive avec adaptation mobile
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { FileText } from 'lucide-react';
import { fadeInUpVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';

// ============================================
// DONNÉES MOCK
// ============================================

const generateCasesData = () => {
  const types = [
    { type: 'Commercial', couleur: '#4169e1' },
    { type: 'Pénal', couleur: '#8b0000' },
    { type: 'Civil', couleur: '#10b981' },
    { type: 'Administratif', couleur: '#f59e0b' },
    { type: 'Travail', couleur: '#d4af37' },
    { type: 'Famille', couleur: '#ef4444' },
  ];

  return types.map((item) => ({
    type: item.type,
    nombre: Math.floor(Math.random() * 30) + 10,
    couleur: item.couleur,
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
          {payload[0].payload.type}
        </p>
        <p className="text-sm" style={{ color: payload[0].payload.couleur }}>
          {payload[0].value} dossiers
        </p>
      </div>
    );
  }
  return null;
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const CasesChart: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();
  
  // Utiliser les données réelles si disponibles, sinon mock
  const data = stats?.dossiersParType 
    ? Object.entries(stats.dossiersParType).map(([type, nombre]) => ({
        type,
        nombre,
        couleur: '#4169e1', // Couleur par défaut
      }))
    : generateCasesData();

  const totalCases = data.reduce((sum, item) => sum + item.nombre, 0);

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-[#10b981]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
              Dossiers par type
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Répartition par domaine juridique
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-[#10b981] font-['JetBrains_Mono']">
            {totalCases}
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="type"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                fontFamily: 'Inter',
              }}
            />
            <Bar
              dataKey="nombre"
              name="Nombre de dossiers"
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.couleur} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};