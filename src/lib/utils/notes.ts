// src/utils/notes.ts

import { Note, StatutNote } from '../types/note.types';

// Fonction pour formater la date d'une note
export const formatNoteDate = (date: Date | string): string => {
  const noteDate = typeof date === 'string' ? new Date(date) : date;
  return noteDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Fonction pour extraire un extrait du contenu d'une note
export const getNoteExcerpt = (contenu: string, maxLength: number = 100): string => {
  if (contenu.length <= maxLength) return contenu;
  return contenu.substring(0, maxLength) + '...';
};

// Fonction pour vérifier si une note est récente (créée il y a moins de 7 jours)
export const isRecentNote = (creeLe: Date | string): boolean => {
  const noteDate = typeof creeLe === 'string' ? new Date(creeLe) : creeLe;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - noteDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// Fonction pour trier les notes par date de création
export const sortNotesByDate = (notes: Note[], order: 'asc' | 'desc' = 'desc'): Note[] => {
  return [...notes].sort((a, b) => {
    const dateA = new Date(a.creeLe).getTime();
    const dateB = new Date(b.creeLe).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

// Fonction pour filtrer les notes par statut
export const filterNotesByStatus = (notes: Note[], statut: StatutNote): Note[] => {
  return notes.filter(note => note.statut === statut);
};

// Fonction pour filtrer les notes par terme de recherche
export const filterNotesBySearchTerm = (notes: Note[], searchTerm: string): Note[] => {
  if (!searchTerm.trim()) return notes;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return notes.filter(note => 
    (note.titre && note.titre.toLowerCase().includes(lowerSearchTerm)) ||
    note.contenu.toLowerCase().includes(lowerSearchTerm)
  );
};

// Fonction pour générer un titre par défaut si non fourni
export const generateDefaultTitle = (contenu: string): string => {
  const words = contenu.split(' ').slice(0, 5).join(' ');
  return words.length < contenu.split(' ').slice(0, 5).join(' ').length 
    ? words + '...' 
    : words;
};

// Fonction pour déterminer le type de cible d'une note
export const getNoteTargetType = (note: Note): 'client' | 'dossier' | 'général' => {
  if (note.clientId) return 'client';
  if (note.dossierId) return 'dossier';
  return 'général';
};

// Fonction pour obtenir les informations de la cible d'une note
export const getNoteTargetInfo = (note: Note): { id?: string; name?: string; type: string } => {
  if (note.client) {
    return {
      id: note.client.id,
      name: note.client.entreprise || `${note.client.prenom} ${note.client.nom}`,
      type: 'client',
    };
  }
  
  if (note.dossier) {
    return {
      id: note.dossier.id,
      name: `${note.dossier.numeroUnique} - ${note.dossier.titre}`,
      type: 'dossier',
    };
  }
  
  return { type: 'général' };
};