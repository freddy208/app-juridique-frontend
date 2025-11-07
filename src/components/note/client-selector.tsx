// src/app/(dashboard)/notes/components/client-selector.tsx
"use client";

import React, { useState } from 'react';
import { useClients } from '../../lib/hooks/clients/useClients';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, User, Building2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientSelectorProps {
  value?: string;
  onChange: (clientId: string | undefined) => void;
  error?: string;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  value, 
  onChange,
  error 
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { clients, isLoading } = useClients({ 
    limit: 50,
    search: searchTerm 
  });

  const selectedClient = clients.find(client => client.id === value);

  const handleSelect = (clientId: string) => {
    onChange(clientId === value ? undefined : clientId);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
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
              {value ? (
                <>
                  {selectedClient?.typeClient === 'ENTREPRISE' ? (
                    <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                  ) : (
                    <User className="h-4 w-4 text-blue-600 shrink-0" />
                  )}
                  <span className="truncate text-sm font-medium">
                    {selectedClient?.entreprise || 
                     `${selectedClient?.prenom} ${selectedClient?.nom}`}
                  </span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm">Sélectionner un client</span>
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
              placeholder="Rechercher un client..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-none focus:ring-0 text-sm"
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                {isLoading ? "Chargement..." : "Aucun client trouvé."}
              </CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.id}
                    onSelect={() => handleSelect(client.id)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value === client.id ? "opacity-100 text-blue-600" : "opacity-0"
                      )}
                    />
                    {client.typeClient === 'ENTREPRISE' ? (
                      <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {client.entreprise || `${client.prenom} ${client.nom}`}
                      </span>
                      {client.email && (
                        <span className="text-xs text-gray-500 truncate">
                          {client.email}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
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