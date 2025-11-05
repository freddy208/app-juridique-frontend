/**
 * ============================================
 * URGENT TASKS TABLE
 * ============================================
 * Tableau des tâches urgentes avec:
 * - Priorité colorée
 * - Lien vers le dossier
 * - Checkbox de complétion
 * - Responsive mobile
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { fadeInUpVariants, tableRowVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { cn } from '@/lib/utils';

// ============================================
// CONFIGURATION PRIORITÉS
// ============================================

const priorityConfig = {
  1: {
    label: 'Critique',
    icon: AlertCircle,
    className: 'bg-red-100 text-red-700',
  },
  2: {
    label: 'Haute',
    icon: AlertCircle,
    className: 'bg-orange-100 text-orange-700',
  },
  3: {
    label: 'Moyenne',
    icon: Circle,
    className: 'bg-blue-100 text-blue-700',
  },
  4: {
    label: 'Basse',
    icon: Circle,
    className: 'bg-gray-100 text-gray-700',
  },
};

const statusConfig = {
  A_FAIRE: {
    label: 'À faire',
    className: 'bg-orange-100 text-orange-700',
  },
  EN_COURS: {
    label: 'En cours',
    className: 'bg-blue-100 text-blue-700',
  },
  TERMINE: {
    label: 'Terminée',
    className: 'bg-green-100 text-green-700',
  },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const UrgentTasksTable: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  const taches = stats?.tachesAssignees || [];

  // Fonction pour gérer le changement de statut
  const handleTaskToggle = (taskId: string) => {
    console.log('Toggle task:', taskId);
    // TODO: Implémenter la mise à jour du statut via API
  };

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-[#f59e0b]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
                Tâches urgentes
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Tâches qui nécessitent votre attention
            </p>
          </div>
          
          <button className="text-sm font-medium text-[#f59e0b] hover:text-[#d97706] transition-colors">
            Voir tout →
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#f59e0b] border-r-transparent" />
            <p className="mt-4 text-sm text-gray-600">Chargement des tâches...</p>
          </div>
        ) : taches.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">Aucune tâche urgente</p>
            <p className="text-sm text-gray-400 mt-1">Vous êtes à jour !</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tâche</TableHead>
                <TableHead className="hidden md:table-cell">Dossier</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead className="hidden lg:table-cell">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taches.slice(0, 5).map((tache, index) => {
                const priority = priorityConfig[tache.priorite as keyof typeof priorityConfig] ||
                  priorityConfig[3];
                const PriorityIcon = priority.icon;
                const isCompleted = tache.statut === 'TERMINE';

                return (
                  <motion.tr
                    key={tache.id}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleTaskToggle(tache.id)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div
                          className={cn(
                            'font-medium text-gray-900',
                            isCompleted && 'line-through text-gray-400'
                          )}
                        >
                          {tache.titre}
                        </div>
                        {tache.description && (
                          <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                            {tache.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {tache.dossier ? (
                        <div className="text-sm">
                          <div className="font-mono text-[#4169e1] font-medium">
                            {tache.dossier.numeroUnique}
                          </div>
                          <div className="text-gray-500 text-xs line-clamp-1">
                            {tache.dossier.titre}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Aucun dossier
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('font-medium gap-1', priority.className)}>
                        <PriorityIcon className="h-3 w-3" />
                        {priority.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        className={cn(
                          'font-medium',
                          statusConfig[tache.statut as keyof typeof statusConfig]?.className ||
                            'bg-gray-100 text-gray-700'
                        )}
                      >
                        {statusConfig[tache.statut as keyof typeof statusConfig]?.label ||
                          tache.statut}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};