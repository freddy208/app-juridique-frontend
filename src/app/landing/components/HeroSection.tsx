// ============================================
// 1. HeroSection.tsx
// ============================================
"use client";
import { motion } from "framer-motion";
import React from "react";
import {  Award } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Motif subtil en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("./background3.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge prestige */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 px-4 py-2 rounded-full mb-8"
          >
            <Award className="w-3 h-3 text-amber-700" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Solution juridique d&apos;excellence pour le Cameroun
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6"
          >
            L&apos;excellence juridique
            <span className="block mt-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">
              à portée de main
            </span>
          </motion.h1>

          {/* Sous-titre élégant */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-md md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Une plateforme de gestion conçue pour les professionnels du droit camerounais. 
            Dignes de votre expertise, à la hauteur de vos ambitions.
          </motion.p>

          {/* CTA principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="auth/login"
              className="group relative bg-gradient-to-r from-amber-700 to-amber-800 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Démarrer maintenant</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-amber-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <a
              href="#fonctionnalites"
              className="px-10 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-700 hover:text-amber-700 dark:hover:border-amber-600 dark:hover:text-amber-600 transition-all duration-300"
            >
              Découvrir
            </a>
          </motion.div>

          {/* Stats de confiance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "100%", label: "Sécurisé" },
              { value: "24/7", label: "Disponible" },
              { value: "CMR", label: "Conforme" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-600 font-serif">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}