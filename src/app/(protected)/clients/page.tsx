"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useClients } from "@/lib/hooks/useClients"
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
  Grid3x3,
  List,
  UserCheck,
  UserX,
  AlertCircle,
  Clock,
  Building2,
} from "lucide-react"
import { StatutClient, TypeClient, STATUT_LABELS, TYPE_CLIENT_LABELS, type Client } from "@/lib/types/client.types"
import { toast } from "react-hot-toast"
import * as XLSX from "xlsx"

type ViewMode = "grid" | "table"

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "secondary"
    | "blue"
    | "purple"
    | "orange"
    | "teal"
    | "outline"
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    secondary: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    outline: "bg-white text-slate-700 border-slate-300",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

const getStatusBadgeVariant = (statut: StatutClient): "success" | "warning" | "destructive" | "secondary" => {
  switch (statut) {
    case StatutClient.ACTIF:
      return "success"
    case StatutClient.PROSPECT:
      return "warning"
    case StatutClient.INACTIF:
      return "destructive"
    default:
      return "secondary"
  }
}

const ClientCard = ({
  client,
  onView,
  onEdit,
  onDelete,
}: {
  client: Client
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-elegant transition-all duration-300"
    >
      {/* Header avec menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {client.prenom.charAt(0)}
            {client.nom.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                {client.prenom} {client.nom}
              </h3>
              {client.estVip && <Star className="h-4 w-4 fill-gold text-gold" />}
            </div>
            <p className="text-sm text-slate-500">{client.email}</p>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-premium border border-slate-200 py-1 z-20"
                >
                  <button
                    onClick={() => {
                      onView()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Voir les détails</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      onDelete()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Archiver</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline">{TYPE_CLIENT_LABELS[client.typeClient]}</Badge>
        <Badge variant={getStatusBadgeVariant(client.statut)}>{STATUT_LABELS[client.statut]}</Badge>
      </div>

      {/* Info Supplémentaires */}
      <div className="space-y-2 text-sm text-slate-600">
        {client.telephone && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">📞</span>
            <span>{client.telephone}</span>
          </div>
        )}
        {client.ville && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">📍</span>
            <span>
              {client.ville}
              {client.pays && `, ${client.pays}`}
            </span>
          </div>
        )}
        {client.numeroClient && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">#</span>
            <span>{client.numeroClient}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Créé le {new Date(client.creeLe).toLocaleDateString("fr-FR")}</span>
        {client.modifieLe && (
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(client.modifieLe).toLocaleDateString("fr-FR")}</span>
          </span>
        )}
      </div>
    </motion.div>
  )
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  isLoading = false,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  isLoading?: boolean
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-xl shadow-luxe max-w-md w-full p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Suppression...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ClientsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [search, setSearch] = useState("")
  const [statutFilter, setStatutFilter] = useState<StatutClient | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<TypeClient | "ALL">("ALL")
  const [vipOnly, setVipOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const filters = useMemo(
    () => ({
      search: search || undefined,
      statut: statutFilter !== "ALL" ? statutFilter : undefined,
      typeClient: typeFilter !== "ALL" ? typeFilter : undefined,
      vipOnly: vipOnly || undefined,
    }),
    [search, statutFilter, typeFilter, vipOnly],
  )

  const { clients, total, isLoading, error, deleteClient, getGlobalStats } = useClients({
    page: 1,
    limit: 100,
    filters,
  })

  const [stats, setStats] = useState<{
    total: number
    actifs: number
    inactifs: number
    prospects: number
    vip: number
  } | null>(null)

  useEffect(() => {
    getGlobalStats()
      .then((data) => {
        setStats(data)
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des statistiques")
      })
  }, [getGlobalStats])

  const handleExport = () => {
    try {
      if (!clients || clients.length === 0) {
        toast.error("Aucune donnée à exporter")
        return
      }

      const exportData = clients.map((client) => ({
        Prénom: client.prenom,
        Nom: client.nom,
        Email: client.email,
        Type: TYPE_CLIENT_LABELS[client.typeClient],
        Statut: STATUT_LABELS[client.statut],
        Téléphone: client.telephone || "-",
        Ville: client.ville || "-",
        Pays: client.pays || "-",
        "N° Client": client.numeroClient || "-",
        VIP: client.estVip ? "Oui" : "Non",
        "Date création": new Date(client.creeLe).toLocaleDateString("fr-FR"),
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Clients")

      const colWidths = [
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 5 },
        { wch: 15 },
      ]
      ws["!cols"] = colWidths

      const filename = `clients_${new Date().toISOString().split("T")[0]}.xlsx`
      XLSX.writeFile(wb, filename)

      toast.success(`Export réussi ! ${clients.length} clients exportés`)
    } catch (error) {
      console.error("Erreur export:", error)
      toast.error("Erreur lors de l'export")
    }
  }

  const handleDelete = () => {
    if (!clientToDelete) return

    deleteClient(clientToDelete.id)
      .then(() => {
        toast.success("Client archivé avec succès")
        setClientToDelete(null)
      })
      .catch(() => {
        toast.error("Erreur lors de l'archivage")
      })
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Erreur</h3>
          <p className="text-slate-600">Une erreur est survenue lors du chargement des clients</p>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Gestion des Clients</h1>
              <p className="text-slate-600">Gérez vos clients et suivez leur activité juridique</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/clients/nouveau")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Nouveau client</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          {[
            {
              label: "Total Clients",
              value: stats?.total || total,
              icon: Users,
              color: "from-blue-500 to-blue-600",
              textColor: "text-blue-700",
            },
            {
              label: "Actifs",
              value: stats?.actifs || 0,
              icon: UserCheck,
              color: "from-green-500 to-green-600",
              textColor: "text-green-700",
            },
            {
              label: "Prospects",
              value: stats?.prospects || 0,
              icon: Building2,
              color: "from-purple-500 to-purple-600",
              textColor: "text-purple-700",
            },
            {
              label: "Inactifs",
              value: stats?.inactifs || 0,
              icon: UserX,
              color: "from-slate-500 to-slate-600",
              textColor: "text-slate-700",
            },
            {
              label: "Clients VIP",
              value: stats?.vip || 0,
              icon: Star,
              color: "from-amber-500 to-amber-600",
              textColor: "text-amber-700",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-elegant transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "table" ? "bg-white text-primary-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Vue tableau"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid" ? "bg-white text-primary-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Vue grille"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters || statutFilter !== "ALL" || typeFilter !== "ALL" || vipOnly
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                disabled={clients.length === 0}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                    <select
                      value={statutFilter}
                      onChange={(e) => setStatutFilter(e.target.value as StatutClient | "ALL")}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="ALL">Tous les statuts</option>
                      {Object.values(StatutClient).map((statut) => (
                        <option key={statut} value={statut}>
                          {STATUT_LABELS[statut]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as TypeClient | "ALL")}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="ALL">Tous les types</option>
                      {Object.values(TypeClient).map((type) => (
                        <option key={type} value={type}>
                          {TYPE_CLIENT_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setVipOnly(!vipOnly)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        vipOnly
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${vipOnly ? "fill-current" : ""}`} />
                      <span>VIP uniquement</span>
                    </button>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearch("")
                        setStatutFilter("ALL")
                        setTypeFilter("ALL")
                        setVipOnly(false)
                      }}
                      className="w-full px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-600">Chargement des clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-slate-200 p-12 text-center"
          >
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun client trouvé</h3>
            <p className="text-slate-600 mb-6">
              {search || statutFilter !== "ALL" || typeFilter !== "ALL" || vipOnly
                ? "Aucun client ne correspond à vos critères de recherche."
                : "Commencez par créer votre premier client."}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {clients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onView={() => router.push(`/clients/${client.id}`)}
                      onEdit={() => router.push(`/clients/${client.id}/modifier`)}
                      onDelete={() => setClientToDelete(client)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                          Localisation
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <AnimatePresence>
                        {clients.map((client, index) => (
                          <motion.tr
                            key={client.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                  {client.prenom.charAt(0)}
                                  {client.nom.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium text-slate-900">
                                      {client.prenom} {client.nom}
                                    </div>
                                    {client.estVip && <Star className="h-4 w-4 fill-gold text-gold" />}
                                  </div>
                                  {client.numeroClient && (
                                    <div className="text-sm text-slate-500">{client.numeroClient}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{TYPE_CLIENT_LABELS[client.typeClient]}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={getStatusBadgeVariant(client.statut)}>
                                {STATUT_LABELS[client.statut]}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              <div className="text-sm text-slate-600">
                                <div>{client.email}</div>
                                <div className="text-slate-500">{client.telephone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              <div className="text-sm text-slate-600">
                                {client.ville && <div>{client.ville}</div>}
                                {client.pays && <div className="text-slate-500">{client.pays}</div>}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => router.push(`/clients/${client.id}`)}
                                  className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                  title="Voir les détails"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => router.push(`/clients/${client.id}/modifier`)}
                                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setClientToDelete(client)}
                                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Archiver"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDelete}
        title="Archiver ce client ?"
        message={`Êtes-vous sûr de vouloir archiver ${clientToDelete?.prenom} ${clientToDelete?.nom} ? Cette action peut être annulée ultérieurement.`}
        confirmText="Archiver"
        isLoading={false}
      />
    </div>
  )
}
