// protected/dashboard/components/tables/TachesTable.tsx
"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "../../../../../components/ui/Button"
import { motion } from "framer-motion"
import { CheckCircle, Clock, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { cardVariants } from "../../utils/animations"
import { Tache } from "../../../../../lib/types/dashboard.types"

interface TachesTableProps {
  title: string
  data: Tache[]
  isLoading?: boolean
}

export function TachesTable({
  title,
  data,
  isLoading = false,
}: TachesTableProps) {
  const [selectedTache, setSelectedTache] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "A_FAIRE":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            À faire
          </Badge>
        )
      case "EN_COURS":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        )
      case "TERMINE":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) {
      return <Badge className="bg-red-100 text-red-800">Haute</Badge>
    } else if (priority >= 5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">Basse</Badge>
    }
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
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tâche</TableHead>
                <TableHead>Dossier</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tache) => (
                <TableRow
                  key={tache.id}
                  className={selectedTache === tache.id ? "bg-gray-50" : ""}
                  onClick={() => setSelectedTache(tache.id)}
                >
                  <TableCell className="font-medium">{tache.titre}</TableCell>
                  <TableCell>
                    {tache.dossier ? (
                      <span className="text-sm">
                        {tache.dossier.numeroUnique}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(tache.statut)}</TableCell>
                  <TableCell>{getPriorityBadge(tache.priorite)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Marquer comme terminée</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  )
}