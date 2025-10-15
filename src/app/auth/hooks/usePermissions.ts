/**
 * Hook simplifié pour vérifier les permissions sur un module spécifique
 * Utilisation: const { canRead, canWrite, canDelete, hasAccess } = usePermissions('dossiers');
 */

import { useMemo } from "react";
import { usePermissionsContext } from "@/app/auth/context/PermissionsProvider";
import { Module } from "../types/permissions.type";

interface UsePermissionsReturn {
  hasAccess: boolean;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canEdit: boolean;
  isLoading: boolean;
}

/**
 * Hook pour vérifier les permissions sur un module spécifique
 */
export function usePermissions(module: Module): UsePermissionsReturn {
  const context = usePermissionsContext();

  return useMemo(() => {
      const hasAccess = context.hasAccess(module);
      const canRead = context.canRead(module);
      const canWrite = context.canWrite(module);
      const canDelete = context.canDelete(module);
  
      return {
        hasAccess,
        canRead,
        canWrite,
        canDelete,
        canCreate: canWrite,
        canUpdate: canWrite,
        canEdit: canWrite,
        isLoading: context.isLoading,
      };
    }, [module, context]);
}

/**
 * Hook pour vérifier plusieurs modules à la fois
 */
export function useMultiplePermissions(
  modules: Module[]
): Record<Module, UsePermissionsReturn> {
  const context = usePermissionsContext();

  return useMemo(() => {
    const result: Record<Module, UsePermissionsReturn> = {} as Record<
      Module,
      UsePermissionsReturn
    >;

    modules.forEach((module) => {
      const hasAccess = context.hasAccess(module);
      const canRead = context.canRead(module);
      const canWrite = context.canWrite(module);
      const canDelete = context.canDelete(module);

      result[module] = {
        hasAccess,
        canRead,
        canWrite,
        canDelete,
        canCreate: canWrite,
        canUpdate: canWrite,
        canEdit: canWrite,
        isLoading: context.isLoading,
      };
    });

    return result;
  }, [modules, context]);
}


export function useIsAdmin(): boolean {
  const { permissions } = usePermissionsContext();
  
  return useMemo(() => {
    return (
      permissions.permissions?.ecriture === true ||
      permissions.utilisateurs?.suppression === true
    );
  }, [permissions]);
}

/**
 * Hook pour obtenir toutes les permissions (pour debugging)
 */
export function useAllPermissions() {
  return usePermissionsContext();
}