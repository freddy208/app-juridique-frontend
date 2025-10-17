"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context/AuthProvider";
import { useSidebar } from "@/hooks/useSidebar";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { isCollapsed, toggle } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggle}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setIsMobileOpen(true)} />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}