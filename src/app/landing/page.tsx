"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context/AuthProvider";

import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ModulesSection from "./components/ModulesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
  const router = useRouter();
  const { user, refreshAccessToken } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      await refreshAccessToken();
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [refreshAccessToken]);

  // Redirection automatique si user est défini
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
