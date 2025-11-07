// src/app/(dashboard)/notes/components/note-list.tsx
"use client";

import React from 'react';
import { Note } from '../../lib/types/note.types';
import { NoteCard } from './note-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface NoteListProps {
  notes: Note[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  isLoading,
  onDelete,
  pagination,
  onPageChange 
}) => {
  // État de chargement
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white border-2 border-gray-200 rounded-lg">
            <Skeleton className="h-6 w-3/4 mb-4 bg-gray-200" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-2/3 bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  // État vide
  if (!notes || notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="bg-blue-50 p-6 rounded-full mb-6 border-2 border-blue-200">
          <FileText className="h-16 w-16 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Aucune note trouvée
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Commencez par créer votre première note ou modifiez vos filtres de recherche.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Liste des notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note, index) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onDelete={onDelete}
            index={index}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gray-200"
        >
          {/* Informations de pagination */}
          <div className="text-sm text-gray-600">
            Affichage de <span className="font-semibold text-gray-900">
              {((pagination.page - 1) * pagination.limit) + 1}
            </span> à <span className="font-semibold text-gray-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> sur <span className="font-semibold text-gray-900">
              {pagination.total}
            </span> notes
          </div>

          {/* Boutons de pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="gap-2 bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            {/* Numéros de page */}
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Afficher les pages autour de la page actuelle
                  const current = pagination.page;
                  return (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= current - 1 && pageNum <= current + 1)
                  );
                })
                .map((pageNum, index, array) => {
                  // Ajouter des ellipses si nécessaire
                  const showEllipsisBefore = index > 0 && pageNum - array[index - 1] > 1;
                  
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <Button
                        variant={pagination.page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange && onPageChange(pageNum)}
                        className={`
                          h-9 w-9 p-0
                          ${pagination.page === pageNum 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                            : 'bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-400 text-gray-700'
                          }
                        `}
                      >
                        {pageNum}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="gap-2 bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};