// src/app/(dashboard)/notes/components/note-stats.tsx
"use client";

import React from 'react';
import { useNotesStats } from '../../lib/hooks/notes';
import { Card } from '@/components/ui/Card';
import { FileText, User, FolderOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface NoteStatsProps {
  utilisateurId?: string;
}

export const NoteStats: React.FC<NoteStatsProps> = ({ utilisateurId }) => {
  const { stats, isLoading } = useNotesStats(utilisateurId);

  const statsData = [
    {
      label: 'Total des notes',
      value: stats?.total || 0,
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Notes clients',
      value: stats?.parType.client || 0,
      icon: User,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Notes dossiers',
      value: stats?.parType.dossier || 0,
      icon: FolderOpen,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Notes actives',
      value: stats?.parStatut.actif || 0,
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-white border-gray-200">
            <Skeleton className="h-4 w-24 mb-4 bg-gray-200" />
            <Skeleton className="h-8 w-16 bg-gray-200" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`
              p-6 
              bg-white 
              border-2 
              ${stat.borderColor}
              hover:shadow-lg 
              transition-all 
              duration-300
              hover:scale-[1.02]
            `}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {stat.value.toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className={`
                  ${stat.bgColor} 
                  p-4 
                  rounded-xl 
                  border-2 
                  ${stat.borderColor}
                `}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};