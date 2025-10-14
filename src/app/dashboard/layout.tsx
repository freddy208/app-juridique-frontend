"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context/AuthProvider";
import DashboardLayout from "../dashboard/components/layout/dashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // ⚡ PROTECTION : Redirection si pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Loading state pendant vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Utilisateur connecté : afficher le layout avec sidebar + topbar
  return <DashboardLayout>{children}</DashboardLayout>;
}