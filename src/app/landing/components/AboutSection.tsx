"use client";
import { motion } from "framer-motion";
import React from "react";
import { Shield, Clock, Award } from "lucide-react";

const valeurs = [
  {
    icon: Shield,
    title: "Sécurité absolue",
    description: "Vos dossiers et données clients protégés selon les plus hauts standards de confidentialité juridique"
  },
  {
    icon: Clock,
    title: "Gain de temps précieux",
    description: "Automatisez les tâches administratives pour vous concentrer sur votre expertise juridique"
  },
  {
    icon: Award,
    title: "Image professionnelle",
    description: "Impressionnez vos clients avec une gestion moderne et transparente de leurs affaires"
  }
];

export default function AboutSection() {
  return (
    <section id="apropos" className="py-24 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Votre partenaire de confiance
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Une solution pensée avec et pour les avocats camerounais
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {valeurs.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-amber-700 dark:text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

