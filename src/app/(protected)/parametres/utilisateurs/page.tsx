// src/app/(protected)/parametres/utilisateurs/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter, Download,
  Edit, Trash2, Eye, ShieldCheck, Scale, UserCheck, 
  CheckSquare, AlertCircle,
  ArrowUpDown, Loader2
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
import { RoleUtilisateur, StatutUtilisateur, UserFilters } from '@/lib/types/user.types';
import { statusBadges } from '@/lib/utils/badge-config';
import { UserAvatar } from '@/components/ui/Avatar';
import * as XLSX from 'xlsx'; // Pour export Excel

export default function ListeUtilisateursPage() {
  const { toast } = useToast();
  const router = useRouter();

  // --- États ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode] = useState<'table' | 'card'>('table');
  const [showFilters, setShowFilters] = useState(false);

  // --- Filtres par défaut : uniquement ACTIF ---
  const [filters, setFilters] = useState<UserFilters>({ statut: StatutUtilisateur.ACTIF });
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Tri
  const [sortField, setSortField] = useState<string>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // --- Hook useUsers ---
  const {
    users,
    pagination,
    isLoading,
    error,
    deleteUser,
    bulkAction,
    refetch,
  } = useUsers({
    page,
    limit: pageSize,
    ...filters,
    search: searchTerm || undefined,
    sortBy: sortField,
    sortOrder,
  });

  const { data: stats, isLoading: isLoadingStats } = useUserStats();

  // --- Sélection ---
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map(u => u.id)));
  };

  // --- Actions utilisateurs ---
  const handleView = (id: string) => router.push(`/parametres/utilisateurs/profil/${id}`);
  const handleEdit = (id: string) => router.push(`/parametres/utilisateurs/${id}/modifier`);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      setSelectedIds(new Set());
      toast({ title: 'Utilisateur supprimé', variant: 'success' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) {
      toast({ title: 'Aucune sélection', description: 'Sélectionnez au moins un utilisateur.', variant: 'destructive' });
      return;
    }
    const userIds = Array.from(selectedIds);
    try {
      switch (action) {
        case 'changeRole':
        case 'changeStatus':
          toast({ title: 'Fonctionnalité à venir', description: action === 'changeRole' ? 'Changement de rôle en masse' : 'Changement de statut en masse', variant: 'info' });
          break;
        case 'delete':
          if (!confirm(`Supprimer ${userIds.length} utilisateur(s) ?`)) return;
          await bulkAction({ action: 'delete', userIds });
          setSelectedIds(new Set());
          toast({ title: 'Utilisateurs supprimés', variant: 'success' });
          break;
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur lors de l\'action', variant: 'destructive' });
    }
  };

  // --- Export Excel ---
  const handleExport = () => {
    if (!users || users.length === 0) {
      toast({ title: 'Aucun utilisateur à exporter', variant: 'destructive' });
      return;
    }
    const data = users.map(u => ({
      Nom: `${u.prenom} ${u.nom}`,
      Email: u.email,
      Téléphone: u.telephone || '-',
      Rôle: u.role,
      Statut: u.statut,
      Spécialité: u.specialite || '-',
      'Dernière connexion': u.derniereConnexion ? new Date(u.derniereConnexion).toLocaleString('fr-FR') : '-',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');
    XLSX.writeFile(wb, `utilisateurs_${new Date().toISOString()}.xlsx`);
    toast({ title: 'Export terminé', variant: 'success' });
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  // --- Erreurs & Loading ---
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Erreur de chargement</h2>
        <p className="text-gray-400 mb-6">Impossible de récupérer les utilisateurs</p>
        <Button onClick={() => refetch()}>Réessayer</Button>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" /> Gestion des utilisateurs
          </h1>
          <p className="text-gray-300 mt-1">Gérez les membres de votre cabinet juridique</p>
        </div>
        <Button size="lg" onClick={() => router.push('/parametres/utilisateurs/nouveau')} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Nouvel utilisateur
        </Button>
      </div>

      {/* Stats */}
      {stats && !isLoadingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {['total','actifs','AVOCAT','ASSISTANT','ADMIN'].map((key, i) => {
            let title='', value=0, Icon=Users, bg='';
            switch(key){
              case 'total': title='Total'; value=stats.total; Icon=Users; bg='from-blue-800 to-blue-900'; break;
              case 'actifs': title='Actifs'; value=stats.actifs; Icon=CheckSquare; bg='from-green-600 to-green-700'; break;
              case 'AVOCAT': title='Avocats'; value=stats.parRole?.AVOCAT||0; Icon=Scale; bg='from-red-700 to-red-800'; break;
              case 'ASSISTANT': title='Assistants'; value=stats.parRole?.ASSISTANT||0; Icon=UserCheck; bg='from-purple-600 to-purple-700'; break;
              case 'ADMIN': title='Admins'; value=stats.parRole?.ADMIN||0; Icon=ShieldCheck; bg='from-amber-600 to-amber-700'; break;
            }
            return (
              <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}>
                <Card className={`bg-gradient-to-br ${bg} text-white border-0`}>
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-100">{title}</p>
                      <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <Icon className="w-12 h-12 text-white/30"/>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Recherche & Filtres */}
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-white border-gray-600">
                <Filter className="w-4 h-4"/> Filtres
              </Button>
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2 text-white border-gray-600">
                <Download className="w-4 h-4"/> Exporter
              </Button>
              <Select onValueChange={(v) => handleBulkAction(v)} defaultValue="">
                <SelectTrigger className="w-48 text-white border-gray-600">
                  <SelectValue placeholder="Actions en masse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Supprimer sélection</SelectItem>
                  <SelectItem value="changeRole">Changer rôle</SelectItem>
                  <SelectItem value="changeStatus">Changer statut</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Rôle</Label>
                <Select value={filters.role || ''} onValueChange={(v) => setFilters({...filters, role: v? (v as RoleUtilisateur) : undefined,})}>
                  <SelectTrigger className="text-white bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Tous les rôles"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="AVOCAT">Avocat</SelectItem>
                    <SelectItem value="ASSISTANT">Assistant</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="DG">Directeur Général</SelectItem>
                    <SelectItem value="JURISTE">Juriste</SelectItem>
                    <SelectItem value="SECRETAIRE">Secrétaire</SelectItem>
                    <SelectItem value="STAGIAIRE">Stagiaire</SelectItem>  
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={filters.statut || ''} onValueChange={(v) => setFilters({...filters, statut: v? (v as StatutUtilisateur) : undefined,})}>
                  <SelectTrigger className="text-white bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Tous"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="ACTIF">Actif</SelectItem>
                    <SelectItem value="INACTIF">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau / Carte */}
      <div className="overflow-x-auto">
        {viewMode === 'table' ? (
          <table className="min-w-full divide-y divide-gray-700 text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left"><input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.size===users.length} /></th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('nom')}>Nom <ArrowUpDown className="inline w-4 h-4"/></th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('email')}>Email <ArrowUpDown className="inline w-4 h-4"/></th>
                <th className="px-4 py-2">Téléphone</th>
                <th className="px-4 py-2">Rôle</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-700">
                  <td className="px-4 py-2"><input type="checkbox" checked={selectedIds.has(u.id)} onChange={()=>toggleSelect(u.id)} /></td>
                  <td className="px-4 py-2">{u.prenom} {u.nom}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.telephone || '-'}</td>
                  <td className="px-4 py-2"><Badge variant="secondary">{u.role}</Badge></td>
                  <td className="px-4 py-2">
                    <Badge variant={statusBadges[u.statut as StatutUtilisateur].color}>
                      {statusBadges[u.statut as StatutUtilisateur].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={()=>handleView(u.id)}><Eye className="w-4 h-4"/></Button>
                    <Button size="sm" variant="outline" onClick={()=>handleEdit(u.id)}><Edit className="w-4 h-4"/></Button>
                    <Button size="sm" variant="destructive" onClick={()=>handleDelete(u.id)}><Trash2 className="w-4 h-4"/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => (
              <Card key={u.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={u} size="md" />
                    <p className="text-white font-medium">{u.prenom} {u.nom}</p>
                  </div>
                    <input type="checkbox" checked={selectedIds.has(u.id)} onChange={()=>toggleSelect(u.id)} />
                  </div>
                  <p className="text-gray-300 text-sm">{u.email}</p>
                  <p className="text-gray-300 text-sm">{u.telephone || '-'}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary">{u.role}</Badge>
                    <Badge variant={statusBadges[u.statut as StatutUtilisateur].color}>
                      {statusBadges[u.statut as StatutUtilisateur].label}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={()=>handleView(u.id)}><Eye className="w-4 h-4"/></Button>
                    <Button size="sm" variant="outline" onClick={()=>handleEdit(u.id)}><Edit className="w-4 h-4"/></Button>
                    <Button size="sm" variant="destructive" onClick={()=>handleDelete(u.id)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 flex justify-between items-center text-white">
          <span>Page {pagination.page} / {pagination.totalPages}</span>
          <div className="flex gap-2">
            <Button disabled={pagination.page===1} onClick={()=>setPage(page-1)}>Précédent</Button>
            <Button disabled={pagination.page===pagination.totalPages} onClick={()=>setPage(page+1)}>Suivant</Button>
          </div>
        </div>
      )}
    </div>
  );
}
