import { z } from 'zod';

/**
 * Crée un schéma Zod basé sur une liste de valeurs (enum-like)
 * avec un message d'erreur personnalisé.
 *
 * Exemple : zodEnumListWithMessage(['create', 'update'], 'Action invalide')
 */
export function zodEnumListWithMessage<T extends [string, ...string[]]>(
  values: T,
  message: string
) {
  return z.enum(values).refine((val) => values.includes(val), { message });
}
