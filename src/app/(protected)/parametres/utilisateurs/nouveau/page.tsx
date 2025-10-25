'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus, ArrowLeft, Save, Eye, EyeOff, Mail, Phone,
  MapPin, ShieldCheck, Scale, UserCheck, ClipboardList,
  User, Lock, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
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
import { useRouter } from 'next/navigation';
import { useUserForm } from '@/lib/hooks/useUsers';
import { StatutUtilisateur } from '@/lib/types/user.types';
import type { CreateUserForm } from '@/lib/types/user.types';

interface FormErrors {
  [key: string]: string;
}

export default function CreationUtilisateurPage() {
  const { toast } = useToast();
  const router = useRouter();

  // 🔥 UTILISATION DU HOOK useUserForm pour la création
  const {
    submit,
    isSubmitting,
  } = useUserForm(undefined, (user) => {
    // Callback de succès - rediriger vers la liste
    router.push('/parametres/utilisateurs');
  });

  const [formData, setFormData] = useState<Partial<CreateUserForm> & { 
    prenom: string;
    nom: string;
    email: string;
    motDePasse: string;
  }>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    role: undefined,                    // ✅ undefined jusqu'à sélection
    statut: StatutUtilisateur.ACTIF,    // ✅ Valeur par défaut avec enum
    specialite: '',
    barreau: '',
    numeroPermis: '',
    motDePasse: '',
  });

  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleOptions = [
    { value: 'ADMIN', label: 'Administrateur', icon: ShieldCheck, description: 'Accès complet' },
    { value: 'AVOCAT', label: 'Avocat', icon: Scale, description: 'Gestion dossiers' },
    { value: 'ASSISTANT', label: 'Assistant', icon: UserCheck, description: 'Support juridique' },
    { value: 'SECRETAIRE', label: 'Secrétaire', icon: ClipboardList, description: 'Administration' },
    { value: 'STAGIAIRE', label: 'Stagiaire', icon: User, description: 'Accès limité' },
  ];

  const handleChange = (field: keyof CreateUserForm, value: string) => {
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

    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire';
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Minimum 6 caractères';
    }

    if (formData.motDePasse !== confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    if (formData.role === 'AVOCAT') {
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
    // ✅ Validation explicite que role existe
    if (!formData.role) {
      toast({
        title: 'Erreur',
        description: 'Le rôle est obligatoire',
        variant: 'destructive',
      });
      return;
    }

    // Supprimer les champs vides optionnels
    const cleanedData: CreateUserForm = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      motDePasse: formData.motDePasse,
      role: formData.role, // ✅ TypeScript sait que c'est RoleUtilisateur grâce au check ci-dessus
      statut: formData.statut,
      telephone: formData.telephone || undefined,
      adresse: formData.adresse || undefined,
      specialite: formData.specialite || undefined,
      barreau: formData.barreau || undefined,
      numeroPermis: formData.numeroPermis || undefined,
    };

    // 🔥 APPEL DU HOOK - Le toast et la redirection sont gérés automatiquement
    submit(cleanedData);
  };

  const isAvocat = formData.role === 'AVOCAT';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nouvel utilisateur
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ajoutez un nouveau membre à votre cabinet
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
                    <User className="w-5 h-5 text-blue-600" />
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
                          {roleOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {option.label}
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
                          <SelectItem value="ACTIF">Actif</SelectItem>
                          <SelectItem value="INACTIF">Inactif</SelectItem>
                          <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                          <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isAvocat && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t"
                    >
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Informations avocat
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

            {/* Sécurité */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="motDePasse">
                      Mot de passe <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="confirmMotDePasse">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </Label>
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Créer l&apos;utilisateur
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
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Conseils
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Utilisez un email professionnel valide</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Le mot de passe doit contenir au moins 6 caractères</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Pour un avocat, la spécialité et le barreau sont obligatoires</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>L&apos;utilisateur recevra un email de bienvenue</p>
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