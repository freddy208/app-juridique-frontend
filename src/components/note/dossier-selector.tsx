// src/app/(dashboard)/notes/components/dossier-selector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileText, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib//hooks/use-debounce';
import apiClient from '@/lib/api/client';

interface Dossier {
  id: string;
  numeroUnique: string;
  titre: string;
  clientId?: string;
  clientNom?: string;
  statut?: string;
}

interface DossierSelectorProps {
  value?: string;
  onChange: (dossierId: string | undefined) => void;
  placeholder?: string;
}

export const DossierSelector: React.FC<DossierSelectorProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner un dossier..."
}) => {
  // ✅ Ajouter un état pour l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // ✅ Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const fetchDossiers = async () => {
      if (!debouncedSearchTerm) {
        setDossiers([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await apiClient.get(`/dossiers/search?q=${debouncedSearchTerm}&limit=10`);
        setDossiers(response.data.data || []);
      } catch (error) {
        console.error('Erreur lors de la recherche de dossiers:', error);
        setDossiers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, [debouncedSearchTerm, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
    if (value) {
      const fetchDossier = async () => {
        try {
          const response = await apiClient.get(`/dossiers/${value}`);
          setSelectedDossier(response.data.data);
        } catch (error) {
          console.error('Erreur lors de la récupération du dossier:', error);
          setSelectedDossier(null);
        }
      };

      fetchDossier();
    } else {
      setSelectedDossier(null);
    }
  }, [value, isMounted]);

  const handleSelect = (dossierId: string) => {
    onChange(dossierId);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setSelectedDossier(null);
  };

  // ✅ Rendu simplifié pendant l'hydratation
  if (!isMounted) {
    return (
      <div className="space-y-2">
        <Label htmlFor="dossier-selector">Dossier</Label>
        <div className="h-10 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="dossier-selector">Dossier</Label>
      
      {selectedDossier ? (
        <div className="flex items-center justify-between p-2 border rounded-md bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            <div>
              <span className="font-medium">{selectedDossier.numeroUnique}</span>
              <span className="mx-2">-</span>
              <span>{selectedDossier.titre}</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {placeholder}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Rechercher un dossier..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : dossiers.length === 0 ? (
                  <CommandEmpty>Aucun dossier trouvé.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {dossiers.map((dossier) => (
                      <CommandItem
                        key={dossier.id}
                        value={dossier.id}
                        onSelect={() => handleSelect(dossier.id)}
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <div>
                            <div className="font-medium">{dossier.numeroUnique}</div>
                            <div className="text-sm text-gray-500">{dossier.titre}</div>
                            {dossier.clientNom && (
                              <div className="text-sm text-gray-500">Client: {dossier.clientNom}</div>
                            )}
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === dossier.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};