// src/app/(dashboard)/notes/components/note-list.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoteCard } from './note-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { FileText, Grid, List, Plus } from 'lucide-react';
import { Note } from '@/lib/types/note.types';
import { PaginationControls } from '@/components/ui/pagination-controls';

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onCreateNew: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  loading,
  error,
  pagination,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onCreateNew
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Erreur lors du chargement des notes: {error}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        title="Aucune note trouvée"
        description="Créez votre première note pour commencer à organiser vos informations."
        icon={<FileText className="h-12 w-12 text-gray-400" />}
        action={
          <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Créer une note
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {pagination.total} note{pagination.total > 1 ? 's' : ''} trouvée{pagination.total > 1 ? 's' : ''}
        </p>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <NoteCard
                note={note}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};