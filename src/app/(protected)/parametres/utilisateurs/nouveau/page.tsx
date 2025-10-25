/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/parametres/utilisateurs/nouveau/page.tsx - VERSION PREMIUM
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  UserCheck,
  ClipboardList,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react';
import { useUsers } from '@/lib/hooks/useUsers';
import { 
  RoleUtilisateur, 
  StatutUtilisateur,
  ROLE_LABELS,
  STATUS_LABELS,
  type CreateUserForm 
} from '@/lib/types/user.types';
import { toast } from 'react-hot-toast';

interface FormErrors {
  [key: string]: string;
}

// Composant Input personnalisé
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

// Composant Select personnalisé
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

// Composant Card de section
const SectionCard = ({ 
  title, 
  icon: Icon, 
  children, 
  delay = 0 
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

export default function NewUserPage() {
  const router = useRouter();
  const { createUser, isCreating } = useUsers();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<Partial<CreateUserForm> & {
    prenom: string;
    nom: string;
    email: string;
    motDePasse: string;
    confirmMotDePasse: string;
  }>({
    prenom: '',
    nom: '',
    email: '',
    motDePasse: '',
    confirmMotDePasse: '',
    role: undefined as any,
    statut: StatutUtilisateur.ACTIF,
    telephone: '',
    adresse: '',
    specialite: '',
    barreau: '',
    numeroPermis: '',
  });

  const roleOptions = [
    { value: '', label: 'Sélectionner un rôle', icon: User },
    { value: RoleUtilisateur.ADMIN, label: ROLE_LABELS[RoleUtilisateur.ADMIN], icon: ShieldCheck },
    { value: RoleUtilisateur.DG, label: ROLE_LABELS[RoleUtilisateur.DG], icon: Briefcase },
    { value: RoleUtilisateur.AVOCAT, label: ROLE_LABELS[RoleUtilisateur.AVOCAT], icon: Scale },
    { value: RoleUtilisateur.JURISTE, label: ROLE_LABELS[RoleUtilisateur.JURISTE], icon: Scale },
    { value: RoleUtilisateur.SECRETAIRE, label: ROLE_LABELS[RoleUtilisateur.SECRETAIRE], icon: ClipboardList },
    { value: RoleUtilisateur.ASSISTANT, label: ROLE_LABELS[RoleUtilisateur.ASSISTANT], icon: UserCheck },
    { value: RoleUtilisateur.STAGIAIRE, label: ROLE_LABELS[RoleUtilisateur.STAGIAIRE], icon: User },
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

    // Champs obligatoires
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    
    // Email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    // Rôle
    if (!formData.role) {
      newErrors.role = 'Le rôle est obligatoire';
    }
    
    // Mot de passe
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire';
    } else if (formData.motDePasse.length < 8) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.motDePasse)) {
      newErrors.motDePasse = 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre';
    }
    
    // Confirmation mot de passe
    if (!formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Veuillez confirmer le mot de passe';
    } else if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    const userData: CreateUserForm = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      motDePasse: formData.motDePasse,
      role: formData.role!,
      statut: formData.statut,
      telephone: formData.telephone || undefined,
      adresse: formData.adresse || undefined,
      specialite: formData.specialite || undefined,
      barreau: formData.barreau || undefined,
      numeroPermis: formData.numeroPermis || undefined,
    };

    createUser(userData, {
      onSuccess: () => {
        router.push('/parametres/utilisateurs');
      },
    });
  };

  const isAvocat = formData.role === RoleUtilisateur.AVOCAT || formData.role === RoleUtilisateur.JURISTE;

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
            <span className="font-medium">Retour à la liste</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                Nouvel Utilisateur
              </h1>
              <p className="text-slate-600">
                Ajoutez un nouveau membre à votre cabinet juridique
              </p>
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
                    disabled={isCreating}
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
                    disabled={isCreating}
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
                  disabled={isCreating}
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
                  disabled={isCreating}
                />
                <FormInput
                  label="Adresse"
                  icon={MapPin}
                  type="text"
                  placeholder="Douala, Cameroun"
                  value={formData.adresse}
                  onChange={(e: any) => handleChange('adresse', e.target.value)}
                  error={errors.adresse}
                  disabled={isCreating}
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
                        disabled={isCreating}
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
                          disabled={isCreating}
                        />
                        <FormInput
                          label="Numéro de permis"
                          icon={ClipboardList}
                          type="text"
                          placeholder="AVT-2020-001"
                          value={formData.numeroPermis}
                          onChange={(e: any) => handleChange('numeroPermis', e.target.value)}
                          error={errors.numeroPermis}
                          disabled={isCreating}
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sécurité */}
              <SectionCard title="Sécurité" icon={Lock} delay={0.4}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.motDePasse}
                        onChange={(e) => handleChange('motDePasse', e.target.value)}
                        disabled={isCreating}
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmMotDePasse}
                        onChange={(e) => handleChange('confirmMotDePasse', e.target.value)}
                        disabled={isCreating}
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
                  </div>

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
                            formData.motDePasse.length >= 12 ? 4 :
                            formData.motDePasse.length >= 10 ? 3 :
                            formData.motDePasse.length >= 8 ? 2 : 1;
                          
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
                    disabled={isCreating}
                    options={roleOptions}
                  />

                  <FormSelect
                    label="Statut"
                    icon={CheckCircle2}
                    required
                    value={formData.statut}
                    onChange={(e: any) => handleChange('statut', e.target.value)}
                    error={errors.statut}
                    disabled={isCreating}
                    options={statutOptions}
                  />

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <motion.button
                      type="submit"
                      disabled={isCreating}
                      whileHover={{ scale: isCreating ? 1 : 1.02 }}
                      whileTap={{ scale: isCreating ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">Création en cours...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span className="font-medium">Créer l&apos;utilisateur</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={isCreating}
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
                    <p>Utilisez un email professionnel valide</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Le mot de passe doit contenir au moins 8 caractères</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Pour un avocat, la spécialité et le barreau sont obligatoires</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>L&apos;utilisateur recevra un email de bienvenue</p>
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