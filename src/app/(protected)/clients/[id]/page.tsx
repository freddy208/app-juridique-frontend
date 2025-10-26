"use client"

import { use, useState, useEffect, SetStateAction } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { STATUT_LABELS, TYPE_CLIENT_LABELS, statusBadges } from "@/lib/types/client.types"
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
    if (confirm(`Êtes-vous sûr de vouloir archiver ${client.prenom} ${client.nom} ?`)) {
      try {
        await deleteClient(id)
        toast.success("Client archivé avec succès")
        router.push("/clients")
      } catch {
        toast.error("Erreur lors de l'archivage")
      }
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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement du client...</p>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>Client introuvable</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/clients">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
                {client.prenom} {client.nom}
              </h1>
              {client.estVip && <Star className="h-6 w-6 fill-gold text-gold" />}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Badge variant={statusBadges[client.statut]}>{STATUT_LABELS[client.statut]}</Badge>
              <Badge variant="outline">{TYPE_CLIENT_LABELS[client.typeClient]}</Badge>
              {client.numeroClient && <span className="text-sm text-muted-foreground">N° {client.numeroClient}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/clients/${id}/modifier`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Archiver
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{client.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Phone className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="text-sm font-medium text-foreground">{client.telephone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <MapPin className="h-5 w-5 text-info" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Localisation</p>
                <p className="text-sm font-medium text-foreground">
                  {client.ville || "Non renseignée"}
                  {client.pays && `, ${client.pays}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Client depuis</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(client.creeLe).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations Personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.profession && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Profession</p>
                      <p className="text-sm font-medium">{client.profession}</p>
                    </div>
                  </div>
                )}
                {client.entreprise && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Entreprise</p>
                      <p className="text-sm font-medium">{client.entreprise}</p>
                    </div>
                  </div>
                )}
                {client.adresse && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Adresse complète</p>
                      <p className="text-sm font-medium">
                        {client.adresse}
                        {client.codePostal && `, ${client.codePostal}`}
                      </p>
                    </div>
                  </div>
                )}
                {client.derniereVisite && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dernière visite</p>
                      <p className="text-sm font-medium">
                        {new Date(client.derniereVisite).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes rapides */}
            {client.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{client.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          {loadingStats ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stats ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    Dossiers
                    <FileText className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.nombreDossiers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.dossiersActifs} actifs • {stats.dossiersTermines} terminés
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    Finances
                    <DollarSign className="h-4 w-4 text-success" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalHonoraires.toLocaleString()} FCFA</div>
                  <p className="text-xs text-muted-foreground">Taux de paiement: {stats.tauxPaiement}%</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-info">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    Ancienneté
                    <TrendingUp className="h-4 w-4 text-info" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.anciennete} jours</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.nombreDocuments} documents • {stats.nombreNotes} notes
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Aucune statistique disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Historique d&apos;activité
              </CardTitle>
              <CardDescription>Toutes les actions liées à ce client</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activity.length > 0 ? (
                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="flex gap-4 border-l-2 border-muted pl-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Aucune activité enregistrée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents d&apos;identité</CardTitle>
                  <CardDescription>Pièces d&apos;identité et documents officiels</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Ajouter un document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un document d&apos;identité</DialogTitle>
                      <DialogDescription>Téléchargez une pièce d&apos;identité pour ce client</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm text-muted-foreground">Fonctionnalité en cours de développement</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucun document disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Notes et commentaires sur ce client</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                          onChange={(e: { target: { value: SetStateAction<string> } }) => setNoteContent(e.target.value)}
                          placeholder="Écrivez votre note ici..."
                          rows={5}
                        />
                      </div>
                      <Button onClick={handleAddNote} disabled={isAddingNote || !noteContent.trim()}>
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
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="pt-6">
                        <p className="text-sm">{note.contenu}</p>
                        <Separator className="my-3" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{note.auteur && `${note.auteur.prenom} ${note.auteur.nom}`}</span>
                          <span>{new Date(note.creeLe).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Aucune note disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
