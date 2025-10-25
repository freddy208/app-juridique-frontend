/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter, Download,
  Edit, Trash2, Eye, ShieldCheck, Scale, UserCheck, User, Mail, Phone, Calendar,
  CheckSquare, X, AlertCircle,
  FileText, ArrowUpDown, Settings, Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useToast } from '@/lib/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUsers, useUserStats } from '@/lib/hooks/useUsers';
import type { RoleUtilisateur, StatutUtilisateur, UserFilters } from '@/lib/types/user.types';
import { roleBadges, statusBadges } from '@/lib/utils/badge-config';
import { UserAvatar } from '@/components/ui/Avatar';

// Configuration des badges de rôle
/*const roleBadges = {
  ADMIN: { color: 'destructive', icon: ShieldCheck, label: 'Administrateur' },
  AVOCAT: { color: 'blue', icon: Scale, label: 'Avocat' },
  ASSISTANT: { color: 'success', icon: UserCheck, label: 'Assistant' },
  SECRETAIRE: { color: 'purple', icon: ClipboardList, label: 'Secrétaire' },
  CLIENT: { color: 'secondary', icon: User, label: 'Client' },
};

const statutBadges = {
  ACTIF: { color: 'success', label: 'Actif' },
  INACTIF: { color: 'secondary', label: 'Inactif' },
  SUSPENDU: { color: 'destructive', label: 'Suspendu' },
  EN_ATTENTE: { color: 'warning', label: 'En attente' },
};*/

