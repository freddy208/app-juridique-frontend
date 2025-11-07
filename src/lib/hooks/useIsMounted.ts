// src/hooks/useIsMounted.ts
import { useRef, useEffect } from 'react';

/**
 * Un hook qui retourne une fonction pour vérifier si le composant est toujours monté.
 * C'est utile pour les opérations asynchrones qui pourraient se terminer après le démontage du composant.
 */
export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return () => isMounted.current;
}