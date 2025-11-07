/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/lib/hooks/notes';
import { useNotesStats } from '@/lib/hooks/notes';
import { useDeleteNote } from '@/lib/hooks/notes';
import { NotesQuery } from '@/lib/types/note.types';
import { NoteList } from '@/components/note/note-list';
import { NoteFilters } from '@/components/note/note-filters';
import { NoteSearch } from '@/components/note/note-search';
import { NoteStatsComponent } from '@/components/note/note-stats';

export default function NotesPage() {
  const router = useRouter();
  
  // ✅ Ajouter un état pour gérer l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  
  const [filters, setFilters] = useState<NotesQuery>({
    page: 1,
    limit: 12,
    sortBy: 'creeLe',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Effet pour marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ DÉCLARATION DES HOOKS EN PREMIER
  const {
    notes, // <-- 'notes' est maintenant déclaré ici
    pagination,
    isLoading,
    error,
    refetch
  } = useNotes({ ...filters, search: searchTerm });

  const { stats, isLoading: statsLoading } = useNotesStats();
  
  const { deleteNote, isPending: isDeleting } = useDeleteNote();

  // ✅ DÉPLACÉ ICI : l'effet qui dépend de 'notes' est placé après sa déclaration
  useEffect(() => {
    // Si les notes existent mais ne sont pas un tableau, on log l'erreur
    if (notes && !Array.isArray(notes)) {
      console.error("Dans NotesPage : les notes reçues du hook ne sont pas un tableau.", notes);
    }
  }, [notes]); // Se déclenche quand la variable 'notes' change

  const handleFiltersChange = (newFilters: NotesQuery) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({
      ...prev,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleViewNote = (id: string) => {
    router.push(`/dashboard/notes/${id}`);
  };

  const handleEditNote = (id: string) => {
    router.push(`/dashboard/notes/edit/${id}`);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (error) {
      console.error("Échec de la suppression dans le composant :", error);
    }
  };

  const handleCreateNote = () => {
    router.push('/dashboard/notes/create');
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'creeLe',
      sortOrder: 'desc'
    });
    setSearchTerm('');
  };

  // ✅ Afficher un loader pendant l'hydratation pour éviter les erreurs
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-500 mt-1">Gérez toutes vos notes internes</p>
          </div>
          <Button disabled className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle note
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-500 mt-1">Gérez toutes vos notes internes</p>
        </div>
        <Button onClick={handleCreateNote} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle note
        </Button>
      </div>

      <NoteStatsComponent stats={stats} loading={statsLoading} />

      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="w-full md:w-64">
          <NoteSearch value={searchTerm} onChange={handleSearchChange} />
        </div>
      </div>

      {/*<NoteFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />*/}

      <NoteList
        notes={notes}
        loading={isLoading || isDeleting}
        error={error?.message || null}
        pagination={pagination}
        onView={handleViewNote}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onPageChange={handlePageChange}
        onCreateNew={handleCreateNote}
      />
    </div>
  );
}