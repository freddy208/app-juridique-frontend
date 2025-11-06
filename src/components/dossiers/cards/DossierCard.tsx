/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * DOSSIER CARD - Carte Fiche Professionnelle
 * ============================================
 * Design de fiche cartonnée pour représenter un dossier
 * Style cabinet juridique professionnel
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Folder,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dossier } from '@/lib/types/dossier';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteDossier } from '@/lib/hooks/dossier/useDossierActions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  TYPE_DOSSIER_CONFIG,
  STATUT_DOSSIER_CONFIG,
  formatDateShort,
} from '@/lib/dossiers/constants';

// ============================================
// TYPES
// ============================================

interface DossierCardProps {
  dossier: Dossier;
  index: number;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const DossierCard: React.FC<DossierCardProps> = ({ dossier, index }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteDossier({
    onSuccess: () => {
      toast.success('Dossier supprimé avec succès');
      setShowDeleteDialog(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error("Vous n'avez pas les permissions pour supprimer ce dossier");
      } else {
        toast.error('Erreur lors de la suppression du dossier');
      }
      setShowDeleteDialog(false);
    },
  });

  const typeConfig = TYPE_DOSSIER_CONFIG[dossier.type];
  const statutConfig = STATUT_DOSSIER_CONFIG[dossier.statut];

  const handleView = () => {
    router.push(`/dossiers/${dossier.id}`);
  };

  const handleEdit = () => {
    router.push(`/dossiers/${dossier.id}/modifier`);
  };

  const handleDelete = () => {
    deleteMutation.mutate(dossier.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4, boxShadow: '0 12px 24px -4px rgba(65, 105, 225, 0.15)' }}
        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all duration-300"
        onClick={handleView}
      >
        {/* En-tête avec type de dossier */}
        <div className={cn('px-6 py-3 border-b-2', typeConfig.borderColor, typeConfig.bgColor)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{typeConfig.icon}</div>
              <div>
                <p className={cn('text-sm font-bold', typeConfig.color)}>
                  {typeConfig.label}
                </p>
                <p className="text-xs text-gray-600 font-mono">
                  {dossier.numeroUnique}
                </p>
              </div>
            </div>

            {/* Menu actions */}
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-white/80 transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e: { stopPropagation: () => void; }) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Corps de la carte */}
        <div className="p-6 space-y-4">
          {/* Titre */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
              {dossier.titre}
            </h3>
            {dossier.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {dossier.description}
              </p>
            )}
          </div>

          {/* Informations client */}
          <div className="flex items-center gap-2 text-sm">
            <Folder className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {dossier.client.prenom} {dossier.client.nom}
            </span>
            {dossier.client.entreprise && (
              <span className="text-gray-500">
                • {dossier.client.entreprise}
              </span>
            )}
          </div>

          {/* Statut et responsable */}
          <div className="flex items-center justify-between gap-3">
            <Badge
              className={cn(
                'font-medium',
                statutConfig.bgColor,
                statutConfig.color
              )}
            >
              <span className={cn('w-2 h-2 rounded-full mr-2', statutConfig.dotColor)} />
              {statutConfig.label}
            </Badge>

            {dossier.responsable && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <User className="h-3.5 w-3.5" />
                <span>
                  {dossier.responsable.prenom} {dossier.responsable.nom}
                </span>
              </div>
            )}
          </div>

          {/* Date de création */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <Calendar className="h-3.5 w-3.5" />
            <span>Créé le {formatDateShort(dossier.creeLe)}</span>
          </div>
        </div>

        {/* Pied de carte avec métriques */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Documents</p>
            <p className="text-sm font-bold text-gray-900">
              {dossier.documents?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tâches</p>
            <p className="text-sm font-bold text-gray-900">
              {dossier.taches?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Factures</p>
            <p className="text-sm font-bold text-gray-900">
              {dossier.factures?.length || 0}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le dossier <strong>{dossier.numeroUnique}</strong> ?
              <br />
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};