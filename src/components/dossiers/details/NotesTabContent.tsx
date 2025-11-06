/**
 * ============================================
 * NOTES TAB CONTENT
 * ============================================
 * Contenu de l'onglet Notes
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { StickyNote, Plus, Calendar, User, Edit, Trash2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Note, StatutNote } from '../../../lib/types/note.types';

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface NotesTabContentProps {
  notes?: Note[];
  dossierId: string;
}

export const NotesTabContent: React.FC<NotesTabContentProps> = ({ 
  notes, 
}) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ titre: '', contenu: '' });

  const handleAddNote = () => {
    // TODO: Implémenter la création de note via API
    console.log('Créer note:', newNote);
    setIsAdding(false);
    setNewNote({ titre: '', contenu: '' });
  };

  // Configuration des statuts de note
  const getStatutBadge = (statut: StatutNote) => {
    switch (statut) {
      case StatutNote.ACTIF:
        return <Badge variant="default" className="text-xs">Actif</Badge>;
      case StatutNote.SUPPRIME:
        return <Badge variant="destructive" className="text-xs">Supprimé</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              {notes?.length || 0} note(s) enregistrée(s)
            </CardDescription>
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-[#4169e1] hover:bg-[#2e4fa8]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Formulaire d'ajout de note */}
        {isAdding && (
          <Card className="mb-6 border-2 border-[#4169e1]">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Titre de la note"
                value={newNote.titre}
                onChange={(e) => setNewNote({ ...newNote, titre: e.target.value })}
              />
              <Textarea
                placeholder="Contenu de la note..."
                value={newNote.contenu}
                onChange={(e) => setNewNote({ ...newNote, contenu: e.target.value })}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote({ titre: '', contenu: '' });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.contenu}
                  className="bg-[#4169e1] hover:bg-[#2e4fa8]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des notes */}
        {notes && notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`border-gray-200 hover:border-[#4169e1] hover:shadow-sm transition-all ${
                  note.statut === StatutNote.SUPPRIME ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-yellow-50 rounded-lg">
                        <StickyNote className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {note.titre || 'Note sans titre'}
                          </h4>
                          {getStatutBadge(note.statut)}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(note.creeLe)}
                          </span>
                          {note.utilisateur && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {note.utilisateur.prenom} {note.utilisateur.nom}
                            </span>
                          )}
                          {note.dossier && (
                            <span className="flex items-center gap-1">
                              Dossier: {note.dossier.numeroUnique}
                            </span>
                          )}
                          {note.client && (
                            <span className="flex items-center gap-1">
                              Client: {note.client.prenom} {note.client.nom}
                              {note.client.entreprise && ` (${note.client.entreprise})`}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {note.contenu}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/notes/${note.id}/modifier`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <StickyNote className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Aucune note</p>
            <p className="text-sm text-gray-500 mb-4">
              Aucune note n&apos;a encore été créée pour ce dossier
            </p>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer la première note
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};