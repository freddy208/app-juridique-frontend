/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/notes/create/page.tsx
"use client";

import React from 'react';
import { useCreateNote } from '../../../../../lib/hooks/notes';
import { CreateNoteForm, UpdateNoteForm } from '../../../../../lib/types/note.types';
import { NoteForm } from '../../../../../components/note/note-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateNotePage() {
  const router = useRouter();
  const { createNote, isPending } = useCreateNote();

// src/app/(dashboard)/notes/create/page.tsx

    // Modifiez la signature de votre fonction handleSubmit pour accepter les deux types
    const handleSubmit = async (data: UpdateNoteForm | CreateNoteForm) => {
    try {
        // Assurez-vous que les données ont bien un contenu (requis pour CreateNoteForm)
        if (!data.contenu) {
        toast.error('Le contenu de la note est obligatoire');
        return;
        }
        
        // Convertissez les données en CreateNoteForm pour l'API
        const createData: CreateNoteForm = {
        titre: data.titre,
        contenu: data.contenu,
        clientId: data.clientId,
        dossierId: data.dossierId
        };
        
        const result = await createNote(createData);
        toast.success('Note créée avec succès');
        router.push('/dashboard/notes');
    } catch (error: any) {
        // Gestion des erreurs 403
        if (error?.response?.status === 403) {
        toast.error('Vous n\'avez pas les permissions nécessaires pour créer une note');
        } else {
        toast.error('Erreur lors de la création de la note');
        }
        console.error(error);
        throw error;
    }
    };

  const handleCancel = () => {
    router.back();
  };

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
            Retour aux notes
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
            <div className="bg-blue-100 p-4 rounded-xl border-2 border-blue-300">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Créer une nouvelle note
              </h1>
              <p className="text-gray-600 mt-1">
                Ajoutez une note à votre système de gestion
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isPending}
          />
        </motion.div>

      </div>
    </div>
  );
}