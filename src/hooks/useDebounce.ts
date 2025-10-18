/**
 * Hook useDebounce
 * Optimise les recherches et évite les appels API excessifs
 */

import { useState, useEffect } from 'react';

/**
 * Debounce une valeur
 * Utile pour les champs de recherche
 * 
 * @param value - Valeur à debouncer
 * @param delay - Délai en ms (défaut: 500ms)
 * @returns Valeur debouncée
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * // Utiliser debouncedSearch dans votre query
 * const { data } = useClients({ search: debouncedSearch });
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Créer un timer qui met à jour la valeur après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si value change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}