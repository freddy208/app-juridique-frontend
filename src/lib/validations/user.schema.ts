// src/lib/validations/user.schema.ts

/**
 * ============================================
 * SCHÉMAS DE VALIDATION ZOD - MODULE USERS
 * ============================================
 * Validation des formulaires avec Zod
 * Synchronisé avec les DTOs backend
 */

import { z } from 'zod';
import { RoleUtilisateur, StatutUtilisateur } from '@/lib/types/user.types';
import { zodEnumWithMessage } from '@/lib/validations/zodEnumWithMessage';
import { zodEnumListWithMessage } from '@/lib/validations/zodEnumListWithMessage';

// ============================================
// VALIDATEURS PERSONNALISÉS
// ============================================

const emailSchema = z
  .string()
  .email('Format d\'email invalide')
  .min(1, 'L\'email est requis')
  .transform((val) => val.toLowerCase().trim());

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un symbole (@$!%*?&)'
  );

const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Format de téléphone invalide (utilisez le format international: +237...)'
  )
  .optional()
  .or(z.literal(''));

// ============================================
// SCHÉMA: Créer un utilisateur
// ============================================

export const createUserSchema = z.object({
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  email: emailSchema,
  
  motDePasse: passwordSchema,
  
  role: zodEnumWithMessage(RoleUtilisateur, 'Rôle invalide'),
  statut: zodEnumWithMessage(StatutUtilisateur, 'Statut invalide')
  .optional()
  .default(StatutUtilisateur.ACTIF),

  telephone: phoneSchema,
  
  adresse: z.string().max(200).optional().or(z.literal('')),
  
  specialite: z.string().max(100).optional().or(z.literal('')),
  
  barreau: z.string().max(100).optional().or(z.literal('')),
  
  numeroPermis: z.string().max(50).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  // Validation conditionnelle pour les avocats
  if (data.role === RoleUtilisateur.AVOCAT) {
    if (!data.barreau || data.barreau.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['barreau'],
        message: 'Le barreau est requis pour les avocats',
      });
    }
    
    if (!data.numeroPermis || data.numeroPermis.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['numeroPermis'],
        message: 'Le numéro de permis est requis pour les avocats',
      });
    }
  }
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

// ============================================
// SCHÉMA: Mettre à jour un utilisateur
// ============================================

export const updateUserSchema = z.object({
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .optional(),
  
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  
  email: emailSchema.optional(),
  
  motDePasse: passwordSchema.optional(),
  
  role: zodEnumWithMessage(RoleUtilisateur, 'Rôle invalide')
    .optional(),
  
  statut: zodEnumWithMessage(StatutUtilisateur, 'Statut invalide')
    .optional(),
  
  telephone: phoneSchema,
  
  adresse: z.string().max(200).optional().or(z.literal('')),
  
  specialite: z.string().max(100).optional().or(z.literal('')),
  
  barreau: z.string().max(100).optional().or(z.literal('')),
  
  numeroPermis: z.string().max(50).optional().or(z.literal('')),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// ============================================
// SCHÉMA: Mettre à jour le profil
// ============================================

export const updateProfileSchema = z.object({
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .optional(),
  
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  
  email: emailSchema.optional(),
  
  telephone: phoneSchema,
  
  adresse: z.string().max(200).optional().or(z.literal('')),
  
  specialite: z.string().max(100).optional().or(z.literal('')),
  
  barreau: z.string().max(100).optional().or(z.literal('')),
  
  numeroPermis: z.string().max(50).optional().or(z.literal('')),
  
  // Changement de mot de passe (optionnel)
  ancienMotDePasse: z.string().optional(),
  
  nouveauMotDePasse: passwordSchema.optional(),
}).superRefine((data, ctx) => {
  // Si nouveauMotDePasse est fourni, ancienMotDePasse est requis
  if (data.nouveauMotDePasse && !data.ancienMotDePasse) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['ancienMotDePasse'],
      message: 'L\'ancien mot de passe est requis pour définir un nouveau mot de passe',
    });
  }
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// ============================================
// SCHÉMA: Changer le mot de passe
// ============================================

export const changePasswordSchema = z
  .object({
    ancienMotDePasse: z
      .string()
      .min(1, 'L\'ancien mot de passe est requis'),
    
    nouveauMotDePasse: passwordSchema,
    
    confirmationMotDePasse: z
      .string()
      .min(1, 'La confirmation du mot de passe est requise'),
  })
  .superRefine((data, ctx) => {
    // Vérifier que le nouveau mot de passe et la confirmation correspondent
    if (data.nouveauMotDePasse !== data.confirmationMotDePasse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmationMotDePasse'],
        message: 'Les mots de passe ne correspondent pas',
      });
    }
    
    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (data.ancienMotDePasse === data.nouveauMotDePasse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nouveauMotDePasse'],
        message: 'Le nouveau mot de passe doit être différent de l\'ancien',
      });
    }
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ============================================
// SCHÉMA: Changer le statut
// ============================================

