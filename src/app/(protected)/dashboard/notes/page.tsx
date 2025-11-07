/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/notes/page.tsx
"use client";

import React, { useState } from 'react';
import { useNotes, useDeleteNote } from '../../../../lib/hooks/notes';
import { NotesQuery } from '../../../../lib//types/note.types';
import { NoteStats } from '../../../../components/note/note-stats';
import { NoteSearch } from '../../../../components/note/note-search';
import { NoteFilters } from '../../../../components/note/note-filters';
import { NoteList } from '../../../../components/note/note-list';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // État pour la suppression
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Initialisation des filtres depuis l'URL
  const initialFilters: NotesQuery = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
    statut: searchParams.get('statut') as any,
    typeCible: searchParams.get('typeCible') as any,
    sortBy: (searchParams.get('sortBy') as any) || 'creeLe',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };

  const [filters, setFilters] = useState<NotesQuery>(initialFilters);

  // Hooks
  const { notes, pagination, isLoading, refetch } = useNotes(filters);
  const { deleteNote, isPending: isDeleting } = useDeleteNote();

  // Mise à jour des filtres et de l'URL
  const handleFiltersChange = (newFilters: NotesQuery) => {
    setFilters(newFilters);
    
    // Mise à jour de l'URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    router.push(`?${params.toString()}`);
  };

  // Recherche
  const handleSearchChange = (search: string) => {
    handleFiltersChange({ ...filters, search, page: 1 });
  };

  // Pagination
  const handlePageChange = (page: number) => {
    handleFiltersChange({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Réinitialisation des filtres
  const handleResetFilters = () => {
    const resetFilters: NotesQuery = {
      page: 1,
      limit: 12,
      sortBy: 'creeLe',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    router.push('/notes');
  };

  // Suppression
  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete);
      toast.success('Note supprimée avec succès');
      setNoteToDelete(null);
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la note');
      console.error(error);
    }
  };

  // Export (fonctionnalité future)
  const handleExport = () => {
    toast.info('Fonctionnalité d\'export à venir');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Notes
            </h1>
            <p className="text-gray-600">
              Gérez vos notes internes et suivez vos informations importantes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
            <Button
              onClick={() => router.push('/dashboard/notes/create')}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5" />
              Nouvelle note
            </Button>
          </div>
        </motion.div>

        {/* Statistiques */}
        <NoteStats />

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <NoteSearch 
            value={filters.search || ''} 
            onChange={handleSearchChange}
          />
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <NoteFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </motion.div>

        {/* Liste des notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <NoteList
            notes={notes}
            isLoading={isLoading}
            onDelete={handleDeleteClick}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </motion.div>

      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent className="bg-white border-2 border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700"
              disabled={isDeleting}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}