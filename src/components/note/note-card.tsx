// src/app/(dashboard)/notes/components/note-card.tsx
"use client";

import React from 'react';
import { Note } from '../../lib/types/note.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, User, FolderOpen, Clock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { NoteStatusBadge } from './note-status-badge';
import { formatNoteDate, getNoteExcerpt, isRecentNote } from '../../lib/utils/notes';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  index?: number;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, index = 0 }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/notes/${note.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/notes/edit/${note.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };

  const isRecent = isRecentNote(note.creeLe);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="p-6 bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer group">
        {/* En-tête de la carte */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Titre */}
            <div className="flex items-center gap-2">
              <h3 
                className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors"
                onClick={handleView}
              >
                {note.titre || 'Note sans titre'}
              </h3>
              {isRecent && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs px-2 py-0.5">
                  Récent
                </Badge>
              )}
            </div>

            {/* Statut */}
            <NoteStatusBadge statut={note.statut} />
          </div>
        </div>

        {/* Contenu - Extrait */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {getNoteExcerpt(note.contenu, 150)}
          </p>
        </div>

        {/* Cible (Client ou Dossier) */}
        {(note.client || note.dossier) && (
          <div className="mb-4 space-y-2">
            {note.client && (
              <div className="flex items-center gap-2 text-sm">
                {note.client.entreprise ? (
                  <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                ) : (
                  <User className="h-4 w-4 text-blue-600 shrink-0" />
                )}
                <span className="text-gray-600">Client:</span>
                <span className="font-semibold text-gray-900 truncate">
                  {note.client.entreprise || `${note.client.prenom} ${note.client.nom}`}
                </span>
              </div>
            )}
            {note.dossier && (
              <div className="flex items-center gap-2 text-sm">
                <FolderOpen className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-gray-600">Dossier:</span>
                <span className="font-mono font-semibold text-blue-600 text-xs">
                  {note.dossier.numeroUnique}
                </span>
                <span className="text-gray-900 truncate">
                  - {note.dossier.titre}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer - Informations et actions */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {/* Auteur */}
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span className="font-medium">
                {note.utilisateur.prenom} {note.utilisateur.nom}
              </span>
            </div>

            {/* Date de création */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <span>{formatNoteDate(note.creeLe)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};