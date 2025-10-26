"use client"

import { useState } from "react"
import { useClients } from "@/lib/hooks/useClients"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { StatutClient, TypeClient, STATUT_LABELS, TYPE_CLIENT_LABELS, statusBadges } from "@/lib/types/client.types"
import { exportClientsToExcel } from "@/lib/utils/export-excel"
import { toast } from "sonner"
import Link from "next/link"

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [statutFilter, setStatutFilter] = useState<StatutClient | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<TypeClient | "ALL">("ALL")
  const [vipOnly, setVipOnly] = useState(false)

  const filters = {
    search: search || undefined,
    statut: statutFilter !== "ALL" ? statutFilter : undefined,
    typeClient: typeFilter !== "ALL" ? typeFilter : undefined,
    vipOnly: vipOnly || undefined,
  }

  const { clients, total, page, totalPages, isLoading, error, deleteClient, getGlobalStats } = useClients({
    page: 1,
    limit: 50,
    filters,
  })

  const [stats, setStats] = useState<{
    total: number
    actifs: number
    inactifs: number
    prospects: number
    vip: number
  } | null>(null)

  // Load stats on mount
  useState(() => {
    getGlobalStats()
      .then((data) => {
        setStats(data)
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des statistiques")
      })
  })

  const handleExport = () => {
    exportClientsToExcel(clients, "clients")
    toast.success("Export réussi", {
      description: `${clients.length} clients exportés avec succès`,
    })
  }

  const handleDelete = async (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir archiver le client ${nom} ?`)) {
      try {
        await deleteClient(id)
        toast.success("Client archivé", {
          description: "Le client a été archivé avec succès",
        })
      } catch {
        toast.error("Erreur", {
          description: "Impossible d'archiver le client",
        })
      }
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>Une erreur est survenue lors du chargement des clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Gestion des Clients</h1>
          <p className="text-pretty text-muted-foreground">Gérez vos clients et suivez leur activité juridique</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={clients.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
          <Link href="/clients/nouveau">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total Clients
              <Users className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.total || total}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-success" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.actifs || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.actifs ? Math.round((stats.actifs / stats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.prospects || 0}</div>
            <p className="text-xs text-muted-foreground">En cours de conversion</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.inactifs || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="mr-1 inline h-3 w-3 text-warning" />
              Nécessite suivi
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gold">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Clients VIP
              <Star className="h-4 w-4 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.vip || 0}</div>
            <p className="text-xs text-muted-foreground">Priorité maximale</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statutFilter} onValueChange={(value) => setStatutFilter(value as StatutClient | "ALL")}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                {Object.values(StatutClient).map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {STATUT_LABELS[statut]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeClient | "ALL")}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les types</SelectItem>
                {Object.values(TypeClient).map((type) => (
                  <SelectItem key={type} value={type}>
                    {TYPE_CLIENT_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant={vipOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setVipOnly(!vipOnly)}
              className="gap-2"
            >
              <Star className={`h-4 w-4 ${vipOnly ? "fill-current" : ""}`} />
              VIP uniquement
            </Button>
            {(search || statutFilter !== "ALL" || typeFilter !== "ALL" || vipOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setStatutFilter("ALL")
                  setTypeFilter("ALL")
                  setVipOnly(false)
                }}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Clients</CardTitle>
              <CardDescription>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Chargement...
                  </span>
                ) : (
                  `${clients.length} client(s) affiché(s) sur ${total} • Page ${page} sur ${totalPages}`
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Aucun client trouvé</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {search || statutFilter !== "ALL" || typeFilter !== "ALL"
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Commencez par créer votre premier client"}
              </p>
              <Link href="/clients/nouveau">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Créer un client
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {client.prenom[0]}
                            {client.nom[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {client.prenom} {client.nom}
                              </span>
                              {client.estVip && <Star className="h-4 w-4 fill-gold text-gold" />}
                            </div>
                            {client.numeroClient && (
                              <span className="text-xs text-muted-foreground">{client.numeroClient}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-foreground">{client.email}</div>
                          <div className="text-xs text-muted-foreground">{client.telephone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{TYPE_CLIENT_LABELS[client.typeClient]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadges[client.statut]}>{STATUT_LABELS[client.statut]}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client.ville && <div className="text-foreground">{client.ville}</div>}
                          {client.pays && <div className="text-xs text-muted-foreground">{client.pays}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(client.creeLe).toLocaleDateString("fr-FR")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/clients/${client.id}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/clients/${client.id}/modifier`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(client.id, `${client.prenom} ${client.nom}`)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Archiver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