export const changeStatusSchema = z.object({
  statut: zodEnumWithMessage(StatutUtilisateur, 'Statut invalide'),
  raison: z
    .string()
    .max(500, 'La raison ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
});

export type ChangeStatusFormData = z.infer<typeof changeStatusSchema>;

// ============================================
// SCHÉMA: Action en masse
// ============================================

export const bulkActionSchema = z
  .object({
    userIds: z
      .array(z.string().uuid('ID utilisateur invalide'))
      .min(1, 'Vous devez sélectionner au moins un utilisateur')
      .max(100, 'Vous ne pouvez pas sélectionner plus de 100 utilisateurs'),
    
    action: zodEnumListWithMessage(['changeRole', 'changeStatus', 'delete'], 'Action invalide'),
    
    role: zodEnumWithMessage(RoleUtilisateur, 'Rôle invalide')
      .optional(),
    
    statut: zodEnumWithMessage(StatutUtilisateur, 'Statut invalide')
      .optional(),
    
    raison: z
      .string()
      .max(500, 'La raison ne peut pas dépasser 500 caractères')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    // Valider que le rôle est fourni si l'action est changeRole
    if (data.action === 'changeRole' && !data.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['role'],
        message: 'Le rôle est requis pour cette action',
      });
    }
    
    // Valider que le statut est fourni si l'action est changeStatus
    if (data.action === 'changeStatus' && !data.statut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['statut'],
        message: 'Le statut est requis pour cette action',
      });
    }
  });

export type BulkActionFormData = z.infer<typeof bulkActionSchema>;

// ============================================
// SCHÉMA: Filtres de recherche
// ============================================

export const userFiltersSchema = z.object({
  role: z.nativeEnum(RoleUtilisateur).optional(),
  statut: z.nativeEnum(StatutUtilisateur).optional(),
  search: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),
  specialite: z.string().optional().or(z.literal('')),
  barreau: z.string().optional().or(z.literal('')),
});

export type UserFiltersFormData = z.infer<typeof userFiltersSchema>;

// ============================================
// SCHÉMA: Login
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  motDePasse: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// SCHÉMA: Inscription
// ============================================

export const registerSchema = z.object({
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  email: emailSchema,
  
  motDePasse: passwordSchema,
  
  confirmationMotDePasse: z.string().min(1, 'La confirmation est requise'),
}).superRefine((data, ctx) => {
  if (data.motDePasse !== data.confirmationMotDePasse) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmationMotDePasse'],
      message: 'Les mots de passe ne correspondent pas',
    });
  }
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================
// SCHÉMA: Mot de passe oublié
// ============================================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================
// SCHÉMA: Réinitialisation du mot de passe
// ============================================

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Le token est requis'),
    motDePasse: passwordSchema,
    confirmationMotDePasse: z.string().min(1, 'La confirmation est requise'),
  })
  .superRefine((data, ctx) => {
    if (data.motDePasse !== data.confirmationMotDePasse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmationMotDePasse'],
        message: 'Les mots de passe ne correspondent pas',
      });
    }
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================
// EXPORTS GROUPÉS
// ============================================

export const userSchemas = {
  create: createUserSchema,
  update: updateUserSchema,
  updateProfile: updateProfileSchema,
  changePassword: changePasswordSchema,
  changeStatus: changeStatusSchema,
  bulkAction: bulkActionSchema,
  filters: userFiltersSchema,
  login: loginSchema,
  register: registerSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
} as const;