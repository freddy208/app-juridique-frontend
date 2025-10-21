"use client";

import { useState, useEffect } from "react";
import { useClient, useUpdateClient } from "@/hooks/useClients";
import { UpdateClientDto, StatutClient } from "@/types/client.types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Save, User, Building2, Mail, Phone, MapPin,
  CheckCircle, AlertCircle
} from "lucide-react";

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { data: client, isLoading } = useClient(clientId);
  const updateMutation = useUpdateClient();

  const [formData, setFormData] = useState<UpdateClientDto>({
    prenom: "",
    nom: "",
    nomEntreprise: "",
    email: "",
    telephone: "",
    adresse: "",
    statut: "ACTIF",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        prenom: client.prenom || "",
        nom: client.nom || "",
        nomEntreprise: client.nomEntreprise || "",
        email: client.email || "",
        telephone: client.telephone || "",
        adresse: client.adresse || "",
        statut: client.statut,
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prenom?.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.nom?.trim()) newErrors.nom = "Le nom est requis";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (formData.telephone && !/^[\d\s+()-]+$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: clientId, data: formData });
      toast.success("Client modifié avec succès !");
      router.push(`/dashboard/clients/${clientId}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la modification du client");
    }
  };

  const handleStatutChange = (value: string) => {
    setFormData(prev => ({ ...prev, statut: value as StatutClient }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Client introuvable</h2>
          <p className="text-slate-600 mb-6">Le client demandé n&apos;existe pas.</p>
          <Button onClick={() => router.push("/dashboard/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Modifier le client
          </h1>
          <p className="text-slate-600 mt-1">
            {client.prenom} {client.nom}
          </p>
        </div>

        {/* Form */}
        <Card className="overflow-hidden shadow-xl">
          <div className="p-8">
            {/* Informations personnelles */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Informations personnelles</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prenom">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={errors.prenom ? "border-red-500" : ""}
                    placeholder="Jean"
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.prenom}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nom">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={errors.nom ? "border-red-500" : ""}
                    placeholder="MBIDA"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.nom}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="nomEntreprise">Nom de l&apos;entreprise (optionnel)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="nomEntreprise"
                      name="nomEntreprise"
                      value={formData.nomEntreprise}
                      onChange={handleChange}
                      className="pl-11"
                      placeholder="SARL TEKAM Industries"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Coordonnées</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-11 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="client@example.cm"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className={`pl-11 ${errors.telephone ? "border-red-500" : ""}`}
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.telephone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="adresse">Adresse complète</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                    <Textarea
                      id="adresse"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="pl-11 resize-none"
                      rows={3}
                      placeholder="Douala, Akwa - BP 1234"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Statut</h2>
              </div>

              <Select
                value={formData.statut}
                onValueChange={handleStatutChange}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="INACTIF">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}