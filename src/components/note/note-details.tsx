// src/app/(dashboard)/notes/components/note-details.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Calendar, 
  User, 
  Building,
  FileText,
  Clock
} from 'lucide-react';
import { Note } from '../../lib/types/note.types';
import { formatNoteDate, getNoteTargetInfo } from '../../lib/utils/notes';
import { NoteStatusBadge } from './note-status-badge';

interface NoteDetailsProps {
  note: Note | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string | null;
}

export const NoteDetails: React.FC<NoteDetailsProps> = ({
  note,
  onEdit,
  onDelete,
  onBack,
  loading = false,
  error = null
}) => {
  // ✅ Ajouter un état pour l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // ✅ Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Ne calculer targetInfo que si note existe
  const targetInfo = note ? getNoteTargetInfo(note) : { type: 'général' };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Erreur lors du chargement de la note: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!note) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Note non trouvée</AlertDescription>
      </Alert>
    );
  }

  // ✅ Rendu simplifié pendant l'hydratation (sans animations)
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux notes
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onEdit(note.id)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl text-gray-800">
                  {note.titre || "Note sans titre"}
                </CardTitle>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {note.utilisateur.prenom} {note.utilisateur.nom}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Créée le {formatNoteDate(note.creeLe)}
                  </div>
                  {note.modifieLe && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Modifiée le {formatNoteDate(note.modifieLe)}
                    </div>
                  )}
                </div>
              </div>
              <NoteStatusBadge status={note.statut} />
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6">
            {targetInfo.type !== 'général' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Associée à:</h3>
                <div className="flex items-center">
                  {targetInfo.type === 'client' ? (
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                  ) : (
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  )}
                  <span className="font-medium">{targetInfo.name}</span>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {targetInfo.type}
                  </Badge>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Contenu</h3>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {note.contenu}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showDeleteConfirm && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Confirmer la suppression</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="border-red-200 text-red-700 hover:bg-red-100"
              >
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(note.id)}
              >
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  }

  // ✅ Rendu complet avec animations après hydratation
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux notes
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onEdit(note.id)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl text-gray-800">
                {note.titre || "Note sans titre"}
              </CardTitle>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  {note.utilisateur.prenom} {note.utilisateur.nom}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Créée le {formatNoteDate(note.creeLe)}
                </div>
                {note.modifieLe && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Modifiée le {formatNoteDate(note.modifieLe)}
                  </div>
                )}
              </div>
            </div>
            <NoteStatusBadge status={note.statut} />
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          {targetInfo.type !== 'général' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Associée à:</h3>
              <div className="flex items-center">
                {targetInfo.type === 'client' ? (
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                ) : (
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                )}
                <span className="font-medium">{targetInfo.name}</span>
                <Badge variant="outline" className="ml-2 capitalize">
                  {targetInfo.type}
                </Badge>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Contenu</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {note.contenu}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Confirmer la suppression</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete(note.id)}
            >
              Supprimer
            </Button>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};