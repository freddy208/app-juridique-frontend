'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Eye, 
  EyeOff,
  Building,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { RoleUtilisateur, StatutUtilisateur, CreateUserForm, UpdateUserForm } from '@/lib/types/user.types';
import { Controller } from 'react-hook-form';

// Schéma de validation pour la création
const createUserSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmMotDePasse: z.string().min(1, 'La confirmation du mot de passe est requise'),
  role: z.nativeEnum(RoleUtilisateur),
  statut: z.nativeEnum(StatutUtilisateur).optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  specialite: z.string().optional(),
  barreau: z.string().optional(),
  numeroPermis: z.string().optional(),
}).refine((data) => data.motDePasse === data.confirmMotDePasse, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmMotDePasse'],
});

// Schéma de validation pour la modification
const updateUserSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  role: z.nativeEnum(RoleUtilisateur),
  statut: z.nativeEnum(StatutUtilisateur),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  specialite: z.string().optional(),
  barreau: z.string().optional(),
  numeroPermis: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  initialData?: UpdateUserForm;
  onSubmit: (data: CreateUserForm | UpdateUserForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const roleOptions = [
  { value: RoleUtilisateur.ADMIN, label: 'Administrateur' },
  { value: RoleUtilisateur.DG, label: 'Directeur Général' },
  { value: RoleUtilisateur.AVOCAT, label: 'Avocat' },
  { value: RoleUtilisateur.SECRETAIRE, label: 'Secrétaire' },
  { value: RoleUtilisateur.ASSISTANT, label: 'Assistant' },
  { value: RoleUtilisateur.JURISTE, label: 'Juriste' },
  { value: RoleUtilisateur.STAGIAIRE, label: 'Stagiaire' },
];

const statutOptions = [
  { value: StatutUtilisateur.ACTIF, label: 'Actif' },
  { value: StatutUtilisateur.INACTIF, label: 'Inactif' },
  { value: StatutUtilisateur.SUSPENDU, label: 'Suspendu' },
];

export function UserForm({ initialData, onSubmit, onCancel, isLoading = false, mode }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: mode === 'edit' ? initialData : {
      statut: StatutUtilisateur.ACTIF,
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      reset(initialData);
    }
  }, [initialData, mode, reset]);

const onFormSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
  if (mode === 'create') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmMotDePasse, ...submitData } = data as CreateUserFormData;
    // Utiliser une assertion de type pour indiquer à TypeScript que submitData est un CreateUserForm
    onSubmit(submitData as CreateUserForm);
  } else {
    onSubmit(data as UpdateUserForm);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="shadow-premium">
        <CardHeader className="bg-gradient-to-r from-primary-600 to-bordeaux-600 text-white">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Créer un nouvel utilisateur' : 'Modifier un utilisateur'}
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <Input
                  label="Prénom"
                  placeholder="Entrez le prénom"
                  icon={<User className="h-5 w-5" />}
                  error={errors.prenom?.message}
                  {...register('prenom')}
                />
              </div>

              {/* Nom */}
              <div>
                <Input
                  label="Nom"
                  placeholder="Entrez le nom"
                  icon={<User className="h-5 w-5" />}
                  error={errors.nom?.message}
                  {...register('nom')}
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="exemple@cabinet.cm"
                  icon={<Mail className="h-5 w-5" />}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              {/* Mot de passe (uniquement pour la création) */}
              {mode === 'create' && (
                <>
                  <div>
                    <Input
                      label="Mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez le mot de passe"
                      icon={<Shield className="h-5 w-5" />}
                      actionIcon={showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      onActionClick={() => setShowPassword(!showPassword)}
                      error={mode === 'create' && 'motDePasse' in errors ? errors.motDePasse?.message : undefined}
                      {...register('motDePasse')}
                    />
                  </div>

                  <div>
                    <Input
                      label="Confirmer le mot de passe"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmez le mot de passe"
                      icon={<Shield className="h-5 w-5" />}
                      actionIcon={showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      onActionClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      error={mode === 'create' && 'confirmMotDePasse' in errors ? errors.confirmMotDePasse?.message : undefined}
                      {...register('confirmMotDePasse')}
                    />
                  </div>
                </>
              )}

              {/* Rôle */}
              <div>
                <Controller
                    name="role"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Rôle"
                        options={roleOptions}
                        error={fieldState.error?.message}
                        value={field.value}
                        onChange={(value) => field.onChange(value)} // ici value = string
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
              </div>

              {/* Statut */}
              <div>
               <Controller
                  name="statut"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Statut"
                      options={statutOptions}
                      error={fieldState.error?.message}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  )}
                />
              </div>

              {/* Téléphone */}
              <div>
                <Input
                  label="Téléphone"
                  placeholder="+237 6XX XXX XXX"
                  icon={<Phone className="h-5 w-5" />}
                  error={errors.telephone?.message}
                  {...register('telephone')}
                />
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <Input
                  label="Adresse"
                  placeholder="Entrez l'adresse complète"
                  icon={<MapPin className="h-5 w-5" />}
                  error={errors.adresse?.message}
                  {...register('adresse')}
                />
              </div>

              {/* Spécialité (affiché pour les avocats et juristes) */}
              {(selectedRole === RoleUtilisateur.AVOCAT || selectedRole === RoleUtilisateur.JURISTE) && (
                <div>
                  <Input
                    label="Spécialité"
                    placeholder="Ex: Droit des affaires, Droit immobilier..."
                    icon={<Briefcase className="h-5 w-5" />}
                    error={errors.specialite?.message}
                    {...register('specialite')}
                  />
                </div>
              )}

              {/* Barreau (affiché pour les avocats) */}
              {selectedRole === RoleUtilisateur.AVOCAT && (
                <div>
                  <Input
                    label="Barreau"
                    placeholder="Ex: Barreau de Douala"
                    icon={<Building className="h-5 w-5" />}
                    error={errors.barreau?.message}
                    {...register('barreau')}
                  />
                </div>
              )}

              {/* Numéro de permis (affiché pour les avocats) */}
              {selectedRole === RoleUtilisateur.AVOCAT && (
                <div>
                  <Input
                    label="Numéro de permis"
                    placeholder="Entrez le numéro de permis"
                    icon={<Shield className="h-5 w-5" />}
                    error={errors.numeroPermis?.message}
                    {...register('numeroPermis')}
                  />
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                className="bg-gradient-to-r from-primary-600 to-bordeaux-600 hover:from-primary-700 hover:to-bordeaux-700"
              >
                {mode === 'create' ? 'Créer l\'utilisateur' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}