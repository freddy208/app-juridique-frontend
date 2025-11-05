/**
 * ============================================
 * RECENT CASES TABLE
 * ============================================
 * Tableau des dossiers récents avec:
 * - Animations d'entrée par ligne
 * - Badges de statut colorés
 * - Actions rapides
 * - Responsive mobile
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Edit, MoreVertical } from 'lucide-react';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// ============================================
// CONFIGURATION STATUTS
// ============================================

const statusConfig = {
  EN_COURS: {
    label: 'En cours',
    className: 'bg-blue-100 text-blue-700',
  },
  NOUVEAU: {
    label: 'Nouveau',
    className: 'bg-green-100 text-green-700',
  },
  EN_ATTENTE: {
    label: 'En attente',
    className: 'bg-orange-100 text-orange-700',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-700',
  },
  CLOS: {
    label: 'Clôturé',
    className: 'bg-gray-100 text-gray-700',
  },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const RecentCasesTable: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  const dossiers = stats?.dossiersRecentes || [];

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-[#4169e1]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
                Dossiers récents
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Derniers dossiers mis à jour
            </p>
          </div>
          
          <button className="text-sm font-medium text-[#4169e1] hover:text-[#2e4fa8] transition-colors">
            Voir tout →
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4169e1] border-r-transparent" />
            <p className="mt-4 text-sm text-gray-600">Chargement des dossiers...</p>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun dossier récent
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">N° Dossier</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden lg:table-cell">Responsable</TableHead>
                <TableHead className="hidden md:table-cell">Statut</TableHead>
                <TableHead className="hidden lg:table-cell">Modifié le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.slice(0, 5).map((dossier, index) => (
                <motion.tr
                  key={dossier.id}
                  custom={index}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-mono text-sm font-medium text-[#4169e1]">
                    {dossier.numeroUnique}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {dossier.titre}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {dossier.client.prenom} {dossier.client.nom}
                      </div>
                      {dossier.client.entreprise && (
                        <div className="text-gray-500 text-xs">
                          {dossier.client.entreprise}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {dossier.responsable ? (
                      <span className="text-sm text-gray-700">
                        {dossier.responsable.prenom} {dossier.responsable.nom}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Non assigné
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      className={cn(
                        'font-medium',
                        statusConfig[dossier.statut as keyof typeof statusConfig]?.className ||
                          'bg-gray-100 text-gray-700'
                      )}
                    >
                      {statusConfig[dossier.statut as keyof typeof statusConfig]?.label ||
                        dossier.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                    {format(new Date(dossier.modifieLe), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
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