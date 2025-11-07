// src/app/(dashboard)/notes/components/note-details.tsx
"use client";

import React from 'react';
import { Note } from '../../lib/types/note.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { 
  Edit, 
  Trash2, 
  User, 
  FolderOpen, 
  Clock, 
  Calendar,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NoteStatusBadge } from './note-status-badge';
import { formatNoteDate } from '../../lib/utils/notes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NoteDetailsProps {
  note: Note;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const NoteDetails: React.FC<NoteDetailsProps> = ({ 
  note, 
  onDelete,
  onEdit 
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Bouton retour */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 hover:bg-blue-50 text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux notes
      </Button>

      {/* En-tête */}
      <Card className="p-8 bg-white border-2 border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 space-y-4">
            {/* Titre */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {note.titre || 'Note sans titre'}
              </h1>
              <NoteStatusBadge statut={note.statut} />
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auteur */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Auteur</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {note.utilisateur.prenom} {note.utilisateur.nom}
                  </p>
                </div>
              </div>

              {/* Date de création */}
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-3 rounded-lg border-2 border-emerald-200">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Créé le</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatNoteDate(note.creeLe)}
                  </p>
                </div>
              </div>

              {/* Date de modification */}
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 p-3 rounded-lg border-2 border-amber-200">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Modifié le</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatNoteDate(note.modifieLe)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-3">
            <Button
              onClick={onEdit}
              className="flex-1 lg:flex-initial gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="flex-1 lg:flex-initial gap-2 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </Card>

      {/* Associations (Client/Dossier) */}
      {(note.client || note.dossier) && (
        <Card className="p-6 bg-white border-2 border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Associations
          </h2>
          <div className="space-y-4">
            {/* Client */}
            {note.client && (
              <Link href={`/dashboard/clients/${note.client.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                >
                  {note.client.entreprise ? (
                    <Building2 className="h-6 w-6 text-blue-600 shrink-0" />
                  ) : (
                    <User className="h-6 w-6 text-blue-600 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-700 font-medium mb-1">CLIENT</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {note.client.entreprise || `${note.client.prenom} ${note.client.nom}`}
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white">
                    Voir le client
                  </Badge>
                </motion.div>
              </Link>
            )}

            {/* Dossier */}
            {note.dossier && (
              <Link href={`/dashboard/dossiers/${note.dossier.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                >
                  <FolderOpen className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-emerald-700 font-medium mb-1">DOSSIER</p>
                    <p className="font-mono text-xs font-semibold text-blue-600 mb-1">
                      {note.dossier.numeroUnique}
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {note.dossier.titre}
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white">
                    Voir le dossier
                  </Badge>
                </motion.div>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Contenu de la note */}
      <Card className="p-8 bg-white border-2 border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contenu
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {note.contenu}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};