/**
 * ============================================
 * UPCOMING HEARINGS TABLE
 * ============================================
 * Tableau des audiences à venir avec:
 * - Date et heure formatées
 * - Statut coloré
 * - Information de procédure
 * - Responsive mobile
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
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
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// ============================================
// CONFIGURATION STATUTS
// ============================================

const statusConfig = {
  PLANIFIE: {
    label: 'Planifiée',
    className: 'bg-blue-100 text-blue-700',
  },
  CONFIRMEE: {
    label: 'Confirmée',
    className: 'bg-green-100 text-green-700',
  },
  EN_ATTENTE: {
    label: 'En attente',
    className: 'bg-orange-100 text-orange-700',
  },
  REPORTEE: {
    label: 'Reportée',
    className: 'bg-red-100 text-red-700',
  },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const UpcomingHearingsTable: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  const audiences = stats?.audiencesAvenir || [];

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-burgundy-100 rounded-lg">
                <Calendar className="h-5 w-5 text-[#8b0000]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
                Audiences à venir
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Prochaines audiences planifiées
            </p>
          </div>
          
          <button className="text-sm font-medium text-[#8b0000] hover:text-[#6b0000] transition-colors">
            Calendrier →
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8b0000] border-r-transparent" />
            <p className="mt-4 text-sm text-gray-600">Chargement des audiences...</p>
          </div>
        ) : audiences.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune audience à venir
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Procédure</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Dans</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audiences.slice(0, 5).map((audience, index) => (
                <motion.tr
                  key={audience.id}
                  custom={index}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {format(new Date(audience.dateAudience), 'dd MMM yyyy', { locale: fr })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {format(new Date(audience.dateAudience), 'HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {audience.procedure.typeProcedure}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-gray-600 capitalize">
                      {audience.procedure.typeProcedure.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Tribunal de Grande Instance</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'font-medium',
                        statusConfig[audience.statut as keyof typeof statusConfig]?.className ||
                          'bg-gray-100 text-gray-700'
                      )}
                    >
                      {statusConfig[audience.statut as keyof typeof statusConfig]?.label ||
                        audience.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-600">
                    {formatDistanceToNow(new Date(audience.dateAudience), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};