// protected/dashboard/components/widgets/EvenementsWidget.tsx
"use client"

import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cardVariants } from "../../utils/animations"
import { EvenementCalendrier } from "../../../../../lib/types/dashboard.types"

interface EvenementsWidgetProps {
  title: string
  data: EvenementCalendrier[]
  isLoading?: boolean
}

export function EvenementsWidget({
  title,
  data,
  isLoading = false,
}: EvenementsWidgetProps) {
  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain"
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Aucun événement à venir</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((evenement) => (
            <motion.div
              key={evenement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-royal-blue-100 text-royal-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {evenement.titre}
                </p>
                <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(new Date(evenement.debut))}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(new Date(evenement.debut))}
                  </div>
                </div>
                <div className="mt-1">
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {evenement.statut}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}