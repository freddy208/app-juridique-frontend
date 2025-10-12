// ============================================
// 3. ModulesSection.tsx
// ============================================
"use client";
import { motion } from "framer-motion";
import React from "react";
import { Users, FileText, Calendar, TrendingUp } from "lucide-react";

const modules = [
  {
    icon: Users,
    title: "Gestion des clients",
    description: "Centralisez tous vos clients et leurs informations"
  },
  {
    icon: FileText,
    title: "Dossiers & Documents",
    description: "Organisez et archivez en toute sécurité"
  },
  {
    icon: Calendar,
    title: "Agenda & Audiences",
    description: "Ne manquez plus aucune échéance"
  },
  {
    icon: TrendingUp,
    title: "Suivi financier",
    description: "Pilotez votre activité en temps réel"
  }
];

export default function ModulesSection() {
  return (
    <section id="fonctionnalites" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Des outils puissants et intuitifs pour gérer votre cabinet avec excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {modules.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="text-amber-700 dark:text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

