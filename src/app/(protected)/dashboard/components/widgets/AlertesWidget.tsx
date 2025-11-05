// protected/dashboard/components/widgets/AlertesWidget.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cardVariants } from "../../utils/animations"
import { Alerte } from "../../../../../lib/types/dashboard.types"

interface AlertesWidgetProps {
  title: string
  data: Alerte[]
  isLoading?: boolean
}

export function AlertesWidget({
  title,
  data,
  isLoading = false,
}: AlertesWidgetProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const handleDismiss = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id])
  }

  const getAlertIcon = (priorite: number) => {
    if (priorite >= 8) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    } else if (priorite >= 5) {
      return <Info className="h-5 w-5 text-yellow-500" />
    } else {
      return <CheckCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertBadge = (priorite: number) => {
    if (priorite >= 8) {
      return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
    } else if (priorite >= 5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Important</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
    }
  }

  const filteredAlerts = data.filter(
    (alerte) => !dismissedAlerts.includes(alerte.id)
  )

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Aucune alerte</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alerte) => (
            <motion.div
              key={alerte.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alerte.priorite)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {alerte.message}
                  </p>
                  <button
                    onClick={() => handleDismiss(alerte.id)}
                    className="ml-2 flex-shrink-0 p-1 rounded-full hover:bg-gray-200"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  {getAlertBadge(alerte.priorite)}
                  <p className="text-xs text-gray-500">
                    {new Date(alerte.creeLe).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}