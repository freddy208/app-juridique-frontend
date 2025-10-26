/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/parametres/utilisateurs/profil/page.tsx - VERSION PREMIUM COHÉRENTE
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Clock,
  Edit,
  Save,
  Scale,
  CheckCircle2,
  AlertCircle,
  Building,
  Hash,
  Loader2,
  Info,
  X,
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUsers';
import {
  RoleUtilisateur,
  ROLE_LABELS,
  type UpdateUserForm,
} from '@/lib/types/user.types';
import { toast } from 'react-hot-toast';
import { statusBadges } from '@/lib/utils/badge-config';

// Badge Component (même que la liste)
const Badge = ({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'blue' | 'purple' | 'orange' | 'teal';
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    destructive: 'bg-red-50 text-red-700 border-red-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Info Row Component
const InfoRow = ({
  icon: Icon,
  label,
  value,
  iconColor = 'text-slate-400'
}: {
  icon: any;
  label: string;
  value: string |  null | undefined;
  iconColor?: string;
}) => {
  if (!value) return null;
   const displayValue = value || 'Non renseigné';
  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm text-slate-900 break-words">
          {displayValue}
        </p>
      </div>
    </div>
  );
};

// Form Input Component
const FormInput = ({
  label,
  icon: Icon,
  error,
  required = false,
  ...props
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-slate-200 focus:border-primary-500'
        }`}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm flex items-center space-x-1"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

function ProfilePageContent() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateUserForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, isLoading, updateUser, isUpdating } = useUser(userId || undefined);

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        specialite: user.specialite || '',
        barreau: user.barreau || '',
        numeroPermis: user.numeroPermis || '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom?.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.nom?.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    updateUser(formData as UpdateUserForm, {
      onSuccess: () => {
        setIsEditMode(false);
        toast.success('Profil mis à jour avec succès');
      },
    });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (user) {
      setFormData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        specialite: user.specialite || '',
        barreau: user.barreau || '',
        numeroPermis: user.numeroPermis || '',
      });
    }
    setErrors({});
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">ID utilisateur manquant</h2>
          <p className="text-slate-600 mb-6">Impossible de charger le profil sans ID</p>
          <button
            onClick={() => router.push('/parametres/utilisateurs')}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Utilisateur introuvable</h2>
          <p className="text-slate-600 mb-6">Cet utilisateur n&apos;existe pas ou a été supprimé</p>
          <button
            onClick={() => router.push('/parametres/utilisateurs')}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const isAvocat = user.role === RoleUtilisateur.AVOCAT || user.role === RoleUtilisateur.JURISTE;

  const roleColors: Record<RoleUtilisateur, string> = {
    [RoleUtilisateur.ADMIN]: 'blue',
    [RoleUtilisateur.DG]: 'purple',
    [RoleUtilisateur.AVOCAT]: 'blue',
    [RoleUtilisateur.SECRETAIRE]: 'teal',
    [RoleUtilisateur.ASSISTANT]: 'secondary',
    [RoleUtilisateur.JURISTE]: 'orange',
    [RoleUtilisateur.STAGIAIRE]: 'teal',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/parametres/utilisateurs')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à la liste</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-2xl shadow-lg shadow-primary-500/30">
                {user.prenom.charAt(0)}{user.nom.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  {user.prenom} {user.nom}
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant={roleColors[user.role] as any}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  <Badge variant={statusBadges[user.statut].variant}>
                    {statusBadges[user.statut].label}
                  </Badge>
                </div>
              </div>
            </div>

            {!isEditMode && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditMode(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
              >
                <Edit className="w-5 h-5" />
                <span className="font-medium">Modifier le profil</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {!isEditMode ? (
          /* Vue Information */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Informations personnelles</h2>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="space-y-1 pb-4 md:pb-0 md:pr-6">
                    <InfoRow icon={User} label="Prénom" value={user.prenom} iconColor="text-primary-600" />
                    <InfoRow icon={User} label="Nom" value={user.nom} iconColor="text-primary-600" />
                    <InfoRow icon={Mail} label="Email" value={user.email} iconColor="text-blue-600" />
                  </div>
                  <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                    <InfoRow icon={Phone} label="Téléphone" value={user.telephone || 'Non renseigné'} iconColor="text-green-600" />
                    <InfoRow icon={MapPin} label="Adresse" value={user.adresse || 'Non renseignée'} iconColor="text-orange-600" />
                  </div>
                </div>
              </motion.div>

              {/* Informations juridiques */}
              {isAvocat && (user.specialite || user.barreau || user.numeroPermis) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900">Informations juridiques</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-1">
                    <InfoRow icon={Scale} label="Spécialité" value={user.specialite} iconColor="text-purple-600" />
                    <InfoRow icon={Building} label="Barreau" value={user.barreau} iconColor="text-indigo-600" />
                    <InfoRow icon={Hash} label="Numéro de permis" value={user.numeroPermis} iconColor="text-slate-600" />
                  </div>
                </motion.div>
              )}

              {/* Historique */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Historique</h2>
                  </div>
                </div>
                <div className="p-6 space-y-1">
                  <InfoRow
                    icon={Calendar}
                    label="Créé le"
                    value={new Date(user.creeLe).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    iconColor="text-slate-600"
                  />
                  <InfoRow
                    icon={Clock}
                    label="Dernière modification"
                    value={new Date(user.modifieLe).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    iconColor="text-slate-600"
                  />
                  {user.derniereConnexion && (
                    <InfoRow
                      icon={CheckCircle2}
                      label="Dernière connexion"
                      value={new Date(user.derniereConnexion).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      iconColor="text-green-600"
                    />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informations de compte */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Informations de compte</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Rôle</span>
                    <Badge variant={roleColors[user.role] as any}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Statut</span>
                    <Badge variant={statusBadges[user.statut].variant}>
                      {statusBadges[user.statut].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">ID</span>
                    <span className="font-mono text-xs text-slate-900">{user.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </motion.div>

              {/* Conseils */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 rounded-xl border border-blue-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">Actions rapides</h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="w-full px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2 border border-blue-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier le profil</span>
                  </button>
                  <button
                    onClick={() => router.push(`/parametres/utilisateurs/${user.id}/modifier`)}
                    className="w-full px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2 border border-blue-200"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Gérer les permissions</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Vue Édition */
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Modifier les informations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Modifier les informations</h2>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Prénom"
                        icon={User}
                        required
                        value={formData.prenom}
                        onChange={(e: any) => handleChange('prenom', e.target.value)}
                        error={errors.prenom}
                        disabled={isUpdating}
                      />
                      <FormInput
                        label="Nom"
                        icon={User}
                        required
                        value={formData.nom}
                        onChange={(e: any) => handleChange('nom', e.target.value)}
                        error={errors.nom}
                        disabled={isUpdating}
                      />
                    </div>
                    <FormInput
                      label="Email"
                      icon={Mail}
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e: any) => handleChange('email', e.target.value)}
                      error={errors.email}
                      disabled={isUpdating}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Téléphone"
                        icon={Phone}
                        value={formData.telephone}
                        onChange={(e: any) => handleChange('telephone', e.target.value)}
                        disabled={isUpdating}
                      />
                      <FormInput
                        label="Adresse"
                        icon={MapPin}
                        value={formData.adresse}
                        onChange={(e: any) => handleChange('adresse', e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Informations juridiques (si avocat) */}
                {isAvocat && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="px-6 py-4 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <Scale className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Informations juridiques</h2>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <FormInput
                        label="Spécialité"
                        icon={Scale}
                        value={formData.specialite}
                        onChange={(e: any) => handleChange('specialite', e.target.value)}
                        disabled={isUpdating}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Barreau"
                          icon={Building}
                          value={formData.barreau}
                          onChange={(e: any) => handleChange('barreau', e.target.value)}
                          disabled={isUpdating}
                        />
                        <FormInput
                          label="Numéro de permis"
                          icon={Hash}
                          value={formData.numeroPermis}
                          onChange={(e: any) => handleChange('numeroPermis', e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-6"
                >
                  <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <motion.button
                      type="submit"
                      disabled={isUpdating}
                      whileHover={{ scale: isUpdating ? 1 : 1.02 }}
                      whileTap={{ scale: isUpdating ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">Enregistrement...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span className="font-medium">Enregistrer</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="w-full px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>

                {/* Info pendant édition */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 rounded-xl border border-blue-200 p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-900">Conseils</h3>
                  </div>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>Les modifications seront enregistrées immédiatement</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>Vérifiez bien les informations avant de valider</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>L&apos;utilisateur sera notifié des changements</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}