'use client';

import { useState } from 'react';
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
  Eye,
  EyeOff,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useUserProfile } from '@/lib/hooks/useUsers';
import { UpdateProfileForm, ChangePasswordForm } from '@/lib/types/user.types';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [] = useState(false);

  const {
    user,
    isLoading,
    updateProfile,
    changePassword,
    isUpdatingProfile,
    isChangingPassword,
  } = useUserProfile();

  const [profileData, setProfileData] = useState<UpdateProfileForm>({
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

  const [passwordData, setPasswordData] = useState<ChangePasswordForm>({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmNouveauMotDePasse: '',
  });

  // Mettre à jour les données du profil lorsque l'utilisateur est chargé
  useState(() => {
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
  });

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

    updateProfile(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les données du mot de passe
    if (!passwordData.ancienMotDePasse || !passwordData.nouveauMotDePasse || !passwordData.confirmNouveauMotDePasse) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.nouveauMotDePasse !== passwordData.confirmNouveauMotDePasse) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.nouveauMotDePasse.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    changePassword(passwordData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
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
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <span className="text-3xl font-bold text-primary-600">
                        {user?.prenom.charAt(0)}{user?.nom.charAt(0)}
                      </span>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1 shadow-md">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-semibold text-slate-900">
                    {user?.prenom} {user?.nom}
                  </h2>
                  
                  <Badge className="mt-2 bg-primary-100 text-primary-800">
                    {user?.role}
                  </Badge>
                  
                  <div className="mt-6 w-full space-y-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user?.email}
                    </div>
                    
                    {user?.telephone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.telephone}
                      </div>
                    )}
                    
                    {user?.specialite && (
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        {user.specialite}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
                    <p>Membre depuis le {formatDate(user?.creeLe || '')}</p>
                    <p>Dernière mise à jour le {formatDate(user?.modifieLe || '')}</p>
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
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Informations personnelles
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium ${
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
                      <div>
                        <Input
                          label="Prénom"
                          value={profileData.prenom}
                          onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                          icon={<User className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Nom"
                          value={profileData.nom}
                          onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                          icon={<User className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          icon={<Mail className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Téléphone"
                          value={profileData.telephone}
                          onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                          icon={<Phone className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Input
                          label="Adresse"
                          value={profileData.adresse}
                          onChange={(e) => setProfileData({ ...profileData, adresse: e.target.value })}
                          icon={<MapPin className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Spécialité"
                          value={profileData.specialite}
                          onChange={(e) => setProfileData({ ...profileData, specialite: e.target.value })}
                          icon={<Shield className="h-5 w-5" />}
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Barreau"
                          value={profileData.barreau}
                          onChange={(e) => setProfileData({ ...profileData, barreau: e.target.value })}
                          icon={<Building className="h-5 w-5" />}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-900">Changer le mot de passe</h3>
                      <p className="text-sm text-slate-600">
                        Laissez les champs vides si vous ne souhaitez pas modifier votre mot de passe
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Input
                            label="Nouveau mot de passe"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={profileData.motDePasse}
                            onChange={(e) => setProfileData({ ...profileData, motDePasse: e.target.value })}
                            icon={<Shield className="h-5 w-5" />}
                            actionIcon={showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            onActionClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          />
                        </div>
                        
                        <div>
                          <Input
                            label="Confirmer le mot de passe"
                            type={showNewPassword ? 'text' : 'password'}
                            value={profileData.confirmMotDePasse}
                            onChange={(e) => setProfileData({ ...profileData, confirmMotDePasse: e.target.value })}
                            icon={<Shield className="h-5 w-5" />}
                            actionIcon={showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            onActionClick={() => setShowNewPassword(!showNewPassword)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={isUpdatingProfile}
                        className="bg-gradient-to-r from-primary-600 to-bordeaux-600 hover:from-primary-700 hover:to-bordeaux-700"
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
                        label="Mot de passe actuel"
                        type="password"
                        value={passwordData.ancienMotDePasse}
                        onChange={(e) => setPasswordData({ ...passwordData, ancienMotDePasse: e.target.value })}
                        icon={<Key className="h-5 w-5" />}
                      />
                      
                      <Input
                        label="Nouveau mot de passe"
                        type="password"
                        value={passwordData.nouveauMotDePasse}
                        onChange={(e) => setPasswordData({ ...passwordData, nouveauMotDePasse: e.target.value })}
                        icon={<Shield className="h-5 w-5" />}
                      />
                      
                      <Input
                        label="Confirmer le nouveau mot de passe"
                        type="password"
                        value={passwordData.confirmNouveauMotDePasse}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmNouveauMotDePasse: e.target.value })}
                        icon={<Shield className="h-5 w-5" />}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={isChangingPassword}
                        className="bg-gradient-to-r from-primary-600 to-bordeaux-600 hover:from-primary-700 hover:to-bordeaux-700"
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