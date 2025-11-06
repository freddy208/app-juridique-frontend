import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Créer un client de requête pour les honoraires
const createHonoraireQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface HonoraireQueryProviderProps {
  children: ReactNode;
}

export const HonoraireQueryProvider = ({ children }: HonoraireQueryProviderProps) => {
  const honoraireQueryClient = createHonoraireQueryClient();
  
  return (
    <QueryClientProvider client={honoraireQueryClient}>
      {children}
    </QueryClientProvider>
  );
};