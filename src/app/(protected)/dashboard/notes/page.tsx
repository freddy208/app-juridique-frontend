/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/lib/hooks/notes';
import { useNotesStats } from '@/lib/hooks/notes';
import { NotesQuery } from '@/lib/types/note.types';
import { NoteList } from '@/components/note/note-list';
import { NoteFilters } from '@/components/note/note-filters';
import { NoteSearch } from '@/components/note/note-search';
import { toast } from 'sonner';
import { NoteStatsComponent } from '@/components/note/note-stats';
import { useIsMounted } from '@/lib/hooks/useIsMounted'; // ✅ Importer le hook

export default function NotesPage() {
  const router = useRouter();
  const isMounted = useIsMounted(); // ✅ Utiliser le hook
  
  const [filters, setFilters] = useState<NotesQuery>({
    page: 1,
    limit: 12,
    sortBy: 'creeLe',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const {
    notes,
    pagination,
    isLoading,
    error,
    refetch
  } = useNotes({ ...filters, search: searchTerm });

  const { stats, isLoading: statsLoading } = useNotesStats();

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
      // Simulation de la suppression
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ Vérifier si le composant est toujours monté
      if (isMounted()) {
        toast.success('Note supprimée avec succès');
        refetch(); // Le refetch est maintenant protégé
      }
    } catch (error) {
      // ✅ Vérifier ici aussi au cas où
      if (isMounted()) {
        toast.error('Erreur lors de la suppression de la note');
      }
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

      <NoteFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <NoteList
        notes={notes}
        loading={isLoading}
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