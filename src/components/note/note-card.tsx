// src/app/(dashboard)/notes/components/note-card.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  FileText, 
  Building,
  Clock
} from 'lucide-react';
import { Note } from '../../lib/types/note.types';
import { formatNoteDate, getNoteExcerpt, isRecentNote, getNoteTargetInfo } from '../../lib/utils/notes';

interface NoteCardProps {
  note: Note;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  // ✅ Ajouter un état pour l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  
  // ✅ Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const targetInfo = getNoteTargetInfo(note);
  const isRecent = isRecentNote(note.creeLe);
  const excerpt = getNoteExcerpt(note.contenu, 150);

  // ✅ Rendu simplifié pendant l'hydratation (sans animations)
  if (!isMounted) {
    return (
      <div className="h-full">
        <Card className="h-full flex flex-col border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {note.titre || "Note sans titre"}
                </h3>
                {isRecent && (
                  <Badge variant="secondary" className="mt-1 bg-cyan-100 text-cyan-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Récent
                  </Badge>
                )}
              </div>
              <Badge 
                variant={note.statut === 'ACTIF' ? 'default' : 'destructive'}
                className="ml-2"
              >
                {note.statut}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 pb-3">
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {excerpt}
            </p>
            
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {note.utilisateur.prenom} {note.utilisateur.nom}
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatNoteDate(note.creeLe)}
              </div>
              
              {targetInfo.type !== 'général' && (
                <div className="flex items-center">
                  {targetInfo.type === 'client' ? (
                    <Building className="w-3 h-3 mr-1" />
                  ) : (
                    <FileText className="w-3 h-3 mr-1" />
                  )}
                  <span className="truncate ml-1">{targetInfo.name}</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 flex justify-between">
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onView(note.id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(note.id)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(note.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ✅ Rendu complet avec animations après hydratation
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-gray-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                {note.titre || "Note sans titre"}
              </h3>
              {isRecent && (
                <Badge variant="secondary" className="mt-1 bg-cyan-100 text-cyan-800 hover:bg-cyan-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Récent
                </Badge>
              )}
            </div>
            <Badge 
              variant={note.statut === 'ACTIF' ? 'default' : 'destructive'}
              className="ml-2"
            >
              {note.statut}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-3">
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {excerpt}
          </p>
          
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {note.utilisateur.prenom} {note.utilisateur.nom}
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatNoteDate(note.creeLe)}
            </div>
            
            {targetInfo.type !== 'général' && (
              <div className="flex items-center">
                {targetInfo.type === 'client' ? (
                  <Building className="w-3 h-3 mr-1" />
                ) : (
                  <FileText className="w-3 h-3 mr-1" />
                )}
                <span className="truncate ml-1">{targetInfo.name}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onView(note.id)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(note.id)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(note.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};