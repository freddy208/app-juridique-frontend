'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Download, 
  Upload,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { TablePagination } from '@/components/tables/TablePagination';
import { UserCard } from './UserCard';
import { UserFilters } from './UserFilters';
import { User as UserType, RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import { cn } from '@/lib/utils';

interface UsersListProps {
  users: UserType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading?: boolean;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: StatutUtilisateur) => void;
  onView: (id: string) => void;
  onAddUser: () => void;
  onPageChange: (page: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFiltersChange: (filters: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any;
  onExport?: () => void;
  onImport?: () => void;
  selectedUsers: string[];
  onSelectUser: (id: string, selected: boolean) => void;
  onSelectAll: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  className?: string;
}

export function UsersList({
  users,
  pagination,
  isLoading = false,
  onEdit,
  onDelete,
  onChangeStatus,
  onView,
  onAddUser,
  onPageChange,
  onFiltersChange,
  filters,
  onExport,
  onImport,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  viewMode,
  onViewModeChange,
  className
}: UsersListProps) {
  const [bulkActionMenuOpen, setBulkActionMenuOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      // Désélectionner tout le monde
      users.forEach(user => onSelectUser(user.id, false));
    } else {
      // Sélectionner tout le monde
      users.forEach(user => onSelectUser(user.id, true));
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <span className="text-sm text-slate-500">
            ({pagination.total} utilisateur{pagination.total !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Boutons d'import/export */}
          <div className="hidden sm:flex items-center space-x-2">
            {onImport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onImport}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            )}
            
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            )}
          </div>
          
          {/* Bouton d'ajout */}
          <Button
            onClick={onAddUser}
            className="bg-gradient-to-r from-primary-600 to-bordeaux-600 hover:from-primary-700 hover:to-bordeaux-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <UserFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {/* Actions en masse */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-primary-50 border border-primary-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare
                className="h-5 w-5 text-primary-600 cursor-pointer"
                onClick={handleSelectAll}
              />
              <span className="text-sm font-medium text-primary-900">
                {selectedUsers.length} utilisateur{selectedUsers.length !== 1 ? 's' : ''} sélectionné{selectedUsers.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectAll()}
              >
                {selectedUsers.length === users.length ? 'Désélectionner tout' : 'Sélectionner tout'}
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkActionMenuOpen(!bulkActionMenuOpen)}
                >
                  Actions en masse
                </Button>
                
                {bulkActionMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => {
                          // Implémenter l'action de changement de statut
                          setBulkActionMenuOpen(false);
                        }}
                      >
                        Changer le statut
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => {
                          // Implémenter l'action de changement de rôle
                          setBulkActionMenuOpen(false);
                        }}
                      >
                        Changer le rôle
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10"
                        onClick={() => {
                          // Implémenter l'action de suppression
                          setBulkActionMenuOpen(false);
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Changement de vue */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={cn(
              "relative inline-flex items-center px-4 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500",
              viewMode === 'grid' && "bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
            )}
            onClick={() => onViewModeChange('grid')}
          >
            Grille
          </button>
          <button
            type="button"
            className={cn(
              "relative inline-flex items-center px-4 py-2 rounded-r-md border-t border-r border-b border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 -ml-px",
              viewMode === 'table' && "bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
            )}
            onClick={() => onViewModeChange('table')}
          >
            Tableau
          </button>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : users.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-slate-500 mb-6">
              {filters.search || filters.role || filters.statut
                ? 'Essayez de modifier vos filtres pour voir plus de résultats.'
                : 'Commencez par ajouter votre premier utilisateur.'}
            </p>
            <Button onClick={onAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeStatus={onChangeStatus}
                  onView={onView}
                  selected={selectedUsers.includes(user.id)}
                  onSelect={onSelectUser}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Square
                              className="h-4 w-4 mr-2 cursor-pointer"
                              onClick={handleSelectAll}
                            />
                            Utilisateur
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Spécialité
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => onSelectUser(user.id, e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {user.prenom} {user.nom}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {user.telephone || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === RoleUtilisateur.ADMIN
                                ? 'bg-bordeaux-100 text-bordeaux-800'
                                : user.role === RoleUtilisateur.DG
                                ? 'bg-gold-100 text-gold-800'
                                : user.role === RoleUtilisateur.AVOCAT
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.statut === StatutUtilisateur.ACTIF
                                ? 'bg-success text-white'
                                : user.statut === StatutUtilisateur.INACTIF
                                ? 'bg-slate-500 text-white'
                                : 'bg-warning text-white'
                            }`}>
                              {user.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {user.specialite || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => onView(user.id)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Voir
                              </button>
                              <button
                                type="button"
                                onClick={() => onEdit(user)}
                                className="text-slate-600 hover:text-slate-900"
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                onClick={() => onDelete(user.id)}
                                className="text-danger hover:text-danger"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          <TablePagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}