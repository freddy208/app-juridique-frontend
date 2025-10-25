// src/lib/utils/user.utils.ts

/**
 * ============================================
 * UTILITAIRES - MODULE USERS
 * ============================================
 * Fonctions helper pour la gestion des utilisateurs
 */

import {
  User,
  RoleUtilisateur,
  StatutUtilisateur,
  CreateUserForm,
  UpdateUserForm,
} from '@/lib/types/user.types';

// ============================================
// FORMATAGE
// ============================================

/**
 * Formater le nom complet d'un utilisateur
 */
export function formatUserFullName(user: User | null | undefined): string {
  if (!user) return 'Utilisateur inconnu';
  return `${user.prenom} ${user.nom}`;
}

/**
 * Formater les initiales d'un utilisateur
 */
export function getUserInitials(user: User | null | undefined): string {
  if (!user) return '?';
  const firstInitial = user.prenom?.charAt(0)?.toUpperCase() || '';
  const lastInitial = user.nom?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
}

/**
 * Formater l'email pour l'affichage
 */
export function formatEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Formater le numéro de téléphone
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Si le numéro commence par +237 (Cameroun)
  if (phone.startsWith('+237')) {
    const number = phone.replace('+237', '');
    if (number.length === 9) {
      return `+237 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
    }
  }
  
  return phone;
}

// ============================================
// LABELS & DISPLAY
// ============================================

/**
 * Obtenir le label d'un rôle
 */
export function getRoleLabel(role: RoleUtilisateur): string {
  const labels: Record<RoleUtilisateur, string> = {
    ADMIN: 'Administrateur',
    DG: 'Directeur Général',
    AVOCAT: 'Avocat',
    SECRETAIRE: 'Secrétaire',
    ASSISTANT: 'Assistant',
    JURISTE: 'Juriste',
    STAGIAIRE: 'Stagiaire',
  };
  return labels[role] || role;
}

/**
 * Obtenir le label d'un statut
 */
export function getStatusLabel(statut: StatutUtilisateur): string {
  const labels: Record<StatutUtilisateur, string> = {
    ACTIF: 'Actif',
    INACTIF: 'Inactif',
    SUSPENDU: 'Suspendu',
  };
  return labels[statut] || statut;
}

/**
 * Obtenir la couleur d'un rôle (pour badges)
 */
export function getRoleColor(role: RoleUtilisateur): string {
  const colors: Record<RoleUtilisateur, string> = {
    ADMIN: 'red',
    DG: 'purple',
    AVOCAT: 'blue',
    SECRETAIRE: 'green',
    ASSISTANT: 'gray',
    JURISTE: 'yellow',
    STAGIAIRE: 'indigo',
  };
  return colors[role] || 'gray';
}

/**
 * Obtenir la couleur d'un statut (pour badges)
 */
export function getStatusColor(statut: StatutUtilisateur): string {
  const colors: Record<StatutUtilisateur, string> = {
    ACTIF: 'green',
    INACTIF: 'gray',
    SUSPENDU: 'red',
  };
  return colors[statut] || 'gray';
}

/**
 * Obtenir les classes Tailwind pour un badge de rôle
 */
export function getRoleBadgeClasses(role: RoleUtilisateur): string {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
  const colorClasses: Record<RoleUtilisateur, string> = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    DG: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    AVOCAT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    SECRETAIRE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    ASSISTANT: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    JURISTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    STAGIAIRE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };
  return `${baseClasses} ${colorClasses[role] || colorClasses.ASSISTANT}`;
}

/**
 * Obtenir les classes Tailwind pour un badge de statut
 */
export function getStatusBadgeClasses(statut: StatutUtilisateur): string {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
  const colorClasses: Record<StatutUtilisateur, string> = {
    ACTIF: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    INACTIF: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    SUSPENDU: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return `${baseClasses} ${colorClasses[statut] || colorClasses.INACTIF}`;
}

// ============================================
// PERMISSIONS & ROLES
// ============================================

/**
 * Vérifier si un utilisateur a un rôle spécifique
 */
export function hasRole(
  user: User | null | undefined,
  role: RoleUtilisateur | RoleUtilisateur[]
): boolean {
  if (!user) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
}

/**
 * Vérifier si un utilisateur est administrateur
 */
export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, RoleUtilisateur.ADMIN);
}

/**
 * Vérifier si un utilisateur est DG ou Admin
 */
export function isAdminOrDG(user: User | null | undefined): boolean {
  return hasRole(user, [RoleUtilisateur.ADMIN, RoleUtilisateur.DG]);
}

/**
 * Vérifier si un utilisateur est avocat
 */
export function isAvocat(user: User | null | undefined): boolean {
  return hasRole(user, RoleUtilisateur.AVOCAT);
}

/**
 * Vérifier si un utilisateur peut modifier un autre utilisateur
 */
export function canEditUser(
  currentUser: User | null | undefined,
  targetUser: User | null | undefined
): boolean {
  if (!currentUser || !targetUser) return false;
  
  // Admin peut tout modifier
  if (isAdmin(currentUser)) return true;
  
  // DG peut modifier sauf les admins
  if (currentUser.role === 'DG' && targetUser.role !== 'ADMIN') {
    return true;
  }
  
  // Utilisateur peut modifier son propre profil
  if (currentUser.id === targetUser.id) return true;
  
  return false;
}

/**
 * Vérifier si un utilisateur peut supprimer un autre utilisateur
 */
export function canDeleteUser(
  currentUser: User | null | undefined,
  targetUser: User | null | undefined
): boolean {
  if (!currentUser || !targetUser) return false;
  
  // Ne peut pas se supprimer soi-même
  if (currentUser.id === targetUser.id) return false;
  
  // Admin peut supprimer tous sauf autres admins
  if (isAdmin(currentUser) && targetUser.role !== 'ADMIN') {
    return true;
  }
  
  // DG peut supprimer sauf admins et DG
  if (currentUser.role === 'DG' && 
      !['ADMIN', 'DG'].includes(targetUser.role)) {
    return true;
  }
  
  return false;
}

/**
 * Obtenir la liste des rôles qu'un utilisateur peut assigner
 */
export function getAssignableRoles(
  currentUser: User | null | undefined
): RoleUtilisateur[] {
  if (!currentUser) return [];
  
  // Admin peut assigner tous les rôles
  if (isAdmin(currentUser)) {
    return [RoleUtilisateur.ADMIN, RoleUtilisateur.DG, RoleUtilisateur.AVOCAT, RoleUtilisateur.SECRETAIRE, RoleUtilisateur.ASSISTANT];
  }
  
  // DG peut assigner tous sauf Admin
  if (currentUser.role === 'DG') {
    return [RoleUtilisateur.DG, RoleUtilisateur.AVOCAT, RoleUtilisateur.SECRETAIRE, RoleUtilisateur.ASSISTANT];
  }
  
  return [];
}

// ============================================
// VALIDATION
// ============================================

/**
 * Valider un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un mot de passe
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un symbole (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valider un numéro de téléphone
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Calculer la force d'un mot de passe (0-100)
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: 'Très faible' | 'Faible' | 'Moyen' | 'Fort' | 'Très fort';
  color: string;
} {
  let score = 0;
  
  // Longueur
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Minuscules
  if (/[a-z]/.test(password)) score += 15;
  
  // Majuscules
  if (/[A-Z]/.test(password)) score += 15;
  
  // Chiffres
  if (/\d/.test(password)) score += 15;
  
  // Symboles
  if (/[@$!%*?&]/.test(password)) score += 15;
  
  // Diversité de caractères
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 10;
  
  let label: 'Très faible' | 'Faible' | 'Moyen' | 'Fort' | 'Très fort';
  let color: string;
  
  if (score < 30) {
    label = 'Très faible';
    color = 'red';
  } else if (score < 50) {
    label = 'Faible';
    color = 'orange';
  } else if (score < 70) {
    label = 'Moyen';
    color = 'yellow';
  } else if (score < 90) {
    label = 'Fort';
    color = 'green';
  } else {
    label = 'Très fort';
    color = 'emerald';
  }
  
  return { score, label, color };
}

// ============================================
// TRANSFORMATION
// ============================================

/**
 * Transformer les données de formulaire pour l'API
 */
export function transformUserFormToApi(
  form: CreateUserForm | UpdateUserForm
): CreateUserForm | UpdateUserForm {
  return {
    ...form,
    email: form.email?.toLowerCase().trim(),
    telephone: form.telephone?.trim(),
  };
}

/**
 * Nettoyer les champs vides d'un formulaire
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanUserForm<T extends Record<string, any>>(form: T): T {
  const cleaned = { ...form };
  
  Object.keys(cleaned).forEach((key) => {
    const value = cleaned[key];
    if (value === '' || value === null || value === undefined) {
      delete cleaned[key];
    }
  });
  
  return cleaned;
}

// ============================================
// FILTRAGE & TRI
// ============================================

/**
 * Filtrer les utilisateurs par recherche
 */
export function filterUsersBySearch(
  users: User[],
  searchQuery: string
): User[] {
  if (!searchQuery) return users;
  
  const query = searchQuery.toLowerCase().trim();
  
  return users.filter((user) => {
    return (
      user.prenom.toLowerCase().includes(query) ||
      user.nom.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.telephone?.toLowerCase().includes(query) ||
      user.specialite?.toLowerCase().includes(query) ||
      user.barreau?.toLowerCase().includes(query)
    );
  });
}

/**
 * Trier les utilisateurs
 */
export function sortUsers(
  users: User[],
  sortBy: keyof User,
  sortOrder: 'asc' | 'desc'
): User[] {
  return [...users].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// ============================================
// STATISTIQUES
// ============================================

/**
 * Calculer le taux de complétion d'un profil
 */
export function getProfileCompletionRate(user: User): number {
  const fields = [
    'prenom',
    'nom',
    'email',
    'telephone',
    'adresse',
    'specialite',
    'barreau',
    'numeroPermis',
  ];
  
  let filledFields = 0;
  fields.forEach((field) => {
    if (user[field as keyof User]) {
      filledFields++;
    }
  });
  
  return Math.round((filledFields / fields.length) * 100);
}

/**
 * Obtenir les champs manquants d'un profil
 */
export function getMissingProfileFields(user: User): string[] {
  const fields: Array<{ key: keyof User; label: string }> = [
    { key: 'telephone', label: 'Téléphone' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'specialite', label: 'Spécialité' },
    { key: 'barreau', label: 'Barreau' },
    { key: 'numeroPermis', label: 'Numéro de permis' },
  ];
  
  return fields
    .filter((field) => !user[field.key])
    .map((field) => field.label);
}

// ============================================
// EXPORT
// ============================================

/**
 * Exporter les utilisateurs en CSV
 */
export function exportUsersToCSV(users: User[]): string {
  const headers = [
    'ID',
    'Prénom',
    'Nom',
    'Email',
    'Rôle',
    'Statut',
    'Téléphone',
    'Spécialité',
    'Barreau',
    'Créé le',
  ];
  
  const rows = users.map((user) => [
    user.id,
    user.prenom,
    user.nom,
    user.email,
    getRoleLabel(user.role),
    getStatusLabel(user.statut),
    user.telephone || '',
    user.specialite || '',
    user.barreau || '',
    new Date(user.creeLe).toLocaleDateString('fr-FR'),
  ]);
  
  return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
}

/**
 * Télécharger un CSV
 */
export function downloadCSV(csv: string, filename: string = 'utilisateurs.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}