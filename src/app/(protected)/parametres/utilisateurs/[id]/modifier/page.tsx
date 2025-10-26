/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/parametres/utilisateurs/[id]/modifier/page.tsx - VERSION PREMIUM COHÉRENTE
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Scale,
  ClipboardList,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react';
import { useUser, useUserForm } from '@/lib/hooks/useUsers';
import {
  RoleUtilisateur,
  StatutUtilisateur,
  ROLE_LABELS,
  STATUS_LABELS,
  type UpdateUserForm,
} from '@/lib/types/user.types';
import { toast } from 'react-hot-toast';
import { statusBadges } from '@/lib/utils/badge-config';

interface FormErrors {
  [key: string]: string;
}

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

// Form Select Component
const FormSelect = ({
  label,
  icon: Icon,
  error,
  required = false,
  options,
  ...props
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
      )}
      <select
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none bg-white ${
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-slate-200 focus:border-primary-500'
        }`}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
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

// Section Card Component
const SectionCard = ({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </motion.div>
);

export default function ModifyUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { user, isLoading, isUpdating } = useUser(userId);

  const [formData, setFormData] = useState<Partial<UpdateUserForm> & {
    motDePasse?: string;
    confirmMotDePasse?: string;
  }>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    role: undefined as any,
    statut: StatutUtilisateur.ACTIF,
    specialite: '',
    barreau: '',
    numeroPermis: '',
    motDePasse: '',
    confirmMotDePasse: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        role: user.role,
        statut: user.statut,
        specialite: user.specialite || '',
        barreau: user.barreau || '',
        numeroPermis: user.numeroPermis || '',
        motDePasse: '',
        confirmMotDePasse: '',
      });
    }
  }, [user]);

  const roleOptions = [
    { value: RoleUtilisateur.ADMIN, label: ROLE_LABELS[RoleUtilisateur.ADMIN] },
    { value: RoleUtilisateur.DG, label: ROLE_LABELS[RoleUtilisateur.DG] },
    { value: RoleUtilisateur.AVOCAT, label: ROLE_LABELS[RoleUtilisateur.AVOCAT] },
    { value: RoleUtilisateur.JURISTE, label: ROLE_LABELS[RoleUtilisateur.JURISTE] },
    { value: RoleUtilisateur.SECRETAIRE, label: ROLE_LABELS[RoleUtilisateur.SECRETAIRE] },
    { value: RoleUtilisateur.ASSISTANT, label: ROLE_LABELS[RoleUtilisateur.ASSISTANT] },
    { value: RoleUtilisateur.STAGIAIRE, label: ROLE_LABELS[RoleUtilisateur.STAGIAIRE] },
  ];

  const statutOptions = [
    { value: StatutUtilisateur.ACTIF, label: STATUS_LABELS[StatutUtilisateur.ACTIF] },
    { value: StatutUtilisateur.INACTIF, label: STATUS_LABELS[StatutUtilisateur.INACTIF] },
    { value: StatutUtilisateur.SUSPENDU, label: STATUS_LABELS[StatutUtilisateur.SUSPENDU] },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.prenom?.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.nom?.trim()) newErrors.nom = 'Le nom est obligatoire';

    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.role) {
      newErrors.role = 'Le rôle est obligatoire';
    }

    // Validation du mot de passe (optionnel)
    if (formData.motDePasse) {
      if (formData.motDePasse.length < 8) {
        newErrors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.motDePasse)) {
        newErrors.motDePasse = 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre';
      }

      if (formData.motDePasse !== formData.confirmMotDePasse) {
        newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
      }
    }

    // Champs spécifiques avocat
    if (formData.role === RoleUtilisateur.AVOCAT || formData.role === RoleUtilisateur.JURISTE) {
      if (!formData.specialite?.trim()) {
        newErrors.specialite = 'La spécialité est obligatoire pour un avocat/juriste';
      }
      if (!formData.barreau?.trim()) {
        newErrors.barreau = 'Le barreau est obligatoire pour un avocat/juriste';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Remplacer useUser par useUserForm
  const {
    submit,
  } = useUserForm(userId, (user) => {
    // Callback de succès - redirection automatique
    router.push('/parametres/utilisateurs');
  });

  // handleSubmit ultra-simplifié
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    const userData: UpdateUserForm = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      role: formData.role,
      statut: formData.statut,
    };

    if (formData.telephone?.trim()) userData.telephone = formData.telephone;
    if (formData.adresse?.trim()) userData.adresse = formData.adresse;
    if (formData.specialite?.trim()) userData.specialite = formData.specialite;
    if (formData.barreau?.trim()) userData.barreau = formData.barreau;
    if (formData.numeroPermis?.trim()) userData.numeroPermis = formData.numeroPermis;
    if (formData.motDePasse?.trim()) userData.motDePasse = formData.motDePasse;

    // ✅ Appel ultra-simple
    submit(userData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des données...</p>
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

  const isAvocat = formData.role === RoleUtilisateur.AVOCAT || formData.role === RoleUtilisateur.JURISTE;

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-2xl shadow-lg shadow-primary-500/30">
                {user.prenom.charAt(0)}{user.nom.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  Modifier l&apos;utilisateur
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-slate-600">
                    {user.prenom} {user.nom}
                  </p>
                  <Badge variant={roleColors[user.role] as any}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  <Badge variant={statusBadges[user.statut].variant}>
                    {statusBadges[user.statut].label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
              <SectionCard title="Informations personnelles" icon={User} delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Prénom"
                    icon={User}
                    required
                    type="text"
                    placeholder="Jean"
                    value={formData.prenom}
                    onChange={(e: any) => handleChange('prenom', e.target.value)}
                    error={errors.prenom}
                    disabled={isUpdating}
                  />
                  <FormInput
                    label="Nom"
                    icon={User}
                    required
                    type="text"
                    placeholder="Dupont"
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
                  placeholder="jean.dupont@cabinet.fr"
                  value={formData.email}
                  onChange={(e: any) => handleChange('email', e.target.value)}
                  error={errors.email}
                  disabled={isUpdating}
                />
              </SectionCard>

              {/* Contact */}
              <SectionCard title="Informations de contact" icon={Phone} delay={0.2}>
                <FormInput
                  label="Téléphone"
                  icon={Phone}
                  type="tel"
                  placeholder="+237 6XX XX XX XX"
                  value={formData.telephone}
                  onChange={(e: any) => handleChange('telephone', e.target.value)}
                  error={errors.telephone}
                  disabled={isUpdating}
                />
                <FormInput
                  label="Adresse"
                  icon={MapPin}
                  type="text"
                  placeholder="Douala, Cameroun"
                  value={formData.adresse}
                  onChange={(e: any) => handleChange('adresse', e.target.value)}
                  error={errors.adresse}
                  disabled={isUpdating}
                />
              </SectionCard>

              {/* Informations juridiques (conditionnel) */}
              <AnimatePresence>
                {isAvocat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionCard title="Informations juridiques" icon={Scale} delay={0.3}>
                      <FormInput
                        label="Spécialité"
                        icon={Scale}
                        required
                        type="text"
                        placeholder="Ex: Droit des affaires"
                        value={formData.specialite}
                        onChange={(e: any) => handleChange('specialite', e.target.value)}
                        error={errors.specialite}
                        disabled={isUpdating}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Barreau"
                          icon={Briefcase}
                          required
                          type="text"
                          placeholder="Barreau de Douala"
                          value={formData.barreau}
                          onChange={(e: any) => handleChange('barreau', e.target.value)}
                          error={errors.barreau}
                          disabled={isUpdating}
                        />
                        <FormInput
                          label="Numéro de permis"
                          icon={ClipboardList}
                          type="text"
                          placeholder="AVT-2020-001"
                          value={formData.numeroPermis}
                          onChange={(e: any) => handleChange('numeroPermis', e.target.value)}
                          error={errors.numeroPermis}
                          disabled={isUpdating}
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modifier le mot de passe (optionnel) */}
              <SectionCard title="Modifier le mot de passe (optionnel)" icon={Lock} delay={0.4}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Laisser vide pour ne pas changer"
                        value={formData.motDePasse}
                        onChange={(e) => handleChange('motDePasse', e.target.value)}
                        disabled={isUpdating}
                        className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                          errors.motDePasse
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-slate-200 focus:border-primary-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.motDePasse && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.motDePasse}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {formData.motDePasse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-slate-700">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirmer le nouveau mot de passe"
                          value={formData.confirmMotDePasse}
                          onChange={(e) => handleChange('confirmMotDePasse', e.target.value)}
                          disabled={isUpdating}
                          className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                            errors.confirmMotDePasse
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-slate-200 focus:border-primary-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.confirmMotDePasse && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.confirmMotDePasse}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Indicateur de force du mot de passe */}
                  {formData.motDePasse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <p className="text-sm font-medium text-slate-700">Force du mot de passe</p>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => {
                          const strength =
                            formData.motDePasse!.length >= 12 ? 4 :
                            formData.motDePasse!.length >= 10 ? 3 :
                            formData.motDePasse!.length >= 8 ? 2 : 1;

                          return (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all ${
                                level <= strength
                                  ? strength === 4 ? 'bg-green-500' :
                                    strength === 3 ? 'bg-blue-500' :
                                    strength === 2 ? 'bg-yellow-500' : 'bg-red-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-500">
                        {formData.motDePasse.length >= 12 ? 'Très fort' :
                         formData.motDePasse.length >= 10 ? 'Fort' :
                         formData.motDePasse.length >= 8 ? 'Moyen' : 'Faible'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rôle et Statut */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6"
              >
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                  <FormSelect
                    label="Rôle"
                    icon={ShieldCheck}
                    required
                    value={formData.role || ''}
                    onChange={(e: any) => handleChange('role', e.target.value)}
                    error={errors.role}
                    disabled={isUpdating}
                    options={roleOptions}
                  />

                  <FormSelect
                    label="Statut"
                    icon={CheckCircle2}
                    required
                    value={formData.statut}
                    onChange={(e: any) => handleChange('statut', e.target.value)}
                    error={errors.statut}
                    disabled={isUpdating}
                    options={statutOptions}
                  />

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
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
                      onClick={() => router.back()}
                      disabled={isUpdating}
                      className="w-full px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Conseils */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
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
                    <p>Vérifiez bien les informations avant de valider</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Le mot de passe est optionnel - laissez vide pour ne pas le changer</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Pour un avocat, la spécialité et le barreau sont obligatoires</p>
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
      </div>
    </div>
  );
}