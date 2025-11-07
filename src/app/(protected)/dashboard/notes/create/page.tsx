// src/app/(dashboard)/notes/create/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCreateNote } from '@/lib/hooks/notes';
import { NoteForm } from '@/components/note/note-form';
import { CreateNoteForm } from '@/lib/types/note.types';
import { toast } from 'sonner';
import { useIsMounted } from '@/lib/hooks/useIsMounted'; // ✅ Importer le hook

export default function CreateNotePage() {
  const router = useRouter();
  const { createNote, isPending, error } = useCreateNote();
  const isMounted = useIsMounted(); // ✅ Utiliser le hook

  const handleSubmit = async (data: CreateNoteForm) => {
    try {
      await createNote(data);
      
      // ✅ Vérifier si le composant est toujours monté avant de continuer
      if (isMounted()) {
        toast.success('Note créée avec succès');
        router.push('/dashboard/notes');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // ✅ Vérifier ici aussi pour être complet
      if (isMounted()) {
        toast.error('Erreur lors de la création de la note');
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

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