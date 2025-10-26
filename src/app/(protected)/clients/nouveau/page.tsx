"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useClients } from "@/lib/hooks/useClients"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { StatutClient, TypeClient, TYPE_CLIENT_LABELS, STATUT_LABELS } from "@/lib/types/client.types"
import type { CreateClientForm } from "@/lib/types/client.types"
import { toast } from "sonner"
import Link from "next/link"

export default function NewClientPage() {
  const router = useRouter()
  const { createClient, isLoading } = useClients({ autoFetch: false })

  const [formData, setFormData] = useState<CreateClientForm>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "Cameroun",
    typeClient: TypeClient.PARTICULIER,
    statut: StatutClient.PROSPECT,
    estVip: false,
    profession: "",
    entreprise: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createClient(formData)
      toast.success("Client créé avec succès", {
        description: `${formData.prenom} ${formData.nom} a été ajouté à votre portefeuille`,
      })
      router.push("/clients")
    } catch {
      toast.error("Erreur lors de la création", {
        description: "Impossible de créer le client. Vérifiez les informations saisies.",
      })
    }
  }

  const handleChange = (field: keyof CreateClientForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Nouveau Client</h1>
          <p className="text-pretty text-muted-foreground">Ajoutez un nouveau client à votre portefeuille</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Informations d&apos;identification du client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prenom">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  required
                  placeholder="Jean"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  required
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  placeholder="jean.dupont@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">
                  Téléphone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange("telephone", e.target.value)}
                  required
                  placeholder="+237 6XX XX XX XX"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleChange("profession", e.target.value)}
                  placeholder="Avocat, Médecin, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entreprise">Entreprise</Label>
                <Input
                  id="entreprise"
                  value={formData.entreprise}
                  onChange={(e) => handleChange("entreprise", e.target.value)}
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
            <CardDescription>Type et statut du client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="typeClient">Type de Client</Label>
                <Select
                  value={formData.typeClient}
                  onValueChange={(value) => handleChange("typeClient", value as TypeClient)}
                >
                  <SelectTrigger id="typeClient">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TypeClient).map((type) => (
                      <SelectItem key={type} value={type}>
                        {TYPE_CLIENT_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleChange("statut", value as StatutClient)}
                >
                  <SelectTrigger id="statut">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(StatutClient).map((statut) => (
                      <SelectItem key={statut} value={statut}>
                        {STATUT_LABELS[statut]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="estVip"
                  checked={formData.estVip}
                  onCheckedChange={(checked: string | boolean) => handleChange("estVip", checked)}
                />
                <Label htmlFor="estVip" className="cursor-pointer">
                  Client VIP
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
            <CardDescription>Adresse et coordonnées géographiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
                placeholder="123 Rue de la Paix"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleChange("ville", e.target.value)}
                  placeholder="Yaoundé"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleChange("codePostal", e.target.value)}
                  placeholder="00237"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pays">Pays</Label>
                <Input
                  id="pays"
                  value={formData.pays}
                  onChange={(e) => handleChange("pays", e.target.value)}
                  placeholder="Cameroun"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Informations complémentaires</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e: { target: { value: string | boolean } }) => handleChange("notes", e.target.value)}
              placeholder="Ajoutez des notes ou des informations complémentaires..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/clients">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer le client
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
