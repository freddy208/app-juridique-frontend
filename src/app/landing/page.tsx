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

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await refreshAccessToken(); // tente de restaurer la session
      }
      if (user) {
        router.replace("/dashboard"); // redirige si connecté
      } else {
        setIsCheckingAuth(false); // sinon, on affiche la LandingPage
      }
    };
    checkAuth();
  }, [user, router, refreshAccessToken]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ); // loader simple
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
