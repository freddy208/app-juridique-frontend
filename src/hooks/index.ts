/**
 * Export centralisé de tous les hooks
 * Import simplifié : import { useDossiers, useClients } from '@/hooks'
 */

// Permissions
export * from './usePermissions';

// Modules principaux
export * from './useDossiers';
export * from './useClients';
export * from './useDocuments';
export * from './useTaches';
export * from './useEvenements';
export * from './useFactures';

// Notifications
export * from './useNotifications';

// Utilitaires
export * from './useDebounce';