/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/parametres/utilisateurs/page.tsx - VERSION DEBUG
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Grid3x3, 
  List, 
  Trash2, 
  Edit, 
  UserCheck,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUsers } from '@/lib/hooks/useUsers';
import { 
  RoleUtilisateur, 
  StatutUtilisateur,
  type User,
  ROLE_LABELS,
  STATUS_LABELS,
} from '@/lib/types/user.types';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { statusBadges } from '@/lib/utils/badge-config';

// Types
type ViewMode = 'grid' | 'table';

interface FilterState {
  search: string;
  role: RoleUtilisateur | 'ALL';
  statut: StatutUtilisateur | 'ALL';
}

// Badge Component
const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'blue' | 'purple' | 'orange' | 'teal';
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    destructive: 'bg-red-50 text-red-700 border-red-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default function UsersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: 'ALL',
    statut: StatutUtilisateur.ACTIF, // Par défaut ACTIF
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Query params
  const queryParams = useMemo(() => {
    const params: any = {
      page: 1,
      limit: 100,
      sortBy: 'nom',
      sortOrder: 'asc',
    };

    if (filters.search) params.search = filters.search;
    if (filters.role !== 'ALL') params.role = filters.role;
    if (filters.statut !== 'ALL') params.statut = filters.statut;

    console.log('🔧 [UsersPage] Query params calculés:', params);
    return params;
  }, [filters]);

  const { 
    users, 
    pagination,
    isLoading, 
    error,
    deleteUser, 
    isDeleting 
  } = useUsers(queryParams);

  // Logs à chaque rendu
  useEffect(() => {
    console.group('🎨 [UsersPage] Rendu de la page');
    console.log('État des filtres:', filters);
    console.log('Query params:', queryParams);
    console.log('Loading:', isLoading);
    console.log('Error:', error);
    console.log('Utilisateurs reçus:', {
      count: users.length,
      isArray: Array.isArray(users),
      premiers3: users.slice(0, 3),
    });
    console.log('Pagination:', pagination);
    console.groupEnd();
  }, [filters, queryParams, isLoading, error, users, pagination]);

  // Export Excel
  const handleExport = () => {
    console.log('📥 [UsersPage] Export Excel - Début');
    try {
      if (!users || users.length === 0) {
        toast.error('Aucune donnée à exporter');
        return;
      }

      const exportData = users.map(user => ({
        'Prénom': user.prenom,
        'Nom': user.nom,
        'Email': user.email,
        'Rôle': ROLE_LABELS[user.role],
        'Statut': STATUS_LABELS[user.statut],
        'Téléphone': user.telephone || '-',
        'Spécialité': user.specialite || '-',
        'Barreau': user.barreau || '-',
        'N° Permis': user.numeroPermis || '-',
        'Date création': new Date(user.creeLe).toLocaleDateString('fr-FR'),
      }));

      console.log('📥 [UsersPage] Données formatées pour export:', exportData.length, 'lignes');

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');
      
      const colWidths = [
        { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 10 },
        { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      ];
      ws['!cols'] = colWidths;

      const filename = `utilisateurs_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      console.log('✅ [UsersPage] Export réussi:', filename);
      toast.success(`Export réussi ! ${users.length} utilisateurs exportés`);
    } catch (error) {
      console.error('❌ [UsersPage] Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  // Delete user
  const handleDelete = () => {
    if (!userToDelete) return;
    
    console.log('🗑️ [UsersPage] Suppression utilisateur:', userToDelete.id);
    deleteUser(userToDelete.id, {
      onSuccess: () => {
        console.log('✅ [UsersPage] Suppression réussie');
        toast.success('Utilisateur supprimé avec succès');
        setUserToDelete(null);
      },
      onError: (err: any) => {
        console.error('❌ [UsersPage] Erreur suppression:', err);
        toast.error('Erreur lors de la suppression');
      },
    });
  };

  // Debug panel (à retirer en production)
  const DebugPanel = () => (
    <div className="bg-slate-900 text-white p-4 rounded-lg mb-6 font-mono text-xs">
      <div className="font-bold mb-2">🐛 DEBUG PANEL</div>
      <div>Loading: {String(isLoading)}</div>
      <div>Error: {error ? String(error) : 'null'}</div>
      <div>Users count: {users.length}</div>
      <div>Users isArray: {String(Array.isArray(users))}</div>
      <div>Filters: {JSON.stringify(filters)}</div>
      <div>Query params: {JSON.stringify(queryParams)}</div>
      <div>Pagination: {JSON.stringify(pagination)}</div>
      {users.length > 0 && (
        <div className="mt-2">
          <div>Premier utilisateur:</div>
          <pre className="bg-slate-800 p-2 rounded mt-1 overflow-auto max-h-40">
            {JSON.stringify(users[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                Gestion des Utilisateurs
              </h1>
              <p className="text-slate-600">
                Gérez les membres de votre cabinet juridique
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/parametres/utilisateurs/nouveau')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nouvel utilisateur</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Debug Panel - RETIREZ EN PRODUCTION */}
        <DebugPanel />

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { 
              label: 'Total', 
              value: users.length, 
              icon: Users, 
              color: 'from-blue-500 to-blue-600',
              textColor: 'text-blue-700'
            },
            { 
              label: 'Actifs', 
              value: users.filter(u => u.statut === StatutUtilisateur.ACTIF).length, 
              icon: UserCheck, 
              color: 'from-green-500 to-green-600',
              textColor: 'text-green-700'
            },
            { 
              label: 'Inactifs', 
              value: users.filter(u => u.statut === StatutUtilisateur.INACTIF).length, 
              icon: UserX, 
              color: 'from-slate-500 to-slate-600',
              textColor: 'text-slate-700'
            },
            { 
              label: 'Suspendus', 
              value: users.filter(u => u.statut === StatutUtilisateur.SUSPENDU).length, 
              icon: AlertCircle, 
              color: 'from-red-500 to-red-600',
              textColor: 'text-red-700'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-elegant transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters || filters.role !== 'ALL' || filters.statut !== StatutUtilisateur.ACTIF
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                disabled={users.length === 0}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rôle
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => setFilters({ ...filters, role: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="ALL">Tous les rôles</option>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={filters.statut}
                      onChange={(e) => setFilters({ ...filters, statut: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="ALL">Tous les statuts</option>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setFilters({ search: '', role: 'ALL', statut: StatutUtilisateur.ACTIF })}
                      className="w-full px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-600">Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-slate-200 p-12 text-center"
          >
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-slate-600 mb-6">
              {filters.search || filters.role !== 'ALL' || filters.statut !== StatutUtilisateur.ACTIF
                ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier utilisateur.'}
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {user.prenom.charAt(0)}{user.nom.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {user.prenom} {user.nom}
                            </div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="blue">
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusBadges[user.statut].color}>
                          {statusBadges[user.statut].label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-slate-600">
                          {user.telephone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/parametres/utilisateurs/${user.id}/modifier`)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setUserToDelete(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-luxe max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Supprimer cet utilisateur ?
            </h3>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer {userToDelete.prenom} {userToDelete.nom} ?
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}