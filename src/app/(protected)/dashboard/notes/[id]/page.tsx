/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/notes/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { useNote, useDeleteNote } from '../../../../../lib/hooks/notes';
import { NoteDetails } from '../../../../../components/note//note-details';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';

export default function NoteDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Hooks
  const { note, isLoading, error } = useNote(noteId);
  const { deleteNote, isPending: isDeleting } = useDeleteNote();

  // Gestion de la suppression
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNote(noteId);
      toast.success('Note supprimée avec succès');
      router.push('/dashboard/notes');
    } catch (error: any) {
      // Gestion des erreurs 403
      if (error?.response?.status === 403) {
        toast.error('Vous n\'avez pas les permissions nécessaires pour supprimer cette note');
      } else {
        toast.error('Erreur lors de la suppression de la note');
      }
      console.error(error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Gestion de la modification
  const handleEdit = () => {
    router.push(`/dashboard/notes/edit/${noteId}`);
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">Chargement de la note...</p>
        </motion.div>
      </div>
    );
  }

  // État d'erreur
  if (error || !note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 bg-white border-2 border-red-200 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Note introuvable
              </h2>
              <p className="text-gray-600 mb-6">
                La note que vous recherchez n&apos;existe pas ou a été supprimée.
              </p>
              <button
                onClick={() => router.push('/dashboard/notes')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Retour aux notes
              </button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <NoteDetails
          note={note}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border-2 border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible et toutes les données associées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700"
              disabled={isDeleting}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}