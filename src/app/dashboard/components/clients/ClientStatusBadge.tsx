import { CheckCircle2, XCircle } from "lucide-react";
import { StatutClient } from "@/types/client.types";

interface ClientStatusBadgeProps {
  statut: StatutClient;
  size?: "sm" | "md" | "lg";
}

export default function ClientStatusBadge({ statut, size = "md" }: ClientStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${
      statut === "ACTIF"
        ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
        : "bg-slate-100 text-slate-700 ring-1 ring-slate-600/20"
    }`}>
      {statut === "ACTIF" ? (
        <CheckCircle2 className={iconSizes[size]} />
      ) : (
        <XCircle className={iconSizes[size]} />
      )}
      {statut}
    </span>
  );
}