// src/app/(dashboard)/notes/components/note-status-badge.tsx
"use client";

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { StatutNote } from '@/lib/types/note.types';
import { cn } from '@/lib/utils';

interface NoteStatusBadgeProps {
  status: StatutNote;
  className?: string;
}

export const NoteStatusBadge: React.FC<NoteStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: StatutNote) => {
    switch (status) {
      case StatutNote.ACTIF:
        return {
          label: 'Actif',
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case StatutNote.SUPPRIME:
        return {
          label: 'Supprimé',
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
    }
  };

  const { label, className: statusClassName } = getStatusConfig(status);

  return (
    <Badge className={cn(statusClassName, className)}>
      {label}
    </Badge>
  );
};