/**
 * Configuration de la navigation selon les rôles
 * Définit les menus de la sidebar pour chaque type d'utilisateur
 */

import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  CheckSquare,
  Calendar,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Archive,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { Module } from "@/types/permissions.type";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  module: Module;
  badge?: string | number;
  description?: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

/**
 * Configuration complète de la navigation
 * Chaque item est associé à un module pour les permissions
 */
export const NAVIGATION_CONFIG: NavigationSection[] = [
  // ========================================
  // SECTION : VUE D'ENSEMBLE
  // ========================================
  {
    id: "overview",
    label: "Vue d'ensemble",
    items: [
      {
        id: "dashboard",
        label: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
        description: "Vue d'ensemble de votre activité",
      },
    ],
  },

  // ========================================
  // SECTION : GESTION
  // ========================================
  {
    id: "management",
    label: "Gestion",
    items: [
      {
        id: "dossiers",
        label: "Dossiers",
        href: "/dashboard/dossiers",
        icon: FolderOpen,
        module: "dossiers",
        description: "Gérer les dossiers juridiques",
      },
      {
        id: "clients",
        label: "Clients",
        href: "/dashboard/clients",
        icon: Users,
        module: "clients",
        description: "Base de données clients",
      },
      {
        id: "documents",
        label: "Documents",
        href: "/dashboard/documents",
        icon: FileText,
        module: "documents",
        description: "Bibliothèque de documents",
      },
      {
        id: "taches",
        label: "Tâches",
        href: "/dashboard/taches",
        icon: CheckSquare,
        module: "taches",
        description: "Gestion des tâches",
      },
    ],
  },

  // ========================================
  // SECTION : PLANIFICATION
  // ========================================
  {
    id: "planning",
    label: "Planification",
    items: [
      {
        id: "calendrier",
        label: "Calendrier",
        href: "/dashboard/calendrier",
        icon: Calendar,
        module: "calendrier",
        description: "Audiences et rendez-vous",
      },
      {
        id: "messages",
        label: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquare,
        module: "messages",
        description: "Communication interne",
      },
    ],
  },

  // ========================================
  // SECTION : FINANCE
  // ========================================
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "facturation",
        label: "Facturation",
        href: "/dashboard/facturation",
        icon: CreditCard,
        module: "facturation",
        description: "Factures et paiements",
      },
      {
        id: "reporting",
        label: "Reporting",
        href: "/dashboard/reporting",
        icon: BarChart3,
        module: "reporting",
        description: "Statistiques et rapports",
      },
    ],
  },

  // ========================================
  // SECTION : ADMINISTRATION
  // ========================================
  {
    id: "admin",
    label: "Administration",
    items: [
      {
        id: "parametres",
        label: "Paramètres",
        href: "/dashboard/parametres",
        icon: Settings,
        module: "parametres",
        description: "Configuration du système",
      },
      {
        id: "utilisateurs",
        label: "Utilisateurs",
        href: "/dashboard/parametres/utilisateurs",
        icon: Shield,
        module: "utilisateurs",
        description: "Gestion des utilisateurs",
      },
      {
        id: "archives",
        label: "Archives",
        href: "/dashboard/parametres/archives",
        icon: Archive,
        module: "archives",
        description: "Éléments archivés",
      },
      {
        id: "audit",
        label: "Audit Logs",
        href: "/dashboard/parametres/audit",
        icon: Clock,
        module: "audit",
        description: "Historique des actions",
      },
    ],
  },
];

/**
 * Filtrer la navigation selon les permissions de l'utilisateur
 */
export const getFilteredNavigation = (
  hasAccess: (module: Module) => boolean
): NavigationSection[] => {
  return NAVIGATION_CONFIG.map((section) => ({
    ...section,
    items: section.items.filter((item) => hasAccess(item.module)),
  })).filter((section) => section.items.length > 0); // Enlever les sections vides
};