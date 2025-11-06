/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * DOSSIER FILTERS
 * ============================================
 * Barre de recherche + filtres avancés
 * Gestion des paramètres dans l'URL
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  TypeDossier,
  StatutDossier,
  NiveauRisque,
} from '@/lib/types/dossier';
import {
  TYPE_DOSSIER_CONFIG,
  STATUT_DOSSIER_CONFIG,
  NIVEAU_RISQUE_CONFIG,
} from '@/lib/dossiers/constants';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const DossierFilters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Récupérer les valeurs actuelles des filtres depuis l'URL
  const currentSearch = searchParams.get('titre') || '';
  const currentType = searchParams.get('type') || '';
  const currentStatut = searchParams.get('statut') || '';
  const currentRisque = searchParams.get('risqueJuridique') || '';

  // Fonction pour mettre à jour les paramètres de l'URL
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Réinitialiser la pagination
    params.delete('page');
    
    router.push(`/dossiers?${params.toString()}`);
  };

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    router.push('/dossiers');
  };

  // Compter le nombre de filtres actifs
  const activeFiltersCount = [
    currentSearch,
    currentType,
    currentStatut,
    currentRisque,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-8">
      {/* Barre de recherche principale */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Input de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher un dossier par titre..."
            defaultValue={currentSearch}
            onChange={(e: { target: { value: any; }; }) => {
              // Debounce la recherche
              const value = e.target.value;
              setTimeout(() => updateParams('titre', value), 500);
            }}
            className="pl-10 h-11 border-gray-300 focus:border-[#4169e1] focus:ring-[#4169e1]"
          />
        </div>

        {/* Bouton filtres avancés */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`h-11 px-4 relative ${
            showAdvancedFilters ? 'bg-[#4169e1] text-white hover:bg-[#2e4fa8]' : ''
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown
            className={`h-4 w-4 ml-2 transition-transform ${
              showAdvancedFilters ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {/* Bouton réinitialiser (si filtres actifs) */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-11 px-4 text-gray-600 hover:text-red-600"
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Panneau de filtres avancés */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtre Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Type de dossier
                  </label>
                  <Select
                    value={currentType}
                    onValueChange={(value: string) => updateParams('type', value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les types</SelectItem>
                      {Object.entries(TYPE_DOSSIER_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre Statut */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <Select
                    value={currentStatut}
                    onValueChange={(value: string) => updateParams('statut', value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      {Object.entries(STATUT_DOSSIER_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                            <span>{config.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre Risque */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Niveau de risque
                  </label>
                  <Select
                    value={currentRisque}
                    onValueChange={(value: string) => updateParams('risqueJuridique', value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les niveaux</SelectItem>
                      {Object.entries(NIVEAU_RISQUE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Résumé des filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Filtres actifs :</p>
                  <div className="flex flex-wrap gap-2">
                    {currentSearch && (
                      <Badge variant="secondary" className="gap-1">
                        Recherche: &quot;{currentSearch}&quot;
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => updateParams('titre', '')}
                        />
                      </Badge>
                    )}
                    {currentType && (
                      <Badge variant="secondary" className="gap-1">
                        Type: {TYPE_DOSSIER_CONFIG[currentType as TypeDossier]?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => updateParams('type', '')}
                        />
                      </Badge>
                    )}
                    {currentStatut && (
                      <Badge variant="secondary" className="gap-1">
                        Statut: {STATUT_DOSSIER_CONFIG[currentStatut as StatutDossier]?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => updateParams('statut', '')}
                        />
                      </Badge>
                    )}
                    {currentRisque && (
                      <Badge variant="secondary" className="gap-1">
                        Risque: {NIVEAU_RISQUE_CONFIG[currentRisque as NiveauRisque]?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => updateParams('risqueJuridique', '')}
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};