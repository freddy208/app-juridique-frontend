"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context/AuthProvider";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ModulesSection from "./components/ModulesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirection automatique si user est connecté
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // Afficher le loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si user est connecté, ne rien afficher (redirection en cours)
  if (user) {
    return null;
  }

  return (
    <main className="bg-white dark:bg-gray-900 overflow-hidden">
      <HeroSection />
      <AboutSection />
      <ModulesSection />
      <CTASection />
      <Footer />
    </main>
  );
}