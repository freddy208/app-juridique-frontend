// src/app/(dashboard)/notes/create/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateNote } from '@/lib/hooks/notes';
import { NoteForm } from '@/components/note/note-form';
import { CreateNoteForm } from '@/lib/types/note.types';
import { toast } from 'sonner';

export default function CreateNotePage() {
  // ✅ Ajouter un état pour l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const { createNote, isPending, error } = useCreateNote();

  // ✅ Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (data: CreateNoteForm) => {
    try {
      await createNote(data);
      
      // ✅ Vérifier si le composant est toujours monté avant de continuer
      if (isMounted) {
        toast.success('Note créée avec succès');
        router.push('/dashboard/notes');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // ✅ Vérifier ici aussi pour être complet
      if (isMounted) {
        toast.error('Erreur lors de la création de la note');
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // ✅ Rendu simplifié pendant l'hydratation
  if (!isMounted) {
    return (
      <div className="container mx-auto py-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-1/3" />
              <div className="h-10 bg-gray-100 animate-pulse rounded" />
              <div className="h-32 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <NoteForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isPending}
        error={error?.message || null}
      />
    </div>
  );
}