// src/app/(dashboard)/notes/components/note-filters.tsx
"use client";

import React from 'react';
import { NotesQuery, StatutNote } from '../../lib/types/note.types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Filter, X, FolderOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';

interface NoteFiltersProps {
  filters: NotesQuery;
  onFiltersChange: (filters: NotesQuery) => void;
  onReset: () => void;
}

export const NoteFilters: React.FC<NoteFiltersProps> = ({ 
  filters, 
  onFiltersChange,
  onReset 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value !== undefined && 
    value !== null && 
    value !== '' &&
    key !== 'page' &&
    key !== 'limit' &&
    key !== 'sortBy' &&
    key !== 'sortOrder'
  ).length;

  const handleFilterChange = (key: keyof NotesQuery, value: string | undefined) => {
    if (value === 'all' || value === undefined || value === '') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = filters;
      onFiltersChange(rest);
    } else {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Bouton pour afficher/masquer les filtres */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-400 text-gray-700 transition-all duration-200"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtres</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 bg-blue-600 text-white px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-white border-2 border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Filtre par statut */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Statut
                  </label>
                  <Select
                    value={filters.statut || 'all'}
                    onValueChange={(value) => handleFilterChange('statut', value)}
                  >
                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 text-gray-900">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all" className="hover:bg-blue-50">
                        Tous les statuts
                      </SelectItem>
                      <SelectItem value={StatutNote.ACTIF} className="hover:bg-blue-50">
                        Actif
                      </SelectItem>
                      <SelectItem value={StatutNote.SUPPRIME} className="hover:bg-blue-50">
                        Supprimé
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par type de cible */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    Type de cible
                  </label>
                  <Select
                    value={filters.typeCible || 'all'}
                    onValueChange={(value) => handleFilterChange('typeCible', value)}
                  >
                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 text-gray-900">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all" className="hover:bg-blue-50">
                        Tous les types
                      </SelectItem>
                      <SelectItem value="client" className="hover:bg-blue-50">
                        Client
                      </SelectItem>
                      <SelectItem value="dossier" className="hover:bg-blue-50">
                        Dossier
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre de tri */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Trier par
                  </label>
                  <Select
                    value={filters.sortBy || 'creeLe'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="creeLe" className="hover:bg-blue-50">
                        Date de création
                      </SelectItem>
                      <SelectItem value="modifieLe" className="hover:bg-blue-50">
                        Date de modification
                      </SelectItem>
                      <SelectItem value="titre" className="hover:bg-blue-50">
                        Titre
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ordre de tri */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Ordre
                  </label>
                  <Select
                    value={filters.sortOrder || 'desc'}
                    onValueChange={(value) => handleFilterChange('sortOrder', value)}
                  >
                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="desc" className="hover:bg-blue-50">
                        Décroissant
                      </SelectItem>
                      <SelectItem value="asc" className="hover:bg-blue-50">
                        Croissant
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges des filtres actifs */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.statut && (
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 border-blue-300 px-3 py-1.5 text-xs font-medium"
            >
              Statut: {filters.statut}
              <X
                className="ml-2 h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => handleFilterChange('statut', undefined)}
              />
            </Badge>
          )}
          {filters.typeCible && (
            <Badge 
              variant="secondary" 
              className="bg-emerald-100 text-emerald-700 border-emerald-300 px-3 py-1.5 text-xs font-medium"
            >
              Type: {filters.typeCible}
              <X
                className="ml-2 h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => handleFilterChange('typeCible', undefined)}
              />
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
};