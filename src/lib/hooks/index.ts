/**
 * Export centralisé de tous les hooks
 * Import simplifié : import { useDossiers, useClients } from '@/hooks'
 */


// Authentification - Import depuis le nouveau fichier
export { useAuth, AuthProvider, useRequireAuth, useCurrentUser } from '../../app/auth/context/AuthProviderNew';



// Utilitaires
export * from './useDebounce';