'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UsersList } from './_components/UsersList';
import { UserForm } from './_components/UserForm';
import { useUsers, useUserRoles, useUserStatuses } from '@/lib/hooks/useUsers';
import { User as UserType, StatutUtilisateur, UserFilters } from '@/lib/types/user.types';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const {
    users,
    pagination: paginationData,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    changeStatus,
    isCreating,
    isUpdating,
  } = useUsers({ ...pagination, ...filters });

  useUserRoles();
  useUserStatuses();

  const handleAddUser = () => {
    setEditingUser(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(id);
    }
  };

  const handleChangeStatus = (id: string, status: StatutUtilisateur) => {
    changeStatus({ id, statusData: { statut: status } });
  };

  const handleViewUser = (id: string) => {
    // Naviguer vers la page de détails de l'utilisateur
    window.location.href = `/parametres/utilisateurs/${id}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (data: any) => {
    if (formMode === 'create') {
      createUser(data);
    } else {
      updateUser({ id: editingUser!.id, userData: data });
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleSelectUser = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    }
  };

  const handleExport = () => {
    // Implémenter l'exportation des utilisateurs
    toast.success('Exportation des utilisateurs en cours...');
  };

  const handleImport = () => {
    // Implémenter l'importation des utilisateurs
    toast.success('Importation des utilisateurs en cours...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showForm ? (
          <UserForm
            initialData={editingUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isCreating || isUpdating}
            mode={formMode}
          />
        ) : (
          <UsersList
            users={users}
            pagination={paginationData}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onChangeStatus={handleChangeStatus}
            onView={handleViewUser}
            onAddUser={handleAddUser}
            onPageChange={handlePageChange}
            onFiltersChange={handleFiltersChange}
            filters={filters}
            onExport={handleExport}
            onImport={handleImport}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={() => {
              if (selectedUsers.length === users.length) {
                setSelectedUsers([]);
              } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setSelectedUsers(users.map((user: { id: any; }) => user.id));
              }
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
      </motion.div>
    </div>
  );
}