import { Crown } from "lucide-react";

interface ClientVIPBadgeProps {
  size?: "sm" | "md" | "lg";
}

export default function ClientVIPBadge({ size = "md" }: ClientVIPBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={`bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center gap-1.5 shadow-lg ${sizeClasses[size]}`}>
      <Crown className={`text-white ${iconSizes[size]}`} />
      <span className="text-white font-bold">VIP</span>
    </div>
  );
}