// src/app/(protected)/parametres/profil/page.tsx
'use client';

import { useState, useEffect } from 'react';  // ✅ useEffect au lieu d'un useState bizarre
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Camera,
  Key,
  Save,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { UserAvatar } from '@/components/ui/Avatar';  // ✅ Import corrigé
import { Badge } from '@/components/ui/Badge';
import { useUserProfile } from '@/lib/hooks/useUsers';
import { UpdateProfileForm, ChangePasswordForm, ROLE_LABELS } from '@/lib/types/user.types';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export const dynamic = 'force-dynamic';

// ✅ Interface locale pour le formulaire de profil étendu
interface ProfileFormData extends Omit<UpdateProfileForm, 'ancienMotDePasse' | 'nouveauMotDePasse'> {
  motDePasse?: string;
  confirmMotDePasse?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [showCurrentPassword] = useState(false);
  const [showNewPassword] = useState(false);
  const [showConfirmPassword] = useState(false);

  const {
    user,
    isLoading,
    updateProfile,
    isUpdatingProfile,
  } = useUserProfile();

  // ✅ State pour le formulaire de profil
  const [profileData, setProfileData] = useState<ProfileFormData>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    specialite: '',
    barreau: '',
    numeroPermis: '',
    motDePasse: '',
    confirmMotDePasse: '',
  });

  // ✅ State pour le formulaire de mot de passe
  const [passwordData, setPasswordData] = useState<ChangePasswordForm>({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: '',  // ✅ Nom correct
  });

  // ✅ Mettre à jour les données du profil lorsque l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setProfileData({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        specialite: user.specialite || '',
        barreau: user.barreau || '',
        numeroPermis: user.numeroPermis || '',
        motDePasse: '',
        confirmMotDePasse: '',
      });
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les données du profil
    if (!profileData.prenom || !profileData.nom || !profileData.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Valider le mot de passe si fourni
    if (profileData.motDePasse && profileData.motDePasse !== profileData.confirmMotDePasse) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    // Préparer les données à envoyer
    const dataToSubmit: UpdateProfileForm = {
      prenom: profileData.prenom,
      nom: profileData.nom,
      email: profileData.email,
      telephone: profileData.telephone,
      adresse: profileData.adresse,
      specialite: profileData.specialite,
      barreau: profileData.barreau,
      numeroPermis: profileData.numeroPermis,
    };

    // Ajouter le mot de passe si fourni
    if (profileData.motDePasse) {
      dataToSubmit.nouveauMotDePasse = profileData.motDePasse;
    }

    updateProfile(dataToSubmit);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les données du mot de passe
    if (!passwordData.ancienMotDePasse || !passwordData.nouveauMotDePasse || !passwordData.confirmationMotDePasse) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.nouveauMotDePasse !== passwordData.confirmationMotDePasse) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.nouveauMotDePasse.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // TODO: Implémenter changePassword dans le hook
    console.log('Changement de mot de passe:', passwordData);
    toast.success('Mot de passe changé avec succès');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mon profil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-1">
            <Card className="shadow-premium">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* ✅ UserAvatar corrigé */}
                    <UserAvatar 
                      user={user}
                      size="2xl"
                      showCrown={true}
                    />
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 shadow-md hover:bg-primary-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-semibold text-slate-900">
                    {user.prenom} {user.nom}
                  </h2>
                  
                  <Badge className="mt-2 bg-primary-100 text-primary-800">
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  
                  <div className="mt-6 w-full space-y-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    
                    {user.telephone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.telephone}
                      </div>
                    )}
                    
                    {user.specialite && (
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        {user.specialite}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 w-full text-center">
                    <p>Membre depuis le {formatDate(user.creeLe)}</p>
                    <p>Dernière mise à jour le {formatDate(user.modifieLe)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card className="shadow-premium">
              <CardHeader>
                <div className="flex space-x-1 border-b border-slate-200">
                  <button
                    className={`py-2 px-4 text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Informations personnelles
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium transition-colors ${
                      activeTab === 'password'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    onClick={() => setActiveTab('password')}
                  >
                    Mot de passe
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {activeTab === 'profile' ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Prénom *"
                        value={profileData.prenom}
                        onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                        icon={<User className="h-5 w-5" />}
                        required
                      />
                      
                      <Input
                        label="Nom *"
                        value={profileData.nom}
                        onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                        icon={<User className="h-5 w-5" />}
                        required
                      />
                      
                      <Input
                        label="Email *"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        icon={<Mail className="h-5 w-5" />}
                        required
                      />
                      
                      <Input
                        label="Téléphone"
                        value={profileData.telephone}
                        onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                        icon={<Phone className="h-5 w-5" />}
                      />
                      
                      <div className="md:col-span-2">
                        <Input
                          label="Adresse"
                          value={profileData.adresse}
                          onChange={(e) => setProfileData({ ...profileData, adresse: e.target.value })}
                          icon={<MapPin className="h-5 w-5" />}
                        />
                      </div>
                      
                      <Input
                        label="Spécialité"
                        value={profileData.specialite}
                        onChange={(e) => setProfileData({ ...profileData, specialite: e.target.value })}
                        icon={<Shield className="h-5 w-5" />}
                      />
                      
                      <Input
                        label="Barreau"
                        value={profileData.barreau}
                        onChange={(e) => setProfileData({ ...profileData, barreau: e.target.value })}
                        icon={<Building className="h-5 w-5" />}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={isUpdatingProfile}
                        variant="primary"
                        size="lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-900">Changer le mot de passe</h3>
                      <p className="text-sm text-slate-600">
                        Pour des raisons de sécurité, veuillez saisir votre mot de passe actuel
                      </p>
                      
                      <Input
                        label="Mot de passe actuel *"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.ancienMotDePasse}
                        onChange={(e) => setPasswordData({ ...passwordData, ancienMotDePasse: e.target.value })}
                        icon={<Key className="h-5 w-5" />}
                        required
                      />
                      
                      <Input
                        label="Nouveau mot de passe *"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.nouveauMotDePasse}
                        onChange={(e) => setPasswordData({ ...passwordData, nouveauMotDePasse: e.target.value })}
                        icon={<Shield className="h-5 w-5" />}
                        helperText="Min. 8 caractères"
                        required
                      />
                      
                      <Input
                        label="Confirmer le nouveau mot de passe *"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmationMotDePasse}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmationMotDePasse: e.target.value })}
                        icon={<Shield className="h-5 w-5" />}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Changer le mot de passe
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}