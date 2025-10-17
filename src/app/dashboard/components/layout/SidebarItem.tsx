/**
 * Composant d'item de navigation de la sidebar
 */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isCollapsed: boolean;
  badge?: string | number;
  description?: string;
}

export default function SidebarItem({
  label,
  href,
  icon: Icon,
  isCollapsed,
  badge,
  description,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "hover:bg-amber-50 dark:hover:bg-amber-950/20",
        isActive
          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100"
          : "text-gray-700 dark:text-gray-300 hover:text-amber-900 dark:hover:text-amber-100",
        isCollapsed && "justify-center px-2"
      )}
      title={isCollapsed ? label : undefined}
    >
      {/* Icône */}
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors",
          isActive
            ? "text-amber-700 dark:text-amber-400"
            : "text-gray-500 dark:text-gray-400 group-hover:text-amber-700 dark:group-hover:text-amber-400"
        )}
      />

      {/* Label + Badge */}
      {!isCollapsed && (
        <div className="flex flex-1 items-center justify-between overflow-hidden">
          <span className="truncate">{label}</span>
          {badge && (
            <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 dark:bg-amber-700 px-1.5 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Badge pour mode collapsed */}
      {isCollapsed && badge && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 dark:bg-amber-700 text-[10px] font-bold text-white">
          {typeof badge === "number" && badge > 9 ? "9+" : badge}
        </span>
      )}

      {/* Tooltip en mode collapsed */}
      {isCollapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 dark:bg-gray-800 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          <div className="font-semibold">{label}</div>
          {description && (
            <div className="mt-0.5 text-xs text-gray-300">{description}</div>
          )}
          {/* Flèche */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
        </div>
      )}
    </Link>
  );
}