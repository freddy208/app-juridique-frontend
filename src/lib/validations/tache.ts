/**
 * Schémas de validation pour le module Tâches
 * Utilise Zod pour la validation côté client
 */

import { z } from "zod"
import { StatutTache, TachePriorite } from "../types/tache.types" // Correction du chemin d'import pour correspondre à votre fichier

// Schéma pour la création d'une tâche
export const createTacheSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(255, "Le titre ne peut pas dépasser 255 caractères"),
  description: z.string().optional(),
  dossierId: z.string().uuid("ID de dossier invalide").optional().or(z.literal("")),
  assigneeId: z.string().uuid("ID d'utilisateur invalide").optional().or(z.literal("")),
  priorite: z.nativeEnum(TachePriorite).optional(),
  dateLimite: z.coerce.date().optional(),
})

// Schéma pour la mise à jour d'une tâche
export const updateTacheSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(255, "Le titre ne peut pas dépasser 255 caractères").optional(),
  description: z.string().optional(),
  assigneeId: z.string().uuid("ID d'utilisateur invalide").optional().or(z.literal("")),
  priorite: z.nativeEnum(TachePriorite).optional(),
  statut: z.nativeEnum(StatutTache).optional(),
  dateLimite: z.coerce.date().optional(),
})

// Schéma pour le changement de statut
export const changerStatutSchema = z.object({
  // CORRECTION : On valide une chaîne, on vérifie qu'elle est dans l'énumération, puis on la transforme.
  statut: z
    .string()
    .refine((val) => Object.values(StatutTache).includes(val as StatutTache), {
      message: "Veuillez sélectionner un statut valide",
    })
    .transform((val) => val as StatutTache),
})

// Schéma pour l'assignation de tâche
export const assignerTacheSchema = z.object({
  assigneeId: z.string().uuid("ID d'utilisateur invalide").min(1, "Veuillez sélectionner un utilisateur"),
})

// Schéma pour la recherche de tâches
export const searchTacheSchema = z.object({
  searchTerm: z.string().min(1, "Veuillez entrer un terme de recherche"),
})

// Schéma pour les filtres de tâches
export const filterTacheSchema = z.object({
  statut: z.nativeEnum(StatutTache).optional(),
  priorite: z.nativeEnum(TachePriorite).optional(),
  assigneeId: z.string().uuid().optional().or(z.literal("")),
  creeParId: z.string().uuid().optional().or(z.literal("")),
  dossierId: z.string().uuid().optional().or(z.literal("")),
  dateLimiteMin: z.coerce.date().optional(),
  dateLimiteMax: z.coerce.date().optional(),
  enRetard: z.boolean().optional(),
})

// Types inférés des schémas
export type CreateTacheForm = z.infer<typeof createTacheSchema>
export type UpdateTacheForm = z.infer<typeof updateTacheSchema>
export type ChangerStatutForm = z.infer<typeof changerStatutSchema>
export type AssignerTacheForm = z.infer<typeof assignerTacheSchema>
export type SearchTacheForm = z.infer<typeof searchTacheSchema>
export type FilterTacheForm = z.infer<typeof filterTacheSchema>