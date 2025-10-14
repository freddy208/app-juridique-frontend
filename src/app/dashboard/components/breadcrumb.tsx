// ============================================
// 4. Breadcrumb.tsx - Fil d'Ariane
// ============================================
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Générer les segments du breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  
  // Mapping des segments vers des labels lisibles
  const labelMap: Record<string, string> = {
    dashboard: "Tableau de bord",
    dossiers: "Dossiers",
    clients: "Clients",
    documents: "Documents",
    taches: "Tâches",
    calendrier: "Calendrier",
    chat: "Messages",
    factures: "Factures",
    equipe: "Équipe",
    rapports: "Rapports",
    parametres: "Paramètres",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        href="/dashboard"
        className="text-gray-500 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = labelMap[segment] || segment;

        return (
          <div key={segment} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-gray-500 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-600 transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}