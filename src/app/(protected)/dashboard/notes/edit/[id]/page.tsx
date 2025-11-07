/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/notes/edit/[id]/page.tsx
"use client";

import React from 'react';
import { useNote, useUpdateNote } from '../../../../../../lib/hooks/notes';
import { UpdateNoteForm } from '../../../../../../lib/types/note.types';
import { NoteForm } from '../../../../../../components/note/note-form';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  // Hooks
  const { note, isLoading, error } = useNote(noteId);
  const { updateNote, isPending } = useUpdateNote();

  const handleSubmit = async (data: UpdateNoteForm) => {
    try {
      await updateNote({ id: noteId, data });
      toast.success('Note modifiée avec succès');
      router.push(`/dashboard/notes/${noteId}`);
    } catch (error: any) {
      // Gestion des erreurs 403
      if (error?.response?.status === 403) {
        toast.error('Vous n\'avez pas les permissions nécessaires pour modifier cette note');
      } else {
        toast.error('Erreur lors de la modification de la note');
      }
      console.error(error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
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
                La note que vous souhaitez modifier n&apos;existe pas ou a été supprimée.
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
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 hover:bg-blue-50 text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </motion.div>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-4 rounded-xl border-2 border-amber-300">
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Modifier la note
              </h1>
              <p className="text-gray-600 mt-1">
                {note.titre || 'Note sans titre'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <NoteForm
            initialData={note}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isPending}
          />
        </motion.div>

      </div>
    </div>
  );
}