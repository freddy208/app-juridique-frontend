// src/components/ProtectedRoute.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log('🔒 ProtectedRoute - Vérification:', { 
      isLoading, 
      isAuthenticated,
      hasRedirected: hasRedirected.current 
    });
    
    // ✅ Rediriger vers login si non authentifié
    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log('🔴 Utilisateur non authentifié - Redirection vers /login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // ✅ Afficher le loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // ✅ Ne rien afficher si non authentifié (évite le flash de contenu)
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Afficher le contenu protégé si authentifié
  return <>{children}</>;
}