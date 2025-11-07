/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/notes/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNote } from '@/lib/hooks/notes';
import { useDeleteNote } from '@/lib/hooks/notes'; // ✅ Utiliser le hook de suppression
import { NoteDetails } from '@/components/note/note-details';
import { toast } from 'sonner';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  // ✅ Ajouter un état pour l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const { note, isLoading, error, refetch } = useNote(params.id);
  const { deleteNote, isPending: isDeleting } = useDeleteNote(); // ✅ Hook de suppression

  // ✅ Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/notes/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // ✅ Utiliser le hook de suppression qui gère déjà les toasts
      await deleteNote(id);
      
      // ✅ Vérifier si le composant est toujours monté avant de naviguer
      if (isMounted) {
        router.push('/dashboard/notes');
      }
    } catch (error) {
      // Les erreurs sont déjà gérées par le hook useDeleteNote
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Extraire le message d'erreur si nécessaire
  const errorMessage = error?.message || null;

  if (error || !note) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Erreur lors du chargement de la note: {errorMessage}</p>
        </div>
      </div>
    );
  }

  // ✅ Rendu simplifié pendant l'hydratation
  if (!isMounted) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-100 animate-pulse rounded w-32" />
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-100 animate-pulse rounded w-24" />
              <div className="h-10 bg-gray-100 animate-pulse rounded w-24" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-1/2" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
              <div className="h-32 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <NoteDetails
        note={note}
        loading={isDeleting} // ✅ Passer l'état de suppression
        error={errorMessage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}