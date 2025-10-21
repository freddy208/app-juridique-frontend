"use client";

import { useState } from "react";
import { useCreateClient } from "@/hooks/useClients";
import { CreateClientDto } from "@/types/client.types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Save, FolderPlus, Upload, User, Building2,
  Mail, Phone, MapPin, FileText, AlertCircle, File, Trash2, 
} from "lucide-react";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  file: File;
}

export default function CreateClientPage() {
  const router = useRouter();
  const createMutation = useCreateClient();

  const [formData, setFormData] = useState<CreateClientDto>({
    prenom: "",
    nom: "",
    nomEntreprise: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file: file
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
    toast.success(`${files.length} document(s) ajouté(s)`);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("Document supprimé");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (formData.telephone && !/^[\d\s+()-]+$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (createDossier = false) => {
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    try {
      const newClient = await createMutation.mutateAsync(formData);
      toast.success("Client créé avec succès !");
      
      if (createDossier) {
        router.push(`/dashboard/dossiers/nouveau?clientId=${newClient.id}`);
      } else {
        router.push("/dashboard/clients");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la création du client");
    }
  };

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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nouveau client</h1>
          <p className="text-slate-600 mt-1">Créez une fiche client complète</p>
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

            {/* Notes */}
            <div className="mb-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Notes initiales</h2>
              </div>

              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
                placeholder="Ajoutez des notes sur ce client..."
              />
            </div>

            {/* Documents */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Documents d&apos;identité</h2>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-slate-900 font-semibold mb-1">Cliquez pour téléverser</p>
                  <p className="text-sm text-slate-600">PDF, JPG, PNG (Max 10 MB)</p>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="mt-6 space-y-3">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <File className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-sm text-slate-600">{formatFileSize(doc.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={createMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleSubmit(true)}
                disabled={createMutation.isPending}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <FolderPlus className="w-5 h-5 mr-2" />
                Enregistrer et créer dossier
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}