// protected/dashboard/components/kpi/KpiCard.tsx
"use client"

import { motion } from "framer-motion"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { cardVariants } from "../../utils/animations"

interface KpiCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon: LucideIcon
  color: string
  isLoading?: boolean
}

export function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  isLoading = false,
}: KpiCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 rounded mt-2 animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              {change.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  change.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg",
            color === "blue" && "bg-blue-100",
            color === "green" && "bg-green-100",
            color === "red" && "bg-red-100",
            color === "yellow" && "bg-yellow-100",
            color === "purple" && "bg-purple-100"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              color === "blue" && "text-blue-600",
              color === "green" && "text-green-600",
              color === "red" && "text-red-600",
              color === "yellow" && "text-yellow-600",
              color === "purple" && "text-purple-600"
            )}
          />
        </div>
      </div>
    </motion.div>
  )
}