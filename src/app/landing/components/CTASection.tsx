// ============================================
// 4. CTASection.tsx
// ============================================
"use client";
import { motion } from "framer-motion";
import React from "react";
import { Scale } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.2) 35px, rgba(255,255,255,.1) 60px)'
        }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Scale className="w-16 h-16 text-amber-200 mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Rejoignez l&apos;élite juridique camerounaise
            </h2>
            <p className="text-xl text-amber-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Transformez votre pratique du droit avec des outils modernes qui respectent votre tradition d&apos;excellence
            </p>
            <a
              href="auth/login"
              className="inline-block bg-white text-amber-900 px-12 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl hover:bg-amber-50 transition-all duration-300 hover:scale-105"
            >
              Accéder à mon espace
            </a>
            <p className="text-amber-200 text-sm mt-6">
              Aucune carte bancaire requise · Configuration en 5 minutes
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

