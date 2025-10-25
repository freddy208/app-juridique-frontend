// lib/utils/badge-config.ts
import { RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import { 
  Shield, 
  Briefcase, 
  Scale,
  FileText, 
  UserCog, 
  Users,
  GraduationCap,
  type LucideIcon
} from 'lucide-react';

// ============================================
// CONFIGURATION DES BADGES DE RÔLES
// ============================================

export interface RoleBadgeConfig {
  color: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'blue' | 'purple' | 'orange' | 'teal';
  icon: LucideIcon;
  label: string;
}

export const roleBadges: Record<RoleUtilisateur, RoleBadgeConfig> = {
  [RoleUtilisateur.ADMIN]: {
    color: 'destructive',
    icon: Shield,
    label: 'Administrateur',
  },
  [RoleUtilisateur.DG]: {
    color: 'purple',
    icon: Briefcase,
    label: 'Directeur Général',
  },
  [RoleUtilisateur.AVOCAT]: {
    color: 'blue',
    icon: Scale,
    label: 'Avocat',
  },
  [RoleUtilisateur.SECRETAIRE]: {
    color: 'success',
    icon: FileText,
    label: 'Secrétaire',
  },
  [RoleUtilisateur.ASSISTANT]: {
    color: 'secondary',
    icon: UserCog,
    label: 'Assistant',
  },
  [RoleUtilisateur.JURISTE]: {
    color: 'orange',
    icon: Scale,
    label: 'Juriste',
  },
  [RoleUtilisateur.STAGIAIRE]: {
    color: 'teal',
    icon: GraduationCap,
    label: 'Stagiaire',
  },
};

// ============================================
// CONFIGURATION DES BADGES DE STATUTS
// ============================================

export interface StatusBadgeConfig {
  color: 'success' | 'secondary' | 'destructive';
  label: string;
}

export const statusBadges: Record<StatutUtilisateur, StatusBadgeConfig> = {
  [StatutUtilisateur.ACTIF]: {
    color: 'success',
    label: 'Actif',
  },
  [StatutUtilisateur.INACTIF]: {
    color: 'secondary',
    label: 'Inactif',
  },
  [StatutUtilisateur.SUSPENDU]: {
    color: 'destructive',
    label: 'Suspendu',
  },
};

// ============================================
// HELPERS
// ============================================

export const getRoleBadge = (role: RoleUtilisateur): RoleBadgeConfig => {
  return roleBadges[role] || {
    color: 'default',
    icon: Users,
    label: role,
  };
};

export const getStatusBadge = (statut: StatutUtilisateur): StatusBadgeConfig => {
  return statusBadges[statut] || {
    color: 'secondary',
    label: statut,
  };
};