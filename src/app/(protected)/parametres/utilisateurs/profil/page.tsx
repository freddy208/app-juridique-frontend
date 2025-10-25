/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon, ArrowLeft, Edit, Mail, Phone, MapPin, Calendar,
  Award, Briefcase, FileText, Activity,
  ShieldCheck, Crown, Scale, ClipboardList, UserCheck, GraduationCap,
  CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUsers';
import { 
  RoleUtilisateur, 
  StatutUtilisateur,
  ROLE_LABELS,
  STATUS_LABELS 
} from '@/lib/types/user.types';
import { UserAvatarSimple } from '@/components/ui/Avatar';

// Configuration des icônes et couleurs
const ROLE_ICONS = {
  [RoleUtilisateur.ADMIN]: ShieldCheck,
  [RoleUtilisateur.DG]: Crown,
  [RoleUtilisateur.AVOCAT]: Scale,
  [RoleUtilisateur.SECRETAIRE]: ClipboardList,
  [RoleUtilisateur.ASSISTANT]: UserCheck,
  [RoleUtilisateur.JURISTE]: Briefcase,
  [RoleUtilisateur.STAGIAIRE]: GraduationCap,
};

const STATUS_COLORS = {
  [StatutUtilisateur.ACTIF]: 'success',
  [StatutUtilisateur.INACTIF]: 'secondary',
  [StatutUtilisateur.SUSPENDU]: 'destructive',
};

export default function ProfilUtilisateurPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');

  // 🔥 HOOK useUser pour charger les données
  const {
    user,
    isLoading,
    error,
  } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">Impossible de charger le profil</p>
          <Button onClick={() => router.push('/dashboard/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const RoleIcon = ROLE_ICONS[user.role];
  const isAvocat = user.role === RoleUtilisateur.AVOCAT;
  const isJuriste = user.role === RoleUtilisateur.JURISTE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Profil Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-12">
              {/* Photo de profil */}
              <div className="relative">
                <UserAvatarSimple 
                  user={user} 
                  size="2xl" 
                  showCrown={true}
                />
                {user.role === RoleUtilisateur.ADMIN && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Infos principales */}
              <div className="flex-1 md:mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.prenom} {user.nom}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <RoleIcon className="w-4 h-4" />
                      {ROLE_LABELS[user.role]}
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push(`/parametres/utilisateurs/${userId}/modifier`)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge variant={STATUS_COLORS[user.statut] as any} className="px-3 py-1">
                    {STATUS_LABELS[user.statut]}
                  </Badge>
                  {(isAvocat || isJuriste) && user.specialite && (
                    <Badge variant="outline" className="px-3 py-1">
                      <Award className="w-3 h-3 mr-1" />
                      {user.specialite}
                    </Badge>
                  )}
                  {(isAvocat || isJuriste) && user.barreau && (
                    <Badge variant="outline" className="px-3 py-1">
                      <Scale className="w-3 h-3 mr-1" />
                      {user.barreau}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b overflow-x-auto">
          {['overview', 'details', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Vue d\'ensemble'}
              {tab === 'details' && 'Détails'}
              {tab === 'activity' && 'Activité'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Informations de contact */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                      Informations de contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    {user.telephone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{user.telephone}</p>
                        </div>
                      </div>
                    )}
                    {user.adresse && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse</p>
                          <p className="font-medium">{user.adresse}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Informations professionnelles pour AVOCAT/JURISTE */}
              {(isAvocat || isJuriste) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-purple-600" />
                        Informations juridiques
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.specialite && (
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Spécialité</p>
                            <p className="font-medium">{user.specialite}</p>
                          </div>
                        </div>
                      )}
                      {user.barreau && (
                        <div className="flex items-center gap-3">
                          <Scale className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Barreau</p>
                            <p className="font-medium">{user.barreau}</p>
                          </div>
                        </div>
                      )}
                      {user.numeroPermis && (
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Numéro de permis</p>
                            <p className="font-medium">{user.numeroPermis}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}

          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">ID</p>
                      <p className="font-mono text-sm">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Rôle</p>
                      <p className="font-medium">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Statut</p>
                      <Badge variant={STATUS_COLORS[user.statut] as any}>
                        {STATUS_LABELS[user.statut]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Créé le</p>
                      <p className="font-medium">
                        {new Date(user.creeLe).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Modifié le</p>
                      <p className="font-medium">
                        {new Date(user.modifieLe).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {user.derniereConnexion && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Dernière connexion</p>
                        <p className="font-medium">
                          {new Date(user.derniereConnexion).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune activité récente</p>
                    <p className="text-sm mt-1">Les activités de l&apos;utilisateur s&apos;afficheront ici</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/users/${userId}/modifier`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `mailto:${user.email}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </Button>
                {user.telephone && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.location.href = `tel:${user.telephone}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistiques rapides */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Ancienneté</span>
                  </div>
                  <span className="font-medium">
                    {Math.floor((Date.now() - new Date(user.creeLe).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Statut</span>
                  </div>
                  <Badge variant={STATUS_COLORS[user.statut] as any} className="text-xs">
                    {STATUS_LABELS[user.statut]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}