export default function ListeUtilisateursPage() {
  const { toast } = useToast();
  const router = useRouter();

  // États locaux
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Tri
  const [sortField, setSortField] = useState<string>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 🔥 UTILISATION DU HOOK useUsers avec les vrais endpoints
  const {
    users,
    pagination,
    isLoading,
    error,
    deleteUser,
    isDeleting,
    bulkAction,
    isBulkActioning,
    refetch,
  } = useUsers({
    page,
    limit: pageSize,
    ...filters,
    search: searchTerm || undefined,
    sortBy: sortField,
    sortOrder,
  });

  // 🔥 UTILISATION DU HOOK useUserStats
  const { data: stats, isLoading: isLoadingStats } = useUserStats();

  // Gestion de la sélection
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  };

  // Actions
  const handleView = (id: string) => {
    router.push(`/parametres/utilisateurs/profil/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/parametre/utilisateurs/${id}/modifier`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await deleteUser(id);
      // Le toast est déjà géré dans le hook
      setSelectedIds(new Set()); // Désélectionner tout
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
      console.error(error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) {
      toast({
        title: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un utilisateur.',
        variant: 'destructive',
      });
      return;
    }

    const userIds = Array.from(selectedIds);

    try {
      switch (action) {
        case 'changeRole':
          // TODO: Ouvrir un modal pour sélectionner le nouveau rôle
          toast({
            title: 'Fonctionnalité à venir',
            description: 'Changement de rôle en masse',
            variant: 'info',
          });
          break;

        case 'changeStatus':
          // TODO: Ouvrir un modal pour sélectionner le nouveau statut
          toast({
            title: 'Fonctionnalité à venir',
            description: 'Changement de statut en masse',
            variant: 'info',
          });
          break;

        case 'delete':
          if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userIds.length} utilisateur(s) ?`)) {
            return;
          }
          await bulkAction({
            action: 'delete',
            userIds,
          });
          setSelectedIds(new Set());
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    // TODO: Implémenter l'export Excel
    toast({
      title: 'Export en cours',
      description: 'Le fichier Excel sera téléchargé sous peu...',
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">
            Une erreur s&apos;est produite lors du chargement des utilisateurs
          </p>
          <Button onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gérez les membres de votre cabinet juridique
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push('/parametres/utilisteurs/nouveau')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {stats && !isLoadingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Actifs</p>
                    <p className="text-3xl font-bold mt-1">{stats.actifs}</p>
                  </div>
                  <CheckSquare className="w-12 h-12 text-green-200 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Avocats</p>
                    <p className="text-3xl font-bold mt-1">{stats.parRole?.AVOCAT || 0}</p>
                  </div>
                  <Scale className="w-12 h-12 text-red-200 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Assistants</p>
                    <p className="text-3xl font-bold mt-1">{stats.parRole?.ASSISTANT || 0}</p>
                  </div>
                  <UserCheck className="w-12 h-12 text-purple-200 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Admins</p>
                    <p className="text-3xl font-bold mt-1">{stats.parRole?.ADMIN || 0}</p>
                  </div>
                  <ShieldCheck className="w-12 h-12 text-amber-200 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset à la page 1
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 border-blue-300' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
                {(filters.role || filters.statut) && (
                  <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                    •
                  </Badge>
                )}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filtres étendus */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div>
                  <Label>Rôle</Label>
                  <Select
                    value={filters.role || 'all'}
                    onValueChange={(value) => {
                      setFilters({ ...filters, role: value === 'all' ? undefined : value as RoleUtilisateur });
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="AVOCAT">Avocat</SelectItem>
                      <SelectItem value="ASSISTANT">Assistant</SelectItem>
                      <SelectItem value="SECRETAIRE">Secrétaire</SelectItem>
                      <SelectItem value="JURISTE">Juriste</SelectItem>
                      <SelectItem value="STAGIAIRE">Stagiaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Statut</Label>
                  <Select
                    value={filters.statut || 'all'}
                    onValueChange={(value) => {
                      setFilters({ ...filters, statut: value === 'all' ? undefined : value as StatutUtilisateur });
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="ACTIF">Actif</SelectItem>
                      <SelectItem value="INACTIF">Inactif</SelectItem>
                      <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Spécialité</Label>
                  <Input
                    type="text"
                    placeholder="Ex: Droit des affaires"
                    value={filters.specialite || ''}
                    onChange={(e) => {
                      setFilters({ ...filters, specialite: e.target.value || undefined });
                      setPage(1);
                    }}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({});
                      setSearchTerm('');
                      setPage(1);
                    }}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Actions groupées */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      {selectedIds.size} utilisateur(s) sélectionné(s)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('changeRole')}
                      disabled={isBulkActioning}
                    >
                      Changer le rôle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('changeStatus')}
                      disabled={isBulkActioning}
                    >
                      Changer le statut
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkAction('delete')}
                      disabled={isBulkActioning || isDeleting}
                    >
                      {isBulkActioning || isDeleting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Supprimer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedIds(new Set())}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des utilisateurs */}
      <Card>
        <CardContent className="p-6">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-500"
                      >
                        {selectedIds.size === users.length && users.length > 0 && (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    </th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('nom')}
                        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Utilisateur
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 hidden md:table-cell">
                      <button
                        onClick={() => handleSort('email')}
                        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Contact
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('role')}
                        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Rôle
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 hidden lg:table-cell">
                      <button
                        onClick={() => handleSort('statut')}
                        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Statut
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left p-4 hidden xl:table-cell">Spécialité</th>
                    <th className="text-left p-4 hidden xl:table-cell">
                      <button
                        onClick={() => handleSort('dernièreConnexion')}
                        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Dernière connexion
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const RoleIcon = roleBadges[user.role]?.icon || User;
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4">
                          <button
                            onClick={() => toggleSelect(user.id)}
                            className="flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-500"
                          >
                            {selectedIds.has(user.id) && (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} size="md" showCrown={true} />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user.prenom} {user.nom}
                              </p>
                              <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </div>
                            {user.telephone && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone className="w-3 h-3" />
                                {user.telephone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={roleBadges[user.role]?.color as any} className="flex items-center gap-1 w-fit">
                            <RoleIcon className="w-3 h-3" />
                            {roleBadges[user.role]?.label || user.role}
                          </Badge>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <Badge variant={statusBadges[user.statut]?.color as any}>
                            {statusBadges[user.statut]?.label || user.statut}
                          </Badge>
                        </td>
                        <td className="p-4 hidden xl:table-cell">
                          <span className="text-sm text-gray-600">
                            {user.specialite || '-'}
                          </span>
                        </td>
                        <td className="p-4 hidden xl:table-cell">
                          {user.derniereConnexion ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(user.derniereConnexion).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Jamais connecté</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(user.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(user.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun utilisateur trouvé</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Vue carte pour mobile
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user, index) => {
                const RoleIcon = roleBadges[user.role]?.icon || User;
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSelect(user.id)}
                              className="flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-500"
                            >
                              {selectedIds.has(user.id) && (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              )}
                            </button>
                            <UserAvatar user={user} size="lg" showCrown={true} />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(user.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(user.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {user.prenom} {user.nom}
                        </h3>

                        <div className="flex gap-2 mb-4">
                          <Badge variant={roleBadges[user.role]?.color as any} className="flex items-center gap-1">
                            <RoleIcon className="w-3 h-3" />
                            {roleBadges[user.role]?.label || user.role}
                          </Badge>
                          <Badge variant={statusBadges[user.statut]?.color as any}>
                            {statusBadges[user.statut]?.label || user.statut}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.telephone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {user.telephone}
                            </div>
                          )}
                          {user.specialite && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {user.specialite}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-600">
                Affichage de {(page - 1) * pageSize + 1} à{' '}
                {Math.min(page * pageSize, pagination.total)} sur{' '}
                {pagination.total} utilisateur(s)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Précédent
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}