/**
 * Composant de section de la sidebar
 */

"use client";
//import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  label: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

export default function SidebarSection({
  label,
  isCollapsed,
  children,
}: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {/* Label de section */}
      {!isCollapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </h3>
      )}

      {/* Séparateur en mode collapsed */}
      {isCollapsed && (
        <div className="mb-3 mx-auto h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
      )}

      {/* Items */}
      <div className="space-y-1">{children}</div>
    </div>
  );
}