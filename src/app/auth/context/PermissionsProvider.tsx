"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import {
  Module,
  PermissionsMatrix,
  PermissionsContextType,
} from "../types/permissions.type";
import { getPermissionsByRole } from "../services/permissions.service";
import { MINIMAL_PERMISSIONS } from "../constants/permissions";
import { RoleUtilisateur } from "../types/permissions.type";

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<PermissionsMatrix>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les permissions depuis l'API
   */
  const loadPermissions = useCallback(async () => {
    if (!user || !user.role) {
      setPermissions({});
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Récupère les permissions du rôle
      const validRoles: RoleUtilisateur[] = [
        "ADMIN", "DG", "AVOCAT", "SECRETAIRE", "ASSISTANT", "JURISTE", "STAGIAIRE",
        ];

        const isValidRole = (role: string): role is RoleUtilisateur =>
        validRoles.includes(role as RoleUtilisateur);

        // Puis dans le code :
        if (!user?.role || !isValidRole(user.role)) {
        console.warn("⚠️ Rôle utilisateur inconnu, fallback sur permissions minimales");
        setPermissions(MINIMAL_PERMISSIONS);
        setIsLoading(false);
        return;
        }

     const perms = await getPermissionsByRole(user.role, accessToken || undefined);
      
      setPermissions(perms);
      console.log(`✅ Permissions chargées pour ${user.role}:`, perms);
    } catch (err) {
      console.error("❌ Erreur chargement permissions:", err);
      setError("Erreur lors du chargement des permissions");
      
      // Fallback sur permissions minimales en cas d'erreur
      setPermissions(MINIMAL_PERMISSIONS);
    } finally {
      setIsLoading(false);
    }
  }, [user, accessToken]);

  /**
   * Charge les permissions au montage et quand le user change
   */
  useEffect(() => {
    if (!authLoading) {
      loadPermissions();
    }
  }, [authLoading, loadPermissions]);

  /**
   * Vérifie si le user a accès à un module (lecture minimum)
   */
  const hasAccess = useCallback(
    (module: Module): boolean => {
      return permissions[module]?.lecture ?? false;
    },
    [permissions]
  );

  /**
   * Vérifie si le user peut lire un module
   */
  const canRead = useCallback(
    (module: Module): boolean => {
      return permissions[module]?.lecture ?? false;
    },
    [permissions]
  );

  /**
   * Vérifie si le user peut écrire (créer/modifier) dans un module
   */
  const canWrite = useCallback(
    (module: Module): boolean => {
      return permissions[module]?.ecriture ?? false;
    },
    [permissions]
  );

  /**
   * Vérifie si le user peut supprimer dans un module
   */
  const canDelete = useCallback(
    (module: Module): boolean => {
      return permissions[module]?.suppression ?? false;
    },
    [permissions]
  );

  /**
   * Rafraîchit les permissions (utile après modification admin)
   */
  const refreshPermissions = useCallback(async () => {
    await loadPermissions();
  }, [loadPermissions]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        isLoading,
        error,
        hasAccess,
        canRead,
        canWrite,
        canDelete,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook pour utiliser les permissions
 * @throws Error si utilisé hors du PermissionsProvider
 */
export function usePermissionsContext() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissionsContext doit être utilisé dans PermissionsProvider");
  }
  return context;
}