// ============================================
// 5. Footer.tsx
// ============================================
import React from "react";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Scale className="w-6 h-6 text-amber-700" strokeWidth={2.5} />
            <span className="font-serif font-bold text-gray-900 dark:text-gray-100">
              Cabinet Juridique 237
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="font-medium">KPF Services</span> · Tous droits réservés © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}