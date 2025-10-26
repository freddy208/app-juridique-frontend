/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useClient, useClients } from "@/lib/hooks/useClients"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
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
  User,
  Users,
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

// Badge Component (aligné avec la page utilisateur)
const Badge = ({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'blue' | 'purple' | 'orange' | 'teal';
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    destructive: 'bg-red-50 text-red-700 border-red-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Info Row Component (aligné avec la page utilisateur)
const InfoRow = ({
  icon: Icon,
  label,
  value,
  iconColor = 'text-slate-400'
}: {
  icon: any;
  label: string;
  value: string | null | undefined;
  iconColor?: string;
}) => {
  if (!value) return null;
  const displayValue = value || 'Non renseigné';
  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm text-slate-900 break-words">
          {displayValue}
        </p>
      </div>
    </div>
  );
};

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
      setLoadingStats(true)
      getClientStats(id)
        .then(setStats)
        .catch(() => toast.error("Erreur lors du chargement des statistiques"))
        .finally(() => setLoadingStats(false))

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
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement du profil client...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Client introuvable</h2>
          <p className="text-slate-600 mb-6">Le client que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push("/clients")} className="bg-gradient-to-r from-primary-600 to-primary-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux clients
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {client.prenom} {client.nom}
                </h1>
                <div className="flex items-center space-x-3">
                  <Badge variant={statusBadges[client.statut].variant}>
                    {STATUT_LABELS[client.statut]}
                  </Badge>
                  <Badge variant="secondary">
                    {TYPE_CLIENT_LABELS[client.typeClient]}
                  </Badge>
                  {client.estVip && (
                    <Badge variant="warning">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      VIP
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href={`/clients/${id}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
                >
                  <Edit className="w-5 h-5" />
                  <span className="font-medium">Modifier</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Archiver</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Grid Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne Principale (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Informations générales</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow icon={User} label="Prénom" value={client.prenom} />
                  <InfoRow icon={User} label="Nom" value={client.nom} />
                  <InfoRow icon={Mail} label="Email" value={client.email} iconColor="text-blue-500" />
                  <InfoRow icon={Phone} label="Téléphone" value={client.telephone} iconColor="text-green-500" />
                  <InfoRow icon={MapPin} label="Adresse" value={client.adresse} iconColor="text-red-500" />
                  <InfoRow icon={MapPin} label="Ville" value={client.ville} />
                  <InfoRow icon={MapPin} label="Code postal" value={client.codePostal} />
                  <InfoRow icon={MapPin} label="Pays" value={client.pays} />
                </div>
              </div>
            </motion.div>

            {/* Informations professionnelles */}
            {(client.profession || client.entreprise) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Informations professionnelles</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <InfoRow icon={Briefcase} label="Profession" value={client.profession} iconColor="text-purple-500" />
                    <InfoRow icon={Building2} label="Entreprise" value={client.entreprise} iconColor="text-orange-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Statistiques</h2>
                </div>
              </div>
              <div className="p-6">
                {loadingStats ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{stats.nombreDossiers}</p>
                      <p className="text-xs text-slate-500 mt-1">Dossiers</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalHonoraires.toLocaleString()} FCFA</p>
                      <p className="text-xs text-slate-500 mt-1">Honoraires</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{stats.tauxPaiement}%</p>
                      <p className="text-xs text-slate-500 mt-1">Taux paiement</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2">
                        <Activity className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{stats.dossiersActifs}</p>
                      <p className="text-xs text-slate-500 mt-1">Actifs</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">Aucune statistique disponible</p>
                )}
              </div>
            </motion.div>

            {/* Tabs pour Activité, Documents, Notes */}
            <Tabs defaultValue="activity" className="space-y-6">
              <TabsList className="bg-white border border-slate-200 p-1 rounded-lg">
                <TabsTrigger value="activity" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                  <Activity className="w-4 h-4 mr-2" />
                  Activité
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Notes
                </TabsTrigger>
              </TabsList>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>Historique d&apos;activité</CardTitle>
                      <CardDescription>Dernières actions et événements liés à ce client</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingActivity ? (
                        <div className="flex justify-center py-12">
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
                                <Badge variant="secondary">{item.type}</Badge>
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
                          <CardTitle>Documents d&apos;identité</CardTitle>
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
                          <CardTitle>Notes</CardTitle>
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
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Informations système */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-6"
            >
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Informations système</h2>
              </div>
              <div className="p-6 space-y-4">
                <InfoRow 
                  icon={Calendar} 
                  label="Créé le" 
                  value={new Date(client.creeLe).toLocaleDateString("fr-FR")} 
                  iconColor="text-blue-500"
                />
                <InfoRow 
                  icon={Clock} 
                  label="Modifié le" 
                  value={new Date(client.modifieLe).toLocaleDateString("fr-FR")} 
                  iconColor="text-purple-500"
                />
                {client.derniereVisite && (
                  <InfoRow 
                    icon={Users} 
                    label="Dernière visite" 
                    value={new Date(client.derniereVisite).toLocaleDateString("fr-FR")} 
                    iconColor="text-green-500"
                  />
                )}
                {client.numeroClient && (
                  <InfoRow 
                    icon={FileText} 
                    label="N° Client" 
                    value={client.numeroClient} 
                    iconColor="text-orange-500"
                  />
                )}
              </div>
            </motion.div>

            {/* Notes internes */}
            {client.notes && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-amber-50 rounded-xl border border-amber-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-amber-900">Notes internes</h3>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">{client.notes}</p>
              </motion.div>
            )}
          </div>
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