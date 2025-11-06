/**
 * Constantes pour le module Tâches
 */

import { StatutTache, TachePriorite } from  "../types/tache.types"

// Options pour les statuts de tâche
export const STATUT_TACHE_OPTIONS = [
  { value: StatutTache.A_FAIRE, label: "À faire", color: "bg-gray-100 text-gray-800" },
  { value: StatutTache.EN_COURS, label: "En cours", color: "bg-blue-100 text-blue-800" },
  { value: StatutTache.TERMINEE, label: "Terminée", color: "bg-green-100 text-green-800" },
] as const

// Options pour les priorités de tâche
export const PRIORITE_TACHE_OPTIONS = [
  { value: TachePriorite.BASSE, label: "Basse", color: "bg-gray-100 text-gray-800", icon: "↓" },
  { value: TachePriorite.MOYENNE, label: "Moyenne", color: "bg-yellow-100 text-yellow-800", icon: "→" },
  { value: TachePriorite.HAUTE, label: "Haute", color: "bg-orange-100 text-orange-800", icon: "↑" },
  { value: TachePriorite.URGENTE, label: "Urgente", color: "bg-red-100 text-red-800", icon: "!" },
] as const

// Options de tri
export const TRI_TACHE_OPTIONS = [
  { value: "creeLe", label: "Date de création" },
  { value: "dateLimite", label: "Date limite" },
  { value: "titre", label: "Titre" },
  { value: "priorite", label: "Priorité" },
  { value: "statut", label: "Statut" },
] as const

// Options d'ordre de tri
export const ORDRE_TRI_OPTIONS = [
  { value: "asc", label: "Croissant" },
  { value: "desc", label: "Décroissant" },
] as const

// Options de pagination
export const PAGINATION_OPTIONS = [
  { value: 5, label: "5 par page" },
  { value: 10, label: "10 par page" },
  { value: 20, label: "20 par page" },
  { value: 50, label: "50 par page" },
] as const

// Options pour les jours d'échéance proche
export const JOURS_ECHEANCE_OPTIONS = [
  { value: 1, label: "Aujourd'hui" },
  { value: 3, label: "3 jours" },
  { value: 7, label: "1 semaine" },
  { value: 14, label: "2 semaines" },
  { value: 30, label: "1 mois" },
] as const

// Fonctions utilitaires
export const getStatutTacheLabel = (statut: StatutTache) => {
  return STATUT_TACHE_OPTIONS.find(option => option.value === statut)?.label || statut
}

export const getStatutTacheColor = (statut: StatutTache) => {
  return STATUT_TACHE_OPTIONS.find(option => option.value === statut)?.color || "bg-gray-100 text-gray-800"
}

export const getPrioriteTacheLabel = (priorite: TachePriorite) => {
  return PRIORITE_TACHE_OPTIONS.find(option => option.value === priorite)?.label || priorite
}

export const getPrioriteTacheColor = (priorite: TachePriorite) => {
  return PRIORITE_TACHE_OPTIONS.find(option => option.value === priorite)?.color || "bg-gray-100 text-gray-800"
}

export const getPrioriteTacheIcon = (priorite: TachePriorite) => {
  return PRIORITE_TACHE_OPTIONS.find(option => option.value === priorite)?.icon || ""
}