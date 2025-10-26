"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useClients } from "@/lib/hooks/useClients"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"
import { ArrowLeft, Save, Loader2, User, MapPin, FileText, Tag, Sparkles } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/clients">
                <Button variant="ghost" size="sm" className="hover:bg-slate-100 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </Link>
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Nouveau Client</h1>
              <p className="text-slate-600">Ajoutez un nouveau client à votre portefeuille juridique</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations Personnelles */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-slate-200 shadow-elegant hover:shadow-premium transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">Informations Personnelles</CardTitle>
                      <CardDescription>Informations d&apos;identification du client</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-slate-700 font-medium">
                        Prénom <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => handleChange("prenom", e.target.value)}
                        required
                        placeholder="Jean"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-slate-700 font-medium">
                        Nom <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => handleChange("nom", e.target.value)}
                        required
                        placeholder="Dupont"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-medium">
                        Email <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="jean.dupont@example.com"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-slate-700 font-medium">
                        Téléphone <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => handleChange("telephone", e.target.value)}
                        required
                        placeholder="+237 6XX XX XX XX"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-slate-700 font-medium">
                        Profession
                      </Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => handleChange("profession", e.target.value)}
                        placeholder="Avocat, Médecin, etc."
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entreprise" className="text-slate-700 font-medium">
                        Entreprise
                      </Label>
                      <Input
                        id="entreprise"
                        value={formData.entreprise}
                        onChange={(e) => handleChange("entreprise", e.target.value)}
                        placeholder="Nom de l'entreprise"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Classification */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-slate-200 shadow-elegant hover:shadow-premium transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">Classification</CardTitle>
                      <CardDescription>Type et statut du client</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="typeClient" className="text-slate-700 font-medium">
                        Type de Client
                      </Label>
                      <Select
                        value={formData.typeClient}
                        onValueChange={(value) => handleChange("typeClient", value as TypeClient)}
                      >
                        <SelectTrigger
                          id="typeClient"
                          className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                        >
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
                      <Label htmlFor="statut" className="text-slate-700 font-medium">
                        Statut
                      </Label>
                      <Select
                        value={formData.statut}
                        onValueChange={(value) => handleChange("statut", value as StatutClient)}
                      >
                        <SelectTrigger
                          id="statut"
                          className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
                        >
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
                        onCheckedChange={(checked) => handleChange("estVip", checked)}
                      />
                      <Label
                        htmlFor="estVip"
                        className="cursor-pointer text-slate-700 font-medium flex items-center space-x-1"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span>Client VIP</span>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Adresse */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-slate-200 shadow-elegant hover:shadow-premium transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">Localisation</CardTitle>
                      <CardDescription>Adresse et coordonnées géographiques</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adresse" className="text-slate-700 font-medium">
                      Adresse
                    </Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => handleChange("adresse", e.target.value)}
                      placeholder="123 Rue de la Paix"
                      className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="ville" className="text-slate-700 font-medium">
                        Ville
                      </Label>
                      <Input
                        id="ville"
                        value={formData.ville}
                        onChange={(e) => handleChange("ville", e.target.value)}
                        placeholder="Yaoundé"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codePostal" className="text-slate-700 font-medium">
                        Code Postal
                      </Label>
                      <Input
                        id="codePostal"
                        value={formData.codePostal}
                        onChange={(e) => handleChange("codePostal", e.target.value)}
                        placeholder="00237"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pays" className="text-slate-700 font-medium">
                        Pays
                      </Label>
                      <Input
                        id="pays"
                        value={formData.pays}
                        onChange={(e) => handleChange("pays", e.target.value)}
                        placeholder="Cameroun"
                        className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-slate-200 shadow-elegant hover:shadow-premium transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">Notes</CardTitle>
                      <CardDescription>Informations complémentaires</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Ajoutez des notes ou des informations complémentaires..."
                    rows={4}
                    className="border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all resize-none"
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-4 pt-4"
            >
              <Link href="/clients">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors bg-transparent"
                >
                  Annuler
                </Button>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all"
                >
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
              </motion.div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  )
}
