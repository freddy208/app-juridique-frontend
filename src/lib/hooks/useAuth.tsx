// src/lib/hooks/useAuth.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '@/lib/api/client';
import { authEndpoints } from '@/lib/api/endpoints';

interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  statut: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Vérifie si l'utilisateur est authentifié via le cookie HTTPOnly
  const fetchProfile = async () => {
    try {
      const response = await apiClient.get(authEndpoints.profile);
      setUser(response.data.utilisateur);
    } catch (error) {
      console.error('Utilisateur non authentifié :', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ MODIFICATION ICI : Récupérer le profil après le login
    const login = async (email: string, password: string) => {
      try {
        await apiClient.post(authEndpoints.login, { email, motDePasse: password });
        const profileResponse = await apiClient.get(authEndpoints.profile);
        setUser(profileResponse.data.utilisateur);
        return profileResponse.data.utilisateur; // ✅ retourner le user pour garantir la synchronicité
      } catch (error) {
        console.error('Erreur de connexion:', error);
        throw error;
      }
    };

  // ✅ Déconnexion : supprime le cookie HTTPOnly côté backend
  const logout = async () => {
    try {
      await apiClient.post(authEndpoints.logout);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
    }
  };

  // ✅ Mot de passe oublié
  const forgotPassword = async (email: string) => {
    try {
      await apiClient.post(authEndpoints.forgotPassword, { email });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
      throw error;
    }
  };

  // ✅ Réinitialisation du mot de passe
  const resetPassword = async (token: string, password: string) => {
    try {
      await apiClient.post(authEndpoints.resetPassword, { 
        token, 
        motDePasse: password 
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  };

  // ✅ Changement du mot de passe (auth requis)
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await apiClient.post(authEndpoints.changePassword, {
        ancienMotDePasse: oldPassword,
        nouveauMotDePasse: newPassword,
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};