'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { User as UserType, RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: StatutUtilisateur) => void;
  onView: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  className?: string;
}

export function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  onChangeStatus, 
  onView,
  selected = false,
  onSelect,
  className 
}: UserCardProps) {
  const [] = useState(false);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative",
        selected && "ring-2 ring-primary-500 rounded-lg",
        className
      )}
    >
      <Card className="h-full shadow-elegant hover:shadow-premium transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          {/* En-tête avec statut */}
          <div className="relative h-2">
            <div className={`absolute inset-0 ${getStatutColor(user.statut)}`}></div>
          </div>
          
          <div className="p-6">
            {/* Checkbox pour la sélection */}
            {onSelect && (
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => onSelect(user.id, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                />
              </div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <span className="text-lg font-semibold text-primary-600">
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </span>
                </Avatar>
              </div>
              
              {/* Informations principales */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {user.prenom} {user.nom}
                  </h3>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                
                <div className="flex items-center mt-1 text-sm text-slate-500">
                  <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                {user.telephone && (
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{user.telephone}</span>
                  </div>
                )}
                
                {user.specialite && (
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <Shield className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{user.specialite}</span>
                  </div>
                )}
                
                {user.barreau && (
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>Barreau de {user.barreau}</span>
                  </div>
                )}
              </div>
              
              {/* Menu d'actions */}
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(user.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    {user.statut === StatutUtilisateur.ACTIF ? (
                      <DropdownMenuItem onClick={() => onChangeStatus(user.id, StatutUtilisateur.INACTIF)}>
                        <UserX className="h-4 w-4 mr-2" />
                        Désactiver
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onChangeStatus(user.id, StatutUtilisateur.ACTIF)}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activer
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(user.id)}
                      className="text-danger focus:text-danger"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Informations additionnelles */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500">
                <span>ID: {user.id.substring(0, 8)}...</span>
                <span>Créé le: {new Date(user.creeLe).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}