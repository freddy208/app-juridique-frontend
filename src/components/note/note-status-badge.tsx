// src/app/(dashboard)/notes/components/note-status-badge.tsx
"use client";

import React from 'react';
import { StatutNote } from '../../lib/types/note.types';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface NoteStatusBadgeProps {
  statut: StatutNote;
  className?: string;
  showIcon?: boolean;
}

export const NoteStatusBadge: React.FC<NoteStatusBadgeProps> = ({ 
  statut, 
  className = '',
  showIcon = true 
}) => {
  const getStatusConfig = (status: StatutNote) => {
    switch (status) {
      case StatutNote.ACTIF:
        return {
          label: 'Actif',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
          icon: CheckCircle2,
        };
      case StatutNote.SUPPRIME:
        return {
          label: 'Supprimé',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: XCircle,
        };
      default:
        return {
          label: 'Inconnu',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: XCircle,
        };
    }
  };

  const config = getStatusConfig(statut);
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline"
      className={`
        ${config.bgColor} 
        ${config.textColor} 
        ${config.borderColor}
        border
        font-medium
        px-3 
        py-1
        text-xs
        inline-flex
        items-center
        gap-1.5
        ${className}
      `}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  );
};