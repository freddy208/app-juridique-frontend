/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/hooks/useAuth.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api/client';
import { authEndpoints } from '@/lib/api/endpoints';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>; // ✅ Nouvelle fonction pour forcer le rechargement
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fonction pour récupérer le profil utilisateur
  const fetchProfile = async () => {
    try {
      const response = await apiClient.get(authEndpoints.profile);
      console.log('✅ Utilisateur récupéré:', response.data.utilisateur);
      setUser(response.data.utilisateur);
      return response.data.utilisateur;
    } catch (error) {
      console.log('ℹ️ Utilisateur non authentifié');
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Vérification initiale de l'authentification
  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fonction de login améliorée
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('🔵 Envoi des identifiants au backend');
      
      // Étape 1 : Connexion
      await apiClient.post(authEndpoints.login, { email, motDePasse: password });
      console.log('✅ Authentification réussie');
      
      // Étape 2 : Récupération du profil
      const profileResponse = await apiClient.get(authEndpoints.profile);
      const userData = profileResponse.data.utilisateur;
      console.log('✅ Profil utilisateur récupéré:', userData);
      
      // Étape 3 : Mise à jour de l'état de manière synchrone
      setUser(userData);
      setIsLoading(false);
      
      return userData;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      setUser(null);
      throw error;
    }
  };

  // ✅ Fonction pour recharger le profil manuellement
  const refetchUser = async () => {
    setIsLoading(true);
    await fetchProfile();
  };

  // ✅ Déconnexion
  const logout = async () => {
    try {
      await apiClient.post(authEndpoints.logout);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
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

  // ✅ Changement du mot de passe
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
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};