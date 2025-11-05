// protected/dashboard/components/tables/DossiersTable.tsx
"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/Table"
import { Badge } from "../../../../../components/ui/Badge"
import { Button } from "../../../../../components/ui/Button"
import { motion } from "framer-motion"
import { Eye, Edit, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/ui/DropdownMenu"
import { cardVariants } from "../../utils/animations"
import { Dossier } from "../../../../../lib/types/dashboard.types"

interface DossiersTableProps {
  title: string
  data: Dossier[]
  isLoading?: boolean
}

export function DossiersTable({
  title,
  data,
  isLoading = false,
}: DossiersTableProps) {
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIF":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "EN_ATTENTE":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "TERMINE":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "SUSPENDU":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
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
                <TableHead>N° dossier</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière modification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((dossier) => (
                <TableRow
                  key={dossier.id}
                  className={selectedDossier === dossier.id ? "bg-gray-50" : ""}
                  onClick={() => setSelectedDossier(dossier.id)}
                >
                  <TableCell className="font-medium">
                    {dossier.numeroUnique}
                  </TableCell>
                  <TableCell>{dossier.titre}</TableCell>
                  <TableCell>
                    {dossier.client.prenom} {dossier.client.nom}
                  </TableCell>
                  <TableCell>{getStatusBadge(dossier.statut)}</TableCell>
                  <TableCell>
                    {new Date(dossier.modifieLe).toLocaleDateString()}
                  </TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
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