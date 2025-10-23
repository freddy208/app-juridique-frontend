'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import type { UserFilters as UserFiltersType } from '@/lib/types/user.types';
import { cn } from '@/lib/utils';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  className?: string;
}

const roleOptions = [
  { value: '', label: 'Tous les rôles' },
  { value: RoleUtilisateur.ADMIN, label: 'Administrateur' },
  { value: RoleUtilisateur.DG, label: 'Directeur Général' },
  { value: RoleUtilisateur.AVOCAT, label: 'Avocat' },
  { value: RoleUtilisateur.SECRETAIRE, label: 'Secrétaire' },
  { value: RoleUtilisateur.ASSISTANT, label: 'Assistant' },
  { value: RoleUtilisateur.JURISTE, label: 'Juriste' },
  { value: RoleUtilisateur.STAGIAIRE, label: 'Stagiaire' },
];

const statutOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: StatutUtilisateur.ACTIF, label: 'Actif' },
  { value: StatutUtilisateur.INACTIF, label: 'Inactif' },
  { value: StatutUtilisateur.SUSPENDU, label: 'Suspendu' },
];

export function UserFilters({ filters, onFiltersChange, className }: UserFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleFilterChange = (key: keyof UserFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const hasActiveFilters = !!(
    filters.role ||
    filters.statut ||
    filters.specialite ||
    filters.barreau ||
    filters.search
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('bg-white rounded-lg shadow-elegant p-4', className)}
    >
      <div className="flex flex-col space-y-4">
        {/* Barre de recherche */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn('transition-transform duration-200', isExpanded && 'rotate-180')}
          >
            <Filter className="h-4 w-4" />
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filtres avancés */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100"
          >
            {/* Filtre par rôle */}
            <Select
              label="Rôle"
              options={roleOptions}
              value={filters.role || ''}
              onChange={(value: string) => handleFilterChange('role', value)}
            />

            {/* Filtre par statut */}
            <Select
              label="Statut"
              options={statutOptions}
              value={filters.statut || ''}
              onChange={(value: string) => handleFilterChange('statut', value)}
            />

            {/* Filtre par spécialité */}
            <Input
              label="Spécialité"
              placeholder="Ex: Droit des affaires"
              value={filters.specialite || ''}
              onChange={(e) => handleFilterChange('specialite', e.target.value)}
            />

            {/* Filtre par barreau */}
            <Input
              label="Barreau"
              placeholder="Ex: Douala"
              value={filters.barreau || ''}
              onChange={(e) => handleFilterChange('barreau', e.target.value)}
            />
          </motion.div>
        )}

        {/* Badges de filtres actifs */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.role && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Rôle: {roleOptions.find((opt) => opt.value === filters.role)?.label}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('role', '')} />
              </Badge>
            )}
            {filters.statut && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Statut: {statutOptions.find((opt) => opt.value === filters.statut)?.label}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('statut', '')} />
              </Badge>
            )}
            {filters.specialite && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Spécialité: {filters.specialite}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('specialite', '')} />
              </Badge>
            )}
            {filters.barreau && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Barreau: {filters.barreau}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('barreau', '')} />
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ✅ Export cohérent
export default UserFilters;
