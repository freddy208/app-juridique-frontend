/**
 * ============================================
 * DASHBOARD LAYOUT
 * ============================================
 * Layout global pour toutes les pages du dashboard
 * Intègre AuthProvider, React Query et protection d'accès
 */

'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { useRequireAuth } from '@/lib/hooks/useAuth';

// ============================================
// REACT QUERY CLIENT
// ============================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ============================================
// COMPOSANT DE PROTECTION
// ============================================

const ProtectedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useRequireAuth('/login');

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4169e1] border-r-transparent mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// ============================================
// LAYOUT PRINCIPAL
// ============================================

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedContent>{children}</ProtectedContent>
      </AuthProvider>
    </QueryClientProvider>
  );
}