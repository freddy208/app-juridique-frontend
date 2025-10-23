'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  MapPin, 
  Shield,
  Calendar,
  Building,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useUser } from '@/lib/hooks/useUsers';
import { RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import { formatDate } from '@/lib/utils';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isLoading, error, isUpdating } = useUser(id);

  const [showEditForm, setShowEditForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Utilisateur non trouvé</h1>
          <p className="text-slate-600 mb-6">
            L&apos;utilisateur que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: RoleUtilisateur) => {
    switch (role) {
      case RoleUtilisateur.ADMIN:
        return 'bg-bordeaux-100 text-bordeaux-800';
      case RoleUtilisateur.DG:
        return 'bg-gold-100 text-gold-800';
      case RoleUtilisateur.AVOCAT:
        return 'bg-primary-100 text-primary-800';
      case RoleUtilisateur.SECRETAIRE:
        return 'bg-slate-100 text-slate-800';
      case RoleUtilisateur.ASSISTANT:
        return 'bg-info-light text-info';
      case RoleUtilisateur.JURISTE:
        return 'bg-warning-light text-warning';
      case RoleUtilisateur.STAGIAIRE:
        return 'bg-success-light text-success';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatutColor = (statut: StatutUtilisateur) => {
    switch (statut) {
      case StatutUtilisateur.ACTIF:
        return 'bg-success text-white';
      case StatutUtilisateur.INACTIF:
        return 'bg-slate-500 text-white';
      case StatutUtilisateur.SUSPENDU:
        return 'bg-warning text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getRoleLabel = (role: RoleUtilisateur) => {
    switch (role) {
      case RoleUtilisateur.ADMIN:
        return 'Administrateur';
      case RoleUtilisateur.DG:
        return 'Directeur Général';
      case RoleUtilisateur.AVOCAT:
        return 'Avocat';
      case RoleUtilisateur.SECRETAIRE:
        return 'Secrétaire';
      case RoleUtilisateur.ASSISTANT:
        return 'Assistant';
      case RoleUtilisateur.JURISTE:
        return 'Juriste';
      case RoleUtilisateur.STAGIAIRE:
        return 'Stagiaire';
      default:
        return role;
    }
  };

  const getStatutLabel = (statut: StatutUtilisateur) => {
    switch (statut) {
      case StatutUtilisateur.ACTIF:
        return 'Actif';
      case StatutUtilisateur.INACTIF:
        return 'Inactif';
      case StatutUtilisateur.SUSPENDU:
        return 'Suspendu';
      default:
        return statut;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleChangeStatus = (ACTIF: any) => {
    // Implémenter la logique pour changer le statut
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Implémenter la logique pour supprimer l'utilisateur
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">
              Détails de l&apos;utilisateur
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowEditForm(!showEditForm)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            
            {user.statut === StatutUtilisateur.ACTIF ? (
              <Button
                variant="outline"
                onClick={() => handleChangeStatus(StatutUtilisateur.INACTIF)}
              >
                <UserX className="h-4 w-4 mr-2" />
                Désactiver
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleChangeStatus(StatutUtilisateur.ACTIF)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Activer
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Formulaire d'édition */}
        {showEditForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Implémenter le formulaire d'édition ici */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Modifier l&apos;utilisateur</h2>
              </CardHeader>
              <CardContent>
                {/* Implémenter le formulaire d'édition ici */}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Informations principales */}
        <Card className="shadow-premium">
          <CardHeader className="bg-gradient-to-r from-primary-600 to-bordeaux-600 text-white">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <span className="text-2xl font-bold">
                  {user.prenom.charAt(0)}{user.nom.charAt(0)}
                </span>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.prenom} {user.nom}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                  <Badge className={getStatutColor(user.statut)}>
                    {getStatutLabel(user.statut)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </div>
                
                {user.telephone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Téléphone</p>
                      <p className="text-sm text-slate-600">{user.telephone}</p>
                    </div>
                  </div>
                )}
                
                {user.adresse && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Adresse</p>
                      <p className="text-sm text-slate-600">{user.adresse}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {user.specialite && (
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Spécialité</p>
                      <p className="text-sm text-slate-600">{user.specialite}</p>
                    </div>
                  </div>
                )}
                
                {user.barreau && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Barreau</p>
                      <p className="text-sm text-slate-600">Barreau de {user.barreau}</p>
                    </div>
                  </div>
                )}
                
                {user.numeroPermis && (
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Numéro de permis</p>
                      <p className="text-sm text-slate-600">{user.numeroPermis}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Informations système</p>
                  <p className="text-sm text-slate-600">
                    Créé le: {formatDate(user.creeLe)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Modifié le: {formatDate(user.modifieLe)}
                  </p>
                  <p className="text-sm text-slate-600">
                    ID: {user.id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de l'utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-elegant">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Dossiers assignés</h3>
              <p className="text-3xl font-bold text-primary-600">0</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tâches en cours</h3>
              <p className="text-3xl font-bold text-warning">0</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Documents</h3>
              <p className="text-3xl font-bold text-success">0</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}