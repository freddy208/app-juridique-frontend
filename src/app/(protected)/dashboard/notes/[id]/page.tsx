/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/notes/[id]/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNote } from '@/lib/hooks/notes';
import { NoteDetails } from '@/components/note/note-details';
import { toast } from 'sonner';
import { useIsMounted } from '@/lib/hooks/useIsMounted'; // ✅ Importer le hook

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { note, isLoading, error, refetch } = useNote(params.id);
  const isMounted = useIsMounted(); // ✅ Utiliser le hook

  const handleEdit = (id: string) => {
    router.push(`/dashboard/notes/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // Ici, vous utiliseriez le hook useDeleteNote
      // Pour cet exemple, nous simulons la suppression
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ Vérifier si le composant est toujours monté avant de continuer
      if (isMounted()) {
        toast.success('Note supprimée avec succès');
        router.push('/dashboard/notes');
      }
    } catch (error) {
      // ✅ Vérifier ici aussi pour être complet
      if (isMounted()) {
        toast.error('Erreur lors de la suppression de la note');
      }
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
        note={note}
        loading={isLoading}
        error={errorMessage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}