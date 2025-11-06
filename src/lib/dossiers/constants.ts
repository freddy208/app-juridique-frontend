/**
 * ============================================
 * CONSTANTES MODULE DOSSIERS
 * ============================================
 * Configuration des couleurs, labels et helpers
 */

import {
  TypeDossier,
  StatutDossier,
  NiveauRisque,
  GraviteBlessure,
  CategorieVehicule,
  RegimeFoncier,
  EtapeProcedures,
} from '@/lib/types/dossier';

// ============================================
// CONFIGURATION DES TYPES DE DOSSIERS
// ============================================

export const TYPE_DOSSIER_CONFIG = {
  [TypeDossier.SINISTRE_CORPOREL]: {
    label: 'Sinistre Corporel',
    icon: '🚑',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  [TypeDossier.SINISTRE_MATERIEL]: {
    label: 'Sinistre Matériel',
    icon: '🚗',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  [TypeDossier.SINISTRE_MORTEL]: {
    label: 'Sinistre Mortel',
    icon: '⚰️',
    color: 'text-gray-800',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
  [TypeDossier.IMMOBILIER]: {
    label: 'Immobilier',
    icon: '🏠',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  [TypeDossier.SPORT]: {
    label: 'Sport',
    icon: '⚽',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  [TypeDossier.CONTRAT]: {
    label: 'Contrat',
    icon: '📄',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  [TypeDossier.CONTENTIEUX]: {
    label: 'Contentieux',
    icon: '⚖️',
    color: 'text-[#8b0000]',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  [TypeDossier.AUTRE]: {
    label: 'Autre',
    icon: '📋',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
} as const;

// ============================================
// CONFIGURATION DES STATUTS
// ============================================

export const STATUT_DOSSIER_CONFIG = {
  [StatutDossier.OUVERT]: {
    label: 'Ouvert',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    dotColor: 'bg-green-500',
  },
  [StatutDossier.EN_COURS]: {
    label: 'En cours',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  [StatutDossier.SUSPENDU]: {
    label: 'Suspendu',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    dotColor: 'bg-orange-500',
  },
  [StatutDossier.CLOS]: {
    label: 'Clôturé',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-500',
  },
  [StatutDossier.ARCHIVE]: {
    label: 'Archivé',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    dotColor: 'bg-gray-400',
  },
} as const;

// ============================================
// CONFIGURATION NIVEAU DE RISQUE
// ============================================

export const NIVEAU_RISQUE_CONFIG = {
  [NiveauRisque.FAIBLE]: {
    label: 'Faible',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '🟢',
  },
  [NiveauRisque.MOYEN]: {
    label: 'Moyen',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: '🟠',
  },
  [NiveauRisque.ELEVE]: {
    label: 'Élevé',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '🔴',
  },
} as const;

// ============================================
// CONFIGURATION GRAVITÉ BLESSURE
// ============================================

export const GRAVITE_BLESSURE_CONFIG = {
  [GraviteBlessure.MINEUR]: {
    label: 'Mineur',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [GraviteBlessure.MOYEN]: {
    label: 'Moyen',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  [GraviteBlessure.GRAVE]: {
    label: 'Grave',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  [GraviteBlessure.CRITIQUE]: {
    label: 'Critique',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
} as const;

// ============================================
// CONFIGURATION CATÉGORIE VÉHICULE
// ============================================

export const CATEGORIE_VEHICULE_CONFIG = {
  [CategorieVehicule.VOITURE]: { label: 'Voiture', icon: '🚗' },
  [CategorieVehicule.MOTO]: { label: 'Moto', icon: '🏍️' },
  [CategorieVehicule.CAMION]: { label: 'Camion', icon: '🚚' },
  [CategorieVehicule.AUTRE]: { label: 'Autre', icon: '🚙' },
} as const;

// ============================================
// CONFIGURATION RÉGIME FONCIER
// ============================================

export const REGIME_FONCIER_CONFIG = {
  [RegimeFoncier.TITRE_FONCIER]: { label: 'Titre Foncier' },
  [RegimeFoncier.COUTUMIER]: { label: 'Coutumier' },
  [RegimeFoncier.BAIL]: { label: 'Bail' },
} as const;

// ============================================
// CONFIGURATION ÉTAPE PROCÉDURES
// ============================================

export const ETAPE_PROCEDURES_CONFIG = {
  [EtapeProcedures.INSTRUCTIVE]: { label: 'Instructive', order: 1 },
  [EtapeProcedures.AUDIENCE]: { label: 'Audience', order: 2 },
  [EtapeProcedures.JUGEMENT]: { label: 'Jugement', order: 3 },
  [EtapeProcedures.APPEL]: { label: 'Appel', order: 4 },
  [EtapeProcedures.EXECUTION]: { label: 'Exécution', order: 5 },
} as const;

// ============================================
// HELPERS
// ============================================

export const getTypeDossierLabel = (type: TypeDossier): string => {
  return TYPE_DOSSIER_CONFIG[type]?.label || type;
};

export const getStatutLabel = (statut: StatutDossier): string => {
  return STATUT_DOSSIER_CONFIG[statut]?.label || statut;
};

export const getNiveauRisqueLabel = (risque: NiveauRisque): string => {
  return NIVEAU_RISQUE_CONFIG[risque]?.label || risque;
};

export const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | undefined): string => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateShort = (date: string | undefined): string => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};