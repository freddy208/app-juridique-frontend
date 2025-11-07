// src/app/(dashboard)/notes/edit/[id]/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNote } from '../../../../../../lib/hooks/notes';
import { useUpdateNote } from '../../../../../../lib/hooks/notes';
import { NoteForm } from '../../../../../../components/note/note-form';
import { UpdateNoteForm } from '../../../../../../lib/types/note.types';
import { toast } from 'sonner';

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { note, isLoading, error } = useNote(params.id);
  const { updateNote, isPending, error: updateError } = useUpdateNote();

  const handleSubmit = async (data: UpdateNoteForm) => {
    try {
      await updateNote({ id: params.id, data });
      toast.success('Note mise à jour avec succès');
      router.push(`/dashboard/notes/${params.id}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la note');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Erreur lors du chargement de la note</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <NoteForm
        mode="update"
        note={note}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isPending}
        error={updateError?.message || null}
      />
    </div>
  );
}