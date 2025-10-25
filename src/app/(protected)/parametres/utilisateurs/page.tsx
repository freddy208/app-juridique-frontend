/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import { useUsers } from '@/lib/hooks/useUsers';
import { RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';

// ============================================
// PAGE UTILISATEURS - version avec hook useUsers
// ============================================

export default function UsersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('tous');
  const [selectedStatut, setSelectedStatut] = useState<string>('tous');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // ✅ Hook pour charger les utilisateurs depuis l'API
  const roleMap: Record<string, RoleUtilisateur> = {
    admin: RoleUtilisateur.ADMIN,
    avocat: RoleUtilisateur.AVOCAT,
    assistant: RoleUtilisateur.ASSISTANT,
    stagiaire: RoleUtilisateur.STAGIAIRE,
  };

  const statutMap: Record<string, StatutUtilisateur> = {
    actif: StatutUtilisateur.ACTIF,
    inactif: StatutUtilisateur.INACTIF,
    suspendu: StatutUtilisateur.SUSPENDU,
  };

  const filters = {
    search: searchQuery.trim() || undefined,
    role: selectedRole !== 'tous' ? roleMap[selectedRole] : undefined,
    statut: selectedStatut !== 'tous' ? statutMap[selectedStatut] : undefined,
    page: 1,
    limit: 50,
  };


  // ✅ Charger les utilisateurs depuis l'API avec filtres
  const { users, isLoading, error } = useUsers(filters);

  // ✅ Filtrage en mémoire (local)
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'tous' || user.role === selectedRole;
      const matchesStatut = selectedStatut === 'tous' || user.statut === selectedStatut;

      return matchesSearch && matchesRole && matchesStatut;
    });
  }, [users, searchQuery, selectedRole, selectedStatut]);

  // ✅ Statistiques basées sur les données réelles
  const stats = useMemo(() => ({
    total: users.length,
    actifs: users.filter(u => u.statut === StatutUtilisateur.ACTIF).length,
    admins: users.filter(u => u.role === RoleUtilisateur.ADMIN).length,
    avocats: users.filter(u => u.role === RoleUtilisateur.AVOCAT).length
  }), [users]);

  const getRoleBadgeClass = (role: string) => {
    const classes = {
      admin: 'bg-bordeaux-50 text-bordeaux-600 border-bordeaux-200',
      avocat: 'bg-primary-50 text-primary-700 border-primary-200',
      assistant: 'bg-gold-50 text-gold-700 border-gold-200',
      stagiaire: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return classes[role as keyof typeof classes] || classes.stagiaire;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'actif': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'inactif': return <XCircle className="w-4 h-4 text-slate-400" />;
      case 'suspendu': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-slate-500">
        Chargement des utilisateurs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500">
        Erreur lors du chargement des utilisateurs.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1 font-serif text-primary-900 mb-2">
                Gestion des Utilisateurs
              </h1>
              <p className="text-body text-slate-600">
                Gérez les membres de votre cabinet juridique
              </p>
            </div>
            <Link
              href="/parametres/utilisateurs/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-elegant hover:shadow-premium"
            >
              <UserPlus className="w-5 h-5" />
              Nouvel Utilisateur
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Utilisateurs"
            value={stats.total}
            icon={<Users className="w-6 h-6 text-primary-600" />}
            iconBg="bg-primary-100"
            valueColor="text-primary-900"
          />
          <StatCard
            label="Utilisateurs Actifs"
            value={stats.actifs}
            icon={<CheckCircle className="w-6 h-6 text-success" />}
            iconBg="bg-green-100"
            valueColor="text-success"
          />
          <StatCard
            label="Administrateurs"
            value={stats.admins}
            icon={<Shield className="w-6 h-6 text-bordeaux-600" />}
            iconBg="bg-bordeaux-50"
            valueColor="text-bordeaux-600"
          />
          <StatCard
            label="Avocats"
            value={stats.avocats}
            icon={<Users className="w-6 h-6 text-primary-600" />}
            iconBg="bg-primary-100"
            valueColor="text-primary-700"
          />
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-slate-600" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
              <SelectFilter
                label="Rôle"
                value={selectedRole}
                onChange={setSelectedRole}
                options={[
                  { value: 'tous', label: 'Tous les rôles' },
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'avocat', label: 'Avocat' },
                  { value: 'assistant', label: 'Assistant' },
                  { value: 'stagiaire', label: 'Stagiaire' }
                ]}
              />
              <SelectFilter
                label="Statut"
                value={selectedStatut}
                onChange={setSelectedStatut}
                options={[
                  { value: 'tous', label: 'Tous les statuts' },
                  { value: 'actif', label: 'Actif' },
                  { value: 'inactif', label: 'Inactif' },
                  { value: 'suspendu', label: 'Suspendu' }
                ]}
              />
            </div>
          )}
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">Contact</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">Rôle</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">Statut</th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">Dernier accès</th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.prenom?.[0]}{user.nom?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.prenom} {user.nom}</p>
                          <p className="text-body-sm text-slate-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-body-sm text-slate-600">
                          <Mail className="w-4 h-4" />{user.email}
                        </div>
                        <div className="flex items-center gap-2 text-body-sm text-slate-600">
                          <Phone className="w-4 h-4" />{user.telephone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-body-sm font-medium border ${getRoleBadgeClass(user.role)}`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatutIcon(user.statut)}
                        <span className="text-body-sm font-medium text-slate-700 capitalize">{user.statut}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-body-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {user.derniereConnexion
                          ? new Date(user.derniereConnexion).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '—'}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-primary-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================
// COMPOSANTS UTILITAIRES
// ============================================

function StatCard({ label, value, icon, iconBg, valueColor }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-sm text-slate-600 mb-1">{label}</p>
          <p className={`text-h2 font-bold ${valueColor}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-body-sm font-medium text-slate-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
