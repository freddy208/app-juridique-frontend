'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Types
interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'admin' | 'avocat' | 'assistant' | 'stagiaire';
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: string;
  dernierAcces: string;
  avatar?: string;
}

// Données de démonstration
const mockUsers: User[] = [
  {
    id: '1',
    nom: 'Dubois',
    prenom: 'Jean',
    email: 'jean.dubois@cabinet.com',
    telephone: '+33 6 12 34 56 78',
    role: 'admin',
    statut: 'actif',
    dateCreation: '2024-01-15',
    dernierAcces: '2025-10-25 09:30'
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@cabinet.com',
    telephone: '+33 6 23 45 67 89',
    role: 'avocat',
    statut: 'actif',
    dateCreation: '2024-03-20',
    dernierAcces: '2025-10-25 08:15'
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Marie',
    email: 'marie.bernard@cabinet.com',
    telephone: '+33 6 34 56 78 90',
    role: 'assistant',
    statut: 'actif',
    dateCreation: '2024-06-10',
    dernierAcces: '2025-10-24 17:45'
  },
  {
    id: '4',
    nom: 'Petit',
    prenom: 'Lucas',
    email: 'lucas.petit@cabinet.com',
    telephone: '+33 6 45 67 89 01',
    role: 'stagiaire',
    statut: 'inactif',
    dateCreation: '2024-09-01',
    dernierAcces: '2025-10-20 14:20'
  }
];

export default function UsersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('tous');
  const [selectedStatut, setSelectedStatut] = useState<string>('tous');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtrer les utilisateurs
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'tous' || user.role === selectedRole;
    const matchesStatut = selectedStatut === 'tous' || user.statut === selectedStatut;
    
    return matchesSearch && matchesRole && matchesStatut;
  });

  // Statistiques
  const stats = {
    total: mockUsers.length,
    actifs: mockUsers.filter(u => u.statut === 'actif').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    avocats: mockUsers.filter(u => u.role === 'avocat').length
  };

  // Fonction pour obtenir la couleur du badge de rôle
  const getRoleBadgeClass = (role: string) => {
    const classes = {
      admin: 'bg-bordeaux-50 text-bordeaux-600 border-bordeaux-200',
      avocat: 'bg-primary-50 text-primary-700 border-primary-200',
      assistant: 'bg-gold-50 text-gold-700 border-gold-200',
      stagiaire: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return classes[role as keyof typeof classes] || classes.stagiaire;
  };

  // Fonction pour obtenir l'icône de statut
  const getStatutIcon = (statut: string) => {
    switch(statut) {
      case 'actif': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'inactif': return <XCircle className="w-4 h-4 text-slate-400" />;
      case 'suspendu': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return null;
    }
  };

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
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm text-slate-600 mb-1">Total Utilisateurs</p>
                <p className="text-h2 font-bold text-primary-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm text-slate-600 mb-1">Utilisateurs Actifs</p>
                <p className="text-h2 font-bold text-success">{stats.actifs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm text-slate-600 mb-1">Administrateurs</p>
                <p className="text-h2 font-bold text-bordeaux-600">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 bg-bordeaux-50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-bordeaux-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm text-slate-600 mb-1">Avocats</p>
                <p className="text-h2 font-bold text-primary-700">{stats.avocats}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
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

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-slate-600" />
              Filtres
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-body-sm font-medium text-slate-700 mb-2">
                  Rôle
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="tous">Tous les rôles</option>
                  <option value="admin">Administrateur</option>
                  <option value="avocat">Avocat</option>
                  <option value="assistant">Assistant</option>
                  <option value="stagiaire">Stagiaire</option>
                </select>
              </div>

              <div>
                <label className="block text-body-sm font-medium text-slate-700 mb-2">
                  Statut
                </label>
                <select
                  value={selectedStatut}
                  onChange={(e) => setSelectedStatut(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-slate-700">
                    Dernier accès
                  </th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.prenom[0]}{user.nom[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="text-body-sm text-slate-500">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-body-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-body-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {user.telephone}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-body-sm font-medium border ${getRoleBadgeClass(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatutIcon(user.statut)}
                        <span className="text-body-sm font-medium text-slate-700 capitalize">
                          {user.statut}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-body-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.dernierAcces).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/parametres/utilisateurs/${user.id}/modifier`}
                          className="p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5 text-slate-600 group-hover:text-primary-600" />
                        </Link>
                        
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>
                          
                          {activeMenu === user.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-premium border border-slate-200 py-1 z-10">
                              <Link
                                href={`/parametres/utilisateurs/${user.id}/modifier`}
                                className="flex items-center gap-2 px-4 py-2 text-body-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit className="w-4 h-4" />
                                Modifier
                              </Link>
                              <button className="flex items-center gap-2 w-full px-4 py-2 text-body-sm text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Message si aucun résultat */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-h4 font-semibold text-slate-900 mb-2">
                Aucun utilisateur trouvé
              </h3>
              <p className="text-body text-slate-600">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-body-sm text-slate-600">
            Affichage de <span className="font-semibold">{filteredUsers.length}</span> sur{' '}
            <span className="font-semibold">{mockUsers.length}</span> utilisateurs
          </p>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-body-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Précédent
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-body-sm font-medium hover:bg-primary-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-body-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-body-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}