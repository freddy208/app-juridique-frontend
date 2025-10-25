'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCog, ArrowLeft, Save, Eye, EyeOff, Mail, Phone,
  MapPin, ShieldCheck, Scale, UserCheck, ClipboardList,
  User, Lock, AlertCircle, CheckCircle, Loader2, Ban,
  Crown, Briefcase, GraduationCap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useToast } from '@/lib/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useUserForm } from '@/lib/hooks/useUsers';
import type { UpdateUserForm } from '@/lib/types/user.types';
import { 
  RoleUtilisateur, 
  StatutUtilisateur,
  ROLE_LABELS,
  STATUS_LABELS
} from '@/lib/types/user.types';

interface FormErrors {
  [key: string]: string;
}

// Configuration des icônes par rôle
const ROLE_ICONS = {
  [RoleUtilisateur.ADMIN]: ShieldCheck,
  [RoleUtilisateur.DG]: Crown,
  [RoleUtilisateur.AVOCAT]: Scale,
  [RoleUtilisateur.SECRETAIRE]: ClipboardList,
  [RoleUtilisateur.ASSISTANT]: UserCheck,
  [RoleUtilisateur.JURISTE]: Briefcase,
  [RoleUtilisateur.STAGIAIRE]: GraduationCap,
};

export default function ModificationUtilisateurPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  // 🔥 HOOK useUserForm en mode édition
  const {
    existingUser,
    isEditMode,
    submit,
    isSubmitting,
  } = useUserForm(userId, (user) => {
    // Callback succès - redirection vers le profil
    router.push(`/dashboard/users/${userId}`);
  });

  const [formData, setFormData] = useState<UpdateUserForm>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    role: undefined,
    statut: undefined,
    specialite: '',
    barreau: '',
    numeroPermis: '',
    motDePasse: '', // Optionnel en modification
  });

  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pré-remplir le formulaire quand les données arrivent
  useEffect(() => {
    if (existingUser) {
      setFormData({
        prenom: existingUser.prenom,
        nom: existingUser.nom,
        email: existingUser.email,
        telephone: existingUser.telephone || '',
        adresse: existingUser.adresse || '',
        role: existingUser.role,
        statut: existingUser.statut,
        specialite: existingUser.specialite || '',
        barreau: existingUser.barreau || '',
        numeroPermis: existingUser.numeroPermis || '',
        motDePasse: '', // Ne pas pré-remplir le mot de passe
      });
    }
  }, [existingUser]);

  const handleChange = (field: keyof UpdateUserForm, value: string) => {
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
    if (!formData.role) newErrors.role = 'Le rôle est obligatoire';

    // Validation du mot de passe (seulement si renseigné)
    if (formData.motDePasse) {
      if (formData.motDePasse.length < 8) {
        newErrors.motDePasse = 'Minimum 8 caractères';
      }
      if (formData.motDePasse !== confirmMotDePasse) {
        newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
      }
    }

    // Champs obligatoires pour AVOCAT et JURISTE
    if (
      formData.role === RoleUtilisateur.AVOCAT || 
      formData.role === RoleUtilisateur.JURISTE
    ) {
      if (!formData.specialite?.trim()) newErrors.specialite = 'Spécialité obligatoire';
      if (!formData.barreau?.trim()) newErrors.barreau = 'Barreau obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs',
        variant: 'destructive',
      });
      return;
    }

    // Nettoyer les données
    const cleanedData: UpdateUserForm = { ...formData };
    
    // Supprimer le mot de passe si vide (pas de changement)
    if (!cleanedData.motDePasse) {
      delete cleanedData.motDePasse;
    }
    
    // Nettoyer les champs optionnels
    if (!cleanedData.telephone) delete cleanedData.telephone;
    if (!cleanedData.adresse) delete cleanedData.adresse;
    if (!cleanedData.specialite) delete cleanedData.specialite;
    if (!cleanedData.barreau) delete cleanedData.barreau;
    if (!cleanedData.numeroPermis) delete cleanedData.numeroPermis;

    // 🔥 Soumission via le hook
    submit(cleanedData);
  };

  // État de chargement des données
  if (!existingUser && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Utilisateur introuvable
  if (!existingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Ban className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Utilisateur introuvable
          </h2>
          <p className="text-gray-600 mb-6">
            L&apos;utilisateur que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push('/parametres/utilisateurs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const isRoleJuridique = 
    formData.role === RoleUtilisateur.AVOCAT || 
    formData.role === RoleUtilisateur.JURISTE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <UserCog className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Modifier l&apos;utilisateur
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Mettre à jour les informations de {existingUser.prenom} {existingUser.nom}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom">
                        Prénom <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => handleChange('prenom', e.target.value)}
                        placeholder="Ex: Jean"
                        className={errors.prenom ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.prenom}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nom">
                        Nom <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => handleChange('nom', e.target.value)}
                        placeholder="Ex: Dupont"
                        className={errors.nom ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.nom}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="exemple@cabinet.cm"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => handleChange('telephone', e.target.value)}
                        placeholder="+237 6XX XXX XXX"
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="adresse"
                        value={formData.adresse}
                        onChange={(e) => handleChange('adresse', e.target.value)}
                        placeholder="Adresse complète"
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informations professionnelles */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-600" />
                    Informations professionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">
                        Rôle <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={(value) => handleChange('role', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(RoleUtilisateur).map((role) => {
                            const Icon = ROLE_ICONS[role];
                            return (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {ROLE_LABELS[role]}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.role}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="statut">Statut</Label>
                      <Select 
                        value={formData.statut} 
                        onValueChange={(value) => handleChange('statut', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(StatutUtilisateur).map((statut) => (
                            <SelectItem key={statut} value={statut}>
                              {STATUS_LABELS[statut]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isRoleJuridique && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Informations juridiques obligatoires
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="specialite">
                          Spécialité <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="specialite"
                          value={formData.specialite}
                          onChange={(e) => handleChange('specialite', e.target.value)}
                          placeholder="Ex: Droit des affaires"
                          className={errors.specialite ? 'border-red-500' : ''}
                          disabled={isSubmitting}
                        />
                        {errors.specialite && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.specialite}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="barreau">
                          Barreau <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="barreau"
                          value={formData.barreau}
                          onChange={(e) => handleChange('barreau', e.target.value)}
                          placeholder="Ex: Barreau de Douala"
                          className={errors.barreau ? 'border-red-500' : ''}
                          disabled={isSubmitting}
                        />
                        {errors.barreau && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.barreau}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="numeroPermis">Numéro de permis</Label>
                        <Input
                          id="numeroPermis"
                          value={formData.numeroPermis}
                          onChange={(e) => handleChange('numeroPermis', e.target.value)}
                          placeholder="Ex: AVT-2020-001"
                          disabled={isSubmitting}
                        />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Modifier le mot de passe (optionnel) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    Modifier le mot de passe
                  </CardTitle>
                  <CardDescription>
                    Laissez vide si vous ne voulez pas changer le mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="motDePasse">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="motDePasse"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.motDePasse}
                        onChange={(e) => handleChange('motDePasse', e.target.value)}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${errors.motDePasse ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.motDePasse && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.motDePasse}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmMotDePasse">Confirmer le nouveau mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmMotDePasse"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmMotDePasse}
                        onChange={(e) => {
                          setConfirmMotDePasse(e.target.value);
                          if (errors.confirmMotDePasse) {
                            setErrors({ ...errors, confirmMotDePasse: '' });
                          }
                        }}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${errors.confirmMotDePasse ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmMotDePasse && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmMotDePasse}
                      </p>
                    )}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Si vous laissez ces champs vides, le mot de passe actuel sera conservé.
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => router.push(`/paramentres/utilisateur/profil`)}
                    disabled={isSubmitting}
                  >
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Conseils
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Vérifiez bien l&apos;email avant d&apos;enregistrer</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Le mot de passe est optionnel lors de la modification</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Pour les avocats et juristes, spécialité et barreau sont obligatoires</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Les modifications sont effectives immédiatement</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}