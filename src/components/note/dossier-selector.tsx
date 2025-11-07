"use client";

import React, { useState } from 'react';
import { useDossiers } from '../../lib/hooks/dossier/useDossiers';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, FolderOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

// Assurez-vous d'avoir ce type défini
interface Dossier {
  id: string;
  numeroUnique: string;
  titre: string;
  statut: string;
  client?: {
    id: string;
    prenom: string;
    nom: string;
    entreprise?: string;
  };
}

interface DossierSelectorProps {
  value?: string;
  onChange: (dossierId: string | undefined) => void;
  error?: string;
  clientId?: string;
}

export const DossierSelector: React.FC<DossierSelectorProps> = ({ 
  value, 
  onChange,
  error,
  clientId 
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: dossiersData, isLoading } = useDossiers({ 
    limit: 50,
    titre: searchTerm, // Maintenant cette propriété est valide
    ...(clientId && { clientId })
  });

  // Accédez aux données selon la structure de votre réponse
  const dossiers = dossiersData?.data || []; // Correction ici

  const selectedDossier = dossiers.find((dossier: Dossier) => dossier.id === value);

  const handleSelect = (dossierId: string) => {
    onChange(dossierId === value ? undefined : dossierId);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const getStatutColor = (statut: string) => {
    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
      OUVERT: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      EN_COURS: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      SUSPENDU: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      CLOS: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
      ARCHIVE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    };
    return statusColors[statut] || statusColors.EN_COURS;
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-[42px] py-2.5 px-4",
              "bg-white hover:bg-gray-50",
              "border-gray-300 hover:border-blue-400",
              "text-gray-900",
              "transition-all duration-200",
              error && "border-red-400 focus:border-red-500",
              !value && "text-gray-500"
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {value && selectedDossier ? (
                <>
                  <FolderOpen className="h-4 w-4 text-blue-600 shrink-0" />
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="truncate text-sm font-medium">
                      {selectedDossier.numeroUnique}
                    </span>
                    <span className="truncate text-xs text-gray-600">
                      {selectedDossier.titre}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <FolderOpen className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm">Sélectionner un dossier</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {value && (
                <X 
                  className="h-4 w-4 text-gray-500 hover:text-red-600 transition-colors" 
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white shadow-xl border-gray-200" align="start">
          <Command className="bg-white">
            <CommandInput 
              placeholder="Rechercher un dossier..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-none focus:ring-0 text-sm"
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                {isLoading ? "Chargement..." : "Aucun dossier trouvé."}
              </CommandEmpty>
              <CommandGroup>
                {dossiers.map((dossier: Dossier) => {
                  const statutColors = getStatutColor(dossier.statut);
                  return (
                    <CommandItem
                      key={dossier.id}
                      value={dossier.id}
                      onSelect={() => handleSelect(dossier.id)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value === dossier.id ? "opacity-100 text-blue-600" : "opacity-0"
                        )}
                      />
                      <FolderOpen className="h-4 w-4 text-blue-600 shrink-0" />
                      <div className="flex flex-col flex-1 min-w-0 gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-blue-600">
                            {dossier.numeroUnique}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] px-1.5 py-0 h-5 border",
                              statutColors.bg,
                              statutColors.text,
                              statutColors.border
                            )}
                          >
                            {dossier.statut.replace('_', ' ')}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-900 truncate font-medium">
                          {dossier.titre}
                        </span>
                        {dossier.client && (
                          <span className="text-xs text-gray-500 truncate">
                            Client: {dossier.client.entreprise || 
                                    `${dossier.client.prenom} ${dossier.client.nom}`}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};