/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useClient, useClients } from "@/lib/hooks/useClients"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Separator } from "@/components/ui/Separator"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  Activity,
  Loader2,
  Plus,
  Upload,
  AlertCircle,
} from "lucide-react"
import { STATUT_LABELS, TYPE_CLIENT_LABELS } from "@/lib/types/client.types"
import { statusBadgesClient as statusBadges } from "@/lib/utils/badge-config"
import type { ClientStats, ClientActivity as ClientActivityType, NoteClient } from "@/lib/types/client.types"
import { toast } from "sonner"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/Textarea"

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

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { client, isLoading: clientLoading, error } = useClient(id)
  const { deleteClient, getClientStats, getClientActivity, addNote } = useClients({ autoFetch: false })

  const [stats, setStats] = useState<ClientStats | null>(null)
  const [activity, setActivity] = useState<ClientActivityType[]>([])
  const [notes, setNotes] = useState<NoteClient[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (id) {
      // Load stats
      setLoadingStats(true)
      getClientStats(id)
        .then(setStats)
        .catch(() => toast.error("Erreur lors du chargement des statistiques"))
        .finally(() => setLoadingStats(false))

      // Load activity
      setLoadingActivity(true)
      getClientActivity(id)
        .then(setActivity)
        .catch(() => toast.error("Erreur lors du chargement de l'activité"))
        .finally(() => setLoadingActivity(false))
    }
  }, [id, getClientStats, getClientActivity])

  const handleDelete = async () => {
    if (!client) return

    setIsDeleting(true)
    try {
      await deleteClient(id)
      toast.success("Client archivé avec succès")
      router.push("/clients")
    } catch {
      toast.error("Erreur lors de l'archivage")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteContent.trim()) return

    setIsAddingNote(true)
    try {
      const newNote = await addNote(id, { contenu: noteContent })
      setNotes([newNote, ...notes])
      setNoteContent("")
      toast.success("Note ajoutée avec succès")
    } catch {
      toast.error("Erreur lors de l'ajout de la note")
    } finally {
      setIsAddingNote(false)
    }
  }

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Chargement du client...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-elegant p-12 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Client introuvable</h3>
          <p className="text-slate-600 mb-6">Le client que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Link href="/clients">
            <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <Link href="/clients">
                <Button variant="ghost" size="sm" className="hover:bg-white/80">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-serif font-bold text-slate-900">
                    {client.prenom} {client.nom}
                  </h1>
                  {client.estVip && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Star className="h-6 w-6 fill-gold text-gold" />
                    </motion.div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant={statusBadges[client.statut].variant as any}>
                    {STATUT_LABELS[client.statut]}
                  </Badge>
                  <Badge variant="outline">{TYPE_CLIENT_LABELS[client.typeClient]}</Badge>
                  {client.numeroClient && <span className="text-sm text-slate-500">N° {client.numeroClient}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href={`/clients/${id}/modifier`}>
                  <Button variant="outline" className="border-slate-200 hover:bg-white bg-transparent">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Archiver
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 md:grid-cols-4"
          >
            {[
              { icon: Mail, label: "Email", value: client.email, color: "from-blue-500 to-blue-600" },
              { icon: Phone, label: "Téléphone", value: client.telephone, color: "from-green-500 to-green-600" },
              {
                icon: MapPin,
                label: "Localisation",
                value: `${client.ville || "Non renseignée"}${client.pays ? `, ${client.pays}` : ""}`,
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Calendar,
                label: "Client depuis",
                value: new Date(client.creeLe).toLocaleDateString("fr-FR"),
                color: "from-orange-500 to-orange-600",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="border-slate-200 shadow-sm hover:shadow-elegant transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}
                      >
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium text-slate-500">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 shadow-sm">
                <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="activity">Activité</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 md:grid-cols-2">
                  {/* Informations Personnelles */}
                  <Card className="border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-serif">Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {client.profession && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Profession</p>
                            <p className="text-sm font-medium text-slate-900">{client.profession}</p>
                          </div>
                        </div>
                      )}
                      {client.entreprise && (
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Entreprise</p>
                            <p className="text-sm font-medium text-slate-900">{client.entreprise}</p>
                          </div>
                        </div>
                      )}
                      {client.adresse && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Adresse complète</p>
                            <p className="text-sm font-medium text-slate-900">
                              {client.adresse}
                              {client.codePostal && `, ${client.codePostal}`}
                            </p>
                          </div>
                        </div>
                      )}
                      {client.derniereVisite && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Dernière visite</p>
                            <p className="text-sm font-medium text-slate-900">
                              {new Date(client.derniereVisite).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notes rapides */}
                  {client.notes && (
                    <Card className="border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
                      <CardHeader>
                        <CardTitle className="font-serif">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600">{client.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-6">
                {loadingStats ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                ) : stats ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-3">
                    {[
                      {
                        label: "Dossiers",
                        value: stats.nombreDossiers,
                        subtitle: `${stats.dossiersActifs} actifs • ${stats.dossiersTermines} terminés`,
                        icon: FileText,
                        color: "from-blue-500 to-blue-600",
                        borderColor: "border-l-blue-500",
                      },
                      {
                        label: "Finances",
                        value: `${stats.totalHonoraires.toLocaleString()} FCFA`,
                        subtitle: `Taux de paiement: ${stats.tauxPaiement}%`,
                        icon: DollarSign,
                        color: "from-green-500 to-green-600",
                        borderColor: "border-l-green-500",
                      },
                      {
                        label: "Ancienneté",
                        value: `${stats.anciennete} jours`,
                        subtitle: `${stats.nombreDocuments} documents • ${stats.nombreNotes} notes`,
                        icon: TrendingUp,
                        color: "from-purple-500 to-purple-600",
                        borderColor: "border-l-purple-500",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <Card
                          className={`border-l-4 ${stat.borderColor} shadow-sm hover:shadow-elegant transition-all duration-300`}
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                              {stat.label}
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                              >
                                <stat.icon className="h-5 w-5 text-white" />
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="flex h-64 items-center justify-center">
                      <p className="text-slate-500">Aucune statistique disponible</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-serif">
                        <Activity className="h-5 w-5" />
                        Historique d&apos;activité
                      </CardTitle>
                      <CardDescription>Toutes les actions liées à ce client</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingActivity ? (
                        <div className="flex h-64 items-center justify-center">
                          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        </div>
                      ) : activity.length > 0 ? (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {activity.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex gap-4 border-l-2 border-primary-200 pl-4 hover:border-primary-400 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-900">{item.description}</p>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <span>{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                                    {item.auteur && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          {item.auteur.prenom} {item.auteur.nom}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <Badge variant="outline">{item.type}</Badge>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                          <Activity className="mb-4 h-12 w-12 text-slate-300" />
                          <p className="text-sm text-slate-500">Aucune activité enregistrée</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-serif">Documents d&apos;identité</CardTitle>
                          <CardDescription>Pièces d&apos;identité et documents officiels</CardDescription>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                              <Upload className="mr-2 h-4 w-4" />
                              Ajouter un document
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Ajouter un document d&apos;identité</DialogTitle>
                              <DialogDescription>Téléchargez une pièce d&apos;identité pour ce client</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <p className="text-sm text-slate-500">Fonctionnalité en cours de développement</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-64 flex-col items-center justify-center text-center">
                        <FileText className="mb-4 h-12 w-12 text-slate-300" />
                        <p className="text-sm text-slate-500">Aucun document disponible</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-serif">Notes</CardTitle>
                          <CardDescription>Notes et commentaires sur ce client</CardDescription>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                              <Plus className="mr-2 h-4 w-4" />
                              Ajouter une note
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Nouvelle note</DialogTitle>
                              <DialogDescription>Ajoutez une note ou un commentaire pour ce client</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="note">Contenu de la note</Label>
                                <Textarea
                                  id="note"
                                  value={noteContent}
                                  onChange={(e) => setNoteContent(e.target.value)}
                                  placeholder="Écrivez votre note ici..."
                                  rows={5}
                                />
                              </div>
                              <Button
                                onClick={handleAddNote}
                                disabled={isAddingNote || !noteContent.trim()}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                              >
                                {isAddingNote ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ajout en cours...
                                  </>
                                ) : (
                                  "Ajouter la note"
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {notes.length > 0 ? (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {notes.map((note, index) => (
                              <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card className="border-slate-200 shadow-sm hover:shadow-elegant transition-shadow">
                                  <CardContent className="pt-6">
                                    <p className="text-sm text-slate-700">{note.contenu}</p>
                                    <Separator className="my-3" />
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                      <span>{note.auteur && `${note.auteur.prenom} ${note.auteur.nom}`}</span>
                                      <span>{new Date(note.creeLe).toLocaleDateString("fr-FR")}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                          <FileText className="mb-4 h-12 w-12 text-slate-300" />
                          <p className="text-sm text-slate-500">Aucune note disponible</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Archiver ce client ?"
        message={`Êtes-vous sûr de vouloir archiver ${client.prenom} ${client.nom} ? Cette action peut être annulée ultérieurement.`}
        confirmText="Archiver"
        isLoading={isDeleting}
      />
    </div>
  )
}
