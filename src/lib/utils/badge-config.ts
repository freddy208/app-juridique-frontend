// lib/utils/badge-config.ts
import { RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import { StatutClient } from '@/lib/types/client.types';
import {
  Shield,
  Briefcase,
  Scale,
  FileText,
  UserCog,
  Users,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

// ============================================
// CONFIGURATION DES BADGES DE RÔLES
// ============================================

export interface RoleBadgeConfig {
  variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'blue'
    | 'purple'
    | 'orange'
    | 'teal';
  icon: LucideIcon;
  label: string;
}

export const roleBadges: Record<RoleUtilisateur, RoleBadgeConfig> = {
  [RoleUtilisateur.ADMIN]: {
    variant: 'destructive',
    icon: Shield,
    label: 'Administrateur',
  },
  [RoleUtilisateur.DG]: {
    variant: 'purple',
    icon: Briefcase,
    label: 'Directeur Général',
  },
  [RoleUtilisateur.AVOCAT]: {
    variant: 'blue',
    icon: Scale,
    label: 'Avocat',
  },
  [RoleUtilisateur.SECRETAIRE]: {
    variant: 'success',
    icon: FileText,
    label: 'Secrétaire',
  },
  [RoleUtilisateur.ASSISTANT]: {
    variant: 'secondary',
    icon: UserCog,
    label: 'Assistant',
  },
  [RoleUtilisateur.JURISTE]: {
    variant: 'orange',
    icon: Scale,
    label: 'Juriste',
  },
  [RoleUtilisateur.STAGIAIRE]: {
    variant: 'teal',
    icon: GraduationCap,
    label: 'Stagiaire',
  },
};

// ============================================
// CONFIGURATION DES BADGES DE STATUTS UTILISATEURS
// ============================================

export interface StatusBadgeConfig {
  variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'blue'
    | 'purple'
    | 'orange'
    | 'teal';
  label: string;
}

export const statusBadgesUtilisateur: Record<StatutUtilisateur, StatusBadgeConfig> = {
  [StatutUtilisateur.ACTIF]: {
    variant: 'success',
    label: 'Actif',
  },
  [StatutUtilisateur.INACTIF]: {
    variant: 'secondary',
    label: 'Inactif',
  },
  [StatutUtilisateur.SUSPENDU]: {
    variant: 'destructive',
    label: 'Suspendu',
  },
};

// ============================================
// CONFIGURATION DES BADGES DE STATUTS CLIENTS
// ============================================

export const statusBadgesClient: Record<StatutClient, StatusBadgeConfig> = {
  [StatutClient.ACTIF]: { variant: 'success', label: 'Actif' },
  [StatutClient.INACTIF]: { variant: 'secondary', label: 'Inactif' },
  [StatutClient.PROSPECT]: { variant: 'blue', label: 'Prospect' },
  [StatutClient.ARCHIVE]: { variant: 'destructive', label: 'Archivé' },
};


// ============================================
// HELPERS
// ============================================

export const getRoleBadge = (role: RoleUtilisateur): RoleBadgeConfig => {
  return (
    roleBadges[role] || {
      variant: 'default',
      icon: Users,
      label: role,
    }
  );
};

export const getStatusBadgeUtilisateur = (
  statut: StatutUtilisateur
): StatusBadgeConfig => {
  return (
    statusBadgesUtilisateur[statut] || {
      variant: 'secondary',
      label: statut,
    }
  );
};
