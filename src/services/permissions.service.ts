/**
 * Service API pour les permissions
 * Gère la communication avec le backend NestJS
 */

import {
  RoleUtilisateur,
  Permission,
  PermissionsResponse,
  PermissionsMatrix,
  Module,
} from "../types/permissions.type";
import { DEFAULT_PERMISSIONS } from "../constants/permissions";

// Mode mock (à changer via .env)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// URL de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Récupère les permissions d'un rôle depuis l'API
 */
export const getPermissionsByRole = async (
  role: RoleUtilisateur,
  token?: string
): Promise<PermissionsMatrix> => {
  // MODE MOCK - Retourne les permissions par défaut
  if (USE_MOCK) {
    console.log(`[MOCK] Chargement permissions pour rôle: ${role}`);
    
    // Simule un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return DEFAULT_PERMISSIONS[role] || {};
  }

  // MODE API - Appel réel au backend
  try {
    const response = await fetch(`${API_URL}/api/v1/permissions/${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data: PermissionsResponse = await response.json();
    
    // Convertit les permissions API en matrice
    return convertPermissionsToMatrix(data.permissions);
  } catch (error) {
    console.error("Erreur lors du chargement des permissions:", error);
    
    // Fallback sur permissions par défaut
    console.warn(`Fallback sur permissions par défaut pour ${role}`);
    return DEFAULT_PERMISSIONS[role] || {};
  }
};

/**
 * Convertit un tableau de permissions API en matrice utilisable
 */
const convertPermissionsToMatrix = (
  permissions: Permission[]
): PermissionsMatrix => {
  const matrix: PermissionsMatrix = {};

  permissions.forEach((perm) => {
    if (perm.statut === "ACTIF") {
      matrix[perm.module] = {
        lecture: perm.lecture,
        ecriture: perm.ecriture,
        suppression: perm.suppression,
      };
    }
  });

  return matrix;
};

/**
 * Met à jour une permission (admin uniquement)
 */
export const updatePermission = async (
  role: RoleUtilisateur,
  module: string,
  permissions: { lecture: boolean; ecriture: boolean; suppression: boolean },
  token: string
): Promise<void> => {
  if (USE_MOCK) {
    console.log(`[MOCK] Mise à jour permission ${role}/${module}`, permissions);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }

  const response = await fetch(
    `${API_URL}/api/v1/permissions/${role}/${module}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(permissions),
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour des permissions");
  }
};

/**
 * Récupère toutes les permissions (pour la matrice admin)
 */
export const getAllPermissions = async (
  token: string
): Promise<PermissionsResponse[]> => {
  if (USE_MOCK) {
    console.log("[MOCK] Chargement de toutes les permissions");
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Génère des permissions mockées pour tous les rôles
    const roles: RoleUtilisateur[] = [
      "ADMIN",
      "DG",
      "AVOCAT",
      "SECRETAIRE",
      "JURISTE",
      "ASSISTANT",
      "STAGIAIRE",
    ];

    return roles.map((role) => ({
      role,
      permissions: convertMatrixToPermissions(DEFAULT_PERMISSIONS[role], role),
    }));
  }

  const response = await fetch(`${API_URL}/api/v1/permissions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des permissions");
  }

  return response.json();
};

/**
 * Convertit une matrice en tableau de permissions (pour l'API)
 */
const convertMatrixToPermissions = (
  matrix: PermissionsMatrix,
  role: RoleUtilisateur
): Permission[] => {
  return Object.entries(matrix).map(([module, perms]) => ({
    id: `mock-${role}-${module}`,
    role,
    module: module as Module, // ✅ remplacement du "as any"
    lecture: perms?.lecture ?? false,
    ecriture: perms?.ecriture ?? false,
    suppression: perms?.suppression ?? false,
    statut: "ACTIF" as const,
    creeLe: new Date().toISOString(),
    modifieLe: new Date().toISOString(),
  }));
};


/**
 * Initialise les permissions par défaut (seed)
 * Admin uniquement - à appeler une seule fois
 */
export const seedPermissions = async (token: string): Promise<void> => {
  if (USE_MOCK) {
    console.log("[MOCK] Seed permissions (simulation)");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }

  const response = await fetch(`${API_URL}/api/v1/permissions/seed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'initialisation des permissions");
  }
};