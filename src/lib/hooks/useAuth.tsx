// src/lib/hooks/useAuth.tsx
'use client';

/**
 * ============================================
 * HOOK: useAuth
 * ============================================
 * Gestion de l'authentification avec:
 * - Login/Logout
 * - Profil utilisateur
 * - Changement de mot de passe
 * - Réinitialisation de mot de passe
 * - État de chargement
 * - Refresh automatique
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { authEndpoints, usersEndpoints } from '@/lib/api/endpoints';
import type { User } from '@/lib/types/user.types';

// ============================================
// TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  motDePasse: string;
}

export interface RegisterData {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
}

export interface ChangePasswordData {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

export interface ResetPasswordData {
  token: string;
  motDePasse: string;
}

interface AuthContextType {
  // État
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  refetchUser: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ============================================
  // Récupération du profil
  // ============================================

  const fetchProfile = async () => {
    try {
      // ✅ CORRECTION: Utiliser /users/me au lieu de /auth/profile
      const response = await apiClient.get<User>(usersEndpoints.getMyProfile);
      console.log('✅ Utilisateur récupéré:', response.data);
      setUser(response.data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Ne pas logger l'erreur si l'utilisateur n'est pas connecté
      if (error.response?.status !== 401) {
        console.error('❌ Erreur lors de la récupération du profil:', error);
      }
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification initiale de l'authentification
  useEffect(() => {
    fetchProfile();
  }, []);

  // ============================================
  // LOGIN
  // ============================================

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true);
      console.log('🔵 Tentative de connexion...');

      // Étape 1: Authentification
      await apiClient.post(authEndpoints.login, credentials);
      console.log('✅ Authentification réussie');

      // Étape 2: Récupération du profil
      const profileResponse = await apiClient.get<User>(
        usersEndpoints.getMyProfile
      );
      const userData = profileResponse.data;
      console.log('✅ Profil utilisateur récupéré:', userData);

      // Étape 3: Mise à jour de l'état
      setUser(userData);
      
      return userData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      setUser(null);
      
      // Gestion des erreurs spécifiques
      const errorMessage = error.response?.data?.message || 
        'Erreur lors de la connexion';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // REGISTER
  // ============================================

  const register = async (data: RegisterData): Promise<User> => {
    try {
      setIsLoading(true);
      console.log('🔵 Tentative d\'inscription...');

      // Inscription
      await apiClient.post(authEndpoints.register, data);
      console.log('✅ Inscription réussie');

      // Auto-login après inscription
      return await login({
              email: data.email,
              motDePasse: data.motDePasse,
            });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      
      const errorMessage = error.response?.data?.message || 
        'Erreur lors de l\'inscription';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('🔵 Déconnexion...');

      await apiClient.post(authEndpoints.logout);
      console.log('✅ Déconnexion réussie');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      // Continuer même en cas d'erreur
    } finally {
      setUser(null);
      setIsLoading(false);
      
      // Rediriger vers la page de login
      router.push('/login');
    }
  };

  // ============================================
  // MOT DE PASSE OUBLIÉ
  // ============================================

  const forgotPassword = async (email: string) => {
    try {
      console.log('🔵 Demande de réinitialisation du mot de passe...');
      
      await apiClient.post(authEndpoints.forgotPassword, { email });
      
      console.log('✅ Email de réinitialisation envoyé');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur lors de la demande de réinitialisation:', error);
      
      const errorMessage = error.response?.data?.message || 
        'Erreur lors de la demande de réinitialisation';
      throw new Error(errorMessage);
    }
  };

  // ============================================
  // RÉINITIALISATION MOT DE PASSE
  // ============================================

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      console.log('🔵 Réinitialisation du mot de passe...');
      
      await apiClient.post(authEndpoints.resetPassword, data);
      
      console.log('✅ Mot de passe réinitialisé avec succès');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      
      const errorMessage = error.response?.data?.message || 
        'Erreur lors de la réinitialisation du mot de passe';
      throw new Error(errorMessage);
    }
  };

  // ============================================
  // CHANGEMENT MOT DE PASSE
  // ============================================

  const changePassword = async (data: ChangePasswordData) => {
    try {
      console.log('🔵 Changement du mot de passe...');
      
      // ✅ CORRECTION: Utiliser /users/me avec les nouveaux champs
      await apiClient.patch(usersEndpoints.updateMyProfile, data);
      
      console.log('✅ Mot de passe changé avec succès');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur lors du changement de mot de passe:', error);
      
      const errorMessage = error.response?.data?.message || 
        'Erreur lors du changement de mot de passe';
      throw new Error(errorMessage);
    }
  };

  // ============================================
  // REFRESH PROFIL
  // ============================================

  const refetchUser = async () => {
    setIsLoading(true);
    await fetchProfile();
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AuthContextType = {
    // État
    user,
    isLoading,
    isAuthenticated: !!user,
    
    // Actions
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOK: useRequireAuth (Protection de routes)
// ============================================

export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};

// ============================================
// HOOK: useRequireRole (Protection par rôle)
// ============================================

export const useRequireRole = (
  allowedRoles: string[],
  redirectTo: string = '/dashboard'
) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
          router.push(redirectTo);
    }
  }, [user, isLoading, allowedRoles, router, redirectTo]);

  return { 
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    isLoading 
  };
};