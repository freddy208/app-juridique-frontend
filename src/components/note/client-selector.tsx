// src/app/(dashboard)/notes/components/client-selector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Building, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';
import apiClient from '@/lib/api/client';

interface Client {
  id: string;
  prenom: string;
  nom: string;
  entreprise?: string;
  email?: string;
  telephone?: string;
}

interface ClientSelectorProps {
  value?: string;
  onChange: (clientId: string | undefined) => void;
  placeholder?: string;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner un client..."
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchClients = async () => {
      if (!debouncedSearchTerm) {
        setClients([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await apiClient.get(`/clients/search?q=${debouncedSearchTerm}&limit=10`);
        setClients(response.data.data || []);
      } catch (error) {
        console.error('Erreur lors de la recherche de clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (value) {
      const fetchClient = async () => {
        try {
          const response = await apiClient.get(`/clients/${value}`);
          setSelectedClient(response.data.data);
        } catch (error) {
          console.error('Erreur lors de la récupération du client:', error);
          setSelectedClient(null);
        }
      };

      fetchClient();
    } else {
      setSelectedClient(null);
    }
  }, [value]);

  const handleSelect = (clientId: string) => {
    onChange(clientId);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setSelectedClient(null);
  };

  const getClientDisplayName = (client: Client) => {
    if (client.entreprise) {
      return client.entreprise;
    }
    return `${client.prenom} ${client.nom}`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="client-selector">Client</Label>
      
      {selectedClient ? (
        <div className="flex items-center justify-between p-2 border rounded-md bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">{getClientDisplayName(selectedClient)}</span>
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
                placeholder="Rechercher un client..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : clients.length === 0 ? (
                  <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.id}
                        onSelect={() => handleSelect(client.id)}
                      >
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          <div>
                            <div className="font-medium">{getClientDisplayName(client)}</div>
                            {client.entreprise && (
                              <div className="text-sm text-gray-500">
                                {client.prenom} {client.nom}
                              </div>
                            )}
                            {client.email && (
                              <div className="text-sm text-gray-500">{client.email}</div>
                            )}
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === client.id ? "opacity-100" : "opacity-0"
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