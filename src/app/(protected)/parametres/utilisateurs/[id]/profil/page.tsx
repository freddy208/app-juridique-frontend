/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/parametres/utilisateurs/profil/page.tsx - VERSION PREMIUM
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Key,
  Save,
  Briefcase,
  Scale,
  CheckCircle2,
  AlertCircle,
  Building,
  Hash,
  Loader2,
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUsers';
import {
  RoleUtilisateur,
  ROLE_LABELS,
  STATUS_LABELS,
  type UpdateUserForm,
} from '@/lib/types/user.types';
import { toast } from 'react-hot-toast';
import { statusBadges } from '@/lib/utils/badge-config';

// Badge Component
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Info Row Component
const InfoRow = ({
  icon: Icon,
  label,
  value,
  color = 'text-slate-600'
}: {
  icon: any;
  label: string;
  value: string | null | undefined;
  color?: string;
}) => {
  if (!value) return null;
  const displayValue = value || 'Non renseigné';
  return (
    <div className="flex items-center space-x-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-base font-medium text-slate-900 truncate">{displayValue}</p>
      </div>
    </div>
  );
};

// Section Card Component
const SectionCard = ({
  title,
  icon: Icon,
  children,
  delay = 0,
  action,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  delay?: number;
  action?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

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
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<'info' | 'edit'>('info');
  const [showPassword, setShowPassword] = useState(false);
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
        setActiveTab('info');
        toast.success('Profil mis à jour avec succès');
      },
    });
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
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const isAvocat = user.role === RoleUtilisateur.AVOCAT || user.role === RoleUtilisateur.JURISTE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30">
                {user.prenom.charAt(0)}{user.nom.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  {user.prenom} {user.nom}
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    user.role === RoleUtilisateur.ADMIN ? 'blue' :
                    user.role === RoleUtilisateur.DG ? 'purple' :
                    user.role === RoleUtilisateur.AVOCAT ? 'blue' :
                    user.role === RoleUtilisateur.JURISTE ? 'orange' :
                    'teal'
                  }>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  <Badge variant={statusBadges[user.statut].color}>
                    {statusBadges[user.statut].label}
                  </Badge>
                </div>
              </div>
            </div>

            {activeTab === 'info' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('edit')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
              >
                <Edit className="w-5 h-5" />
                <span className="font-medium">Modifier le profil</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {activeTab === 'info' ? (
          /* Vue Information */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="Informations personnelles" icon={User} delay={0.1}>
                <div className="space-y-1">
                  <InfoRow icon={User} label="Prénom" value={user.prenom} color="text-primary-600" />
                  <InfoRow icon={User} label="Nom" value={user.nom} color="text-primary-600" />
                  <InfoRow icon={Mail} label="Email" value={user.email} color="text-blue-600" />
                  <InfoRow icon={Phone} label="Téléphone" value={user.telephone} color="text-green-600" />
                  <InfoRow icon={MapPin} label="Adresse" value={user.adresse} color="text-orange-600" />
                </div>
              </SectionCard>

              {isAvocat && (user.specialite || user.barreau || user.numeroPermis) && (
                <SectionCard title="Informations juridiques" icon={Scale} delay={0.2}>
                  <div className="space-y-1">
                    <InfoRow icon={Scale} label="Spécialité" value={user.specialite} color="text-purple-600" />
                    <InfoRow icon={Building} label="Barreau" value={user.barreau} color="text-indigo-600" />
                    <InfoRow icon={Hash} label="Numéro de permis" value={user.numeroPermis} color="text-slate-600" />
                  </div>
                </SectionCard>
              )}

              <SectionCard title="Historique" icon={Clock} delay={0.3}>
                <div className="space-y-1">
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
                    color="text-slate-600"
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
                    color="text-slate-600"
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
                      color="text-green-600"
                    />
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-primary-900">Informations de compte</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-primary-100">
                    <span className="text-primary-700">Rôle</span>
                    <span className="font-medium text-primary-900">{ROLE_LABELS[user.role]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary-100">
                    <span className="text-primary-700">Statut</span>
                    <span className="font-medium text-primary-900">{STATUS_LABELS[user.statut]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-primary-700">ID</span>
                    <span className="font-mono text-xs text-primary-900">{user.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 rounded-xl border border-blue-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">Actions rapides</h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className="w-full px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier le profil</span>
                  </button>
                  <button
                    onClick={() => router.push(`/parametres/utilisateurs/${user.id}/modifier`)}
                    className="w-full px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Réinitialiser mot de passe</span>
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
                <SectionCard title="Modifier les informations" icon={Edit} delay={0.1}>
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
                </SectionCard>

                {isAvocat && (
                  <SectionCard title="Informations juridiques" icon={Scale} delay={0.2}>
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
                  </SectionCard>
                )}
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6"
                >
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
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
                      onClick={() => {
                        setActiveTab('info');
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
                        setErrors({});
                      }}
                      disabled={isUpdating}
                      className="w-full px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
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