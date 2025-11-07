/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/notes/components/note-filters.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { NotesQuery, StatutNote } from '../../lib/types/note.types';
import { DateRange } from 'react-day-picker'; // Importer le type DateRange de react-day-picker

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const handleFilterChange = (key: keyof NotesQuery, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      handleFilterChange('dateDebut', format(range.from, 'yyyy-MM-dd'));
    } else {
      handleFilterChange('dateDebut', undefined);
    }
    
    if (range?.to) {
      handleFilterChange('dateFin', format(range.to, 'yyyy-MM-dd'));
    } else {
      handleFilterChange('dateFin', undefined);
    }
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof NotesQuery];
    return value !== undefined && value !== '' && key !== 'page' && key !== 'limit';
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Filtres
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={filters.statut || ''}
            onValueChange={(value) => handleFilterChange('statut', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value={StatutNote.ACTIF}>Actif</SelectItem>
              <SelectItem value={StatutNote.SUPPRIME}>Supprimé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="typeCible">Type de cible</Label>
          <Select
            value={filters.typeCible || ''}
            onValueChange={(value) => handleFilterChange('typeCible', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="dossier">Dossier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">Trier par</Label>
          <Select
            value={`${filters.sortBy || 'creeLe'}-${filters.sortOrder || 'desc'}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creeLe-desc">Date de création (récent)</SelectItem>
              <SelectItem value="creeLe-asc">Date de création (ancien)</SelectItem>
              <SelectItem value="titre-asc">Titre (A-Z)</SelectItem>
              <SelectItem value="titre-desc">Titre (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Plage de dates</Label>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: fr })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: fr })
                  )
                ) : (
                  <span>Sélectionner une plage</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};