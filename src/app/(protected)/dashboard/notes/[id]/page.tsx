// src/app/(dashboard)/notes/[id]/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNote } from '@/lib/hooks/notes';
import { NoteDetails } from '@/components/note/note-details';
import { toast } from 'sonner';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { note, isLoading, error, refetch } = useNote(params.id);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/notes/edit/${id}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: string) => {
    try {
      // Ici, vous utiliseriez le hook useDeleteNote
      // Pour cet exemple, nous simulons la suppression
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Note supprimée avec succès');
      router.push('/dashboard/notes');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erreur lors de la suppression de la note');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Extraire le message d'erreur si nécessaire
  const errorMessage = error?.message || null;

  return (
    <div className="container mx-auto py-6">
      <NoteDetails
        note={note} // Passer note tel quel (peut être null)
        loading={isLoading}
        error={errorMessage} // Passer le message d'erreur
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}