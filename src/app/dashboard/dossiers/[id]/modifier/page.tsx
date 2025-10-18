/**
 * Page Modifier un Dossier - VERSION CORRIGÉE
 * Formulaire complet avec validation et gestion des détails spécifiques
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle, Info } from "lucide-react";
import { useDossier, useUpdateDossier, useClients } from "@/hooks";
import type { TypeDossier } from "@/types/dossier.types";
import type { Client } from "@/types/client.types";

// Types pour les détails spécifiques
interface SinistreCorporelDetails {
  dateAccident?: string;
  lieuAccident?: string;
  natureBlessures?: string;
  hopital?: string;
  compagnieAssurance?: string;
  numeroPolice?: string;
  temoins?: string;
}

interface SinistreMaterielDetails {
  typeVehicule?: string;
  immatriculation?: string;
  dateSinistre?: string;
  lieuSinistre?: string;
  estimationDegats?: string;
  garage?: string;
  descriptionDommages?: string;
}

interface ImmobilierDetails {
  typeBien?: string;
  localisation?: string;
  superficie?: string;
  titreFoncier?: string;
  valeurEstimee?: string;
  notaire?: string;
}

interface ContentieuxDetails {
  juridiction?: string;
  numeroRG?: string;
  dateAssignation?: string;
  partieAdverse?: string;
  montantLitige?: string;
  avocatAdverse?: string;
  objetLitige?: string;
}

type DetailsSpecifiques = 
  | SinistreCorporelDetails 
  | SinistreMaterielDetails 
  | ImmobilierDetails 
  | ContentieuxDetails 
  | Record<string, unknown>;

type FormData = {
  titre: string;
  type: TypeDossier | "";
  clientId: string;
  responsableId: string;
  description: string;
  detailsSpecifiques: DetailsSpecifiques;
};

// Props types pour les formulaires
interface FormDetailsProps<T> {
  data: T;
  onChange: (key: string, value: string) => void;
}

export default function ModifierDossierPage() {
  const params = useParams();
  const router = useRouter();
  const dossierId = params?.id as string;

  const { data: dossier, isLoading: loadingDossier } = useDossier(dossierId);
  const { data: clients } = useClients({ take: 100 });
  const updateMutation = useUpdateDossier();

  const [formData, setFormData] = useState<FormData>({
    titre: "",
    type: "",
    clientId: "",
    responsableId: "",
    description: "",
    detailsSpecifiques: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDetailsSection, setShowDetailsSection] = useState(false);

  // Pré-remplir le formulaire quand les données arrivent
  useEffect(() => {
    if (dossier) {
      setFormData({
        titre: dossier.titre || "",
        type: dossier.type || "",
        clientId: dossier.clientId || "",
        responsableId: dossier.responsableId || "",
        description: dossier.description || "",
        detailsSpecifiques: dossier.detailsSpecifiques || {},
      });
    }
  }, [dossier]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire";
    }
    if (!formData.type) {
      newErrors.type = "Le type est obligatoire";
    }
    if (!formData.clientId) {
      newErrors.clientId = "Le client est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateMutation.mutateAsync({
        id: dossierId,
        data: {
          titre: formData.titre,
          type: formData.type as TypeDossier,
          clientId: formData.clientId,
          responsableId: formData.responsableId || undefined,
          description: formData.description || undefined,
        },
      });

      router.push(`/dashboard/dossiers/${dossierId}`);
    } catch (error) {
      console.error("Erreur modification:", error);
      setErrors({ submit: "Erreur lors de la modification du dossier" });
    }
  };

  const updateDetails = (key: string, value: string) => {
    setFormData({
      ...formData,
      detailsSpecifiques: {
        ...formData.detailsSpecifiques,
        [key]: value,
      },
    });
  };

  if (loadingDossier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold">Chargement du dossier...</p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Dossier non trouvé
          </h2>
          <p className="text-slate-600 mb-6">
            Le dossier que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => router.push("/dashboard/dossiers")}
            className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all"
          >
            Retour aux dossiers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Retour</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              Modifier le dossier
            </h1>
            <p className="text-slate-600 mt-2">
              #{dossier.numeroUnique} - {dossier.titre}
            </p>
          </motion.div>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">
                {errors.submit}
              </p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Informations générales */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Informations générales
              </h2>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Titre du dossier <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) =>
                  setFormData({ ...formData, titre: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.titre ? "border-red-500" : "border-slate-300"
                } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              />
              {errors.titre && (
                <p className="text-sm text-red-600 mt-1">{errors.titre}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Type de dossier <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as TypeDossier,
                  })
                }
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.type ? "border-red-500" : "border-slate-300"
                } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              >
                <option value="">Sélectionner un type</option>
                <option value="SINISTRE_CORPOREL">🩹 Sinistre corporel</option>
                <option value="SINISTRE_MATERIEL">🚗 Sinistre matériel</option>
                <option value="SINISTRE_MORTEL">⚰️ Sinistre mortel</option>
                <option value="IMMOBILIER">🏠 Immobilier</option>
                <option value="SPORT">⚽ Sport</option>
                <option value="CONTRAT">📄 Contrat</option>
                <option value="CONTENTIEUX">⚖️ Contentieux</option>
                <option value="AUTRE">📋 Autre</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type}</p>
              )}
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Client <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.clientId ? "border-red-500" : "border-slate-300"
                } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
              >
                <option value="">Sélectionner un client</option>
                {clients?.data.map((client: Client) => (
                  <option key={client.id} value={client.id}>
                    {client.prenom} {client.nom}
                    {client.nomEntreprise && ` (${client.nomEntreprise})`}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-sm text-red-600 mt-1">{errors.clientId}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Description détaillée du dossier..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Détails spécifiques - Section extensible */}
          {formData.type &&
            ["SINISTRE_CORPOREL", "SINISTRE_MATERIEL", "IMMOBILIER", "CONTENTIEUX"].includes(
              formData.type
            ) && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDetailsSection(!showDetailsSection)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-amber-600" />
                    <h2 className="text-xl font-bold text-slate-900">
                      Détails spécifiques
                    </h2>
                  </div>
                  <motion.div
                    animate={{ rotate: showDetailsSection ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>

                {showDetailsSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-200 p-8"
                  >
                    {formData.type === "SINISTRE_CORPOREL" && (
                      <FormSinistreCorporel
                        data={formData.detailsSpecifiques as SinistreCorporelDetails}
                        onChange={updateDetails}
                      />
                    )}

                    {formData.type === "SINISTRE_MATERIEL" && (
                      <FormSinistreMateriel
                        data={formData.detailsSpecifiques as SinistreMaterielDetails}
                        onChange={updateDetails}
                      />
                    )}

                    {formData.type === "IMMOBILIER" && (
                      <FormImmobilier
                        data={formData.detailsSpecifiques as ImmobilierDetails}
                        onChange={updateDetails}
                      />
                    )}

                    {formData.type === "CONTENTIEUX" && (
                      <FormContentieux
                        data={formData.detailsSpecifiques as ContentieuxDetails}
                        onChange={updateDetails}
                      />
                    )}
                  </motion.div>
                )}
              </div>
            )}

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-600/30 transition-all"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Enregistrer les modifications</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== FORMULAIRES PAR TYPE ====================

// Formulaire Sinistre Corporel
function FormSinistreCorporel({ data, onChange }: FormDetailsProps<SinistreCorporelDetails>) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        🩹 Détails du sinistre corporel
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Date de l&apos;accident
          </label>
          <input
            type="date"
            value={data.dateAccident || ""}
            onChange={(e) => onChange("dateAccident", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Lieu de l&apos;accident
          </label>
          <input
            type="text"
            value={data.lieuAccident || ""}
            onChange={(e) => onChange("lieuAccident", e.target.value)}
            placeholder="Ex: Douala, Carrefour des immeubles Kotto"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nature des blessures
          </label>
          <input
            type="text"
            value={data.natureBlessures || ""}
            onChange={(e) => onChange("natureBlessures", e.target.value)}
            placeholder="Ex: Fracture tibia, contusions multiples"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Hôpital/Clinique
          </label>
          <input
            type="text"
            value={data.hopital || ""}
            onChange={(e) => onChange("hopital", e.target.value)}
            placeholder="Ex: Hôpital Général de Douala"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Compagnie d&apos;assurance
          </label>
          <input
            type="text"
            value={data.compagnieAssurance || ""}
            onChange={(e) => onChange("compagnieAssurance", e.target.value)}
            placeholder="Ex: AXA Cameroun"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            N° Police d&apos;assurance
          </label>
          <input
            type="text"
            value={data.numeroPolice || ""}
            onChange={(e) => onChange("numeroPolice", e.target.value)}
            placeholder="Ex: POL-2024-12345"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Témoins (noms et contacts)
        </label>
        <textarea
          value={data.temoins || ""}
          onChange={(e) => onChange("temoins", e.target.value)}
          rows={3}
          placeholder="Ex: Jean Mbarga - 677 XX XX XX"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
        />
      </div>
    </div>
  );
}

// Formulaire Sinistre Matériel
function FormSinistreMateriel({ data, onChange }: FormDetailsProps<SinistreMaterielDetails>) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        🚗 Détails du sinistre matériel
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Type de véhicule
          </label>
          <input
            type="text"
            value={data.typeVehicule || ""}
            onChange={(e) => onChange("typeVehicule", e.target.value)}
            placeholder="Ex: Toyota Corolla"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Immatriculation
          </label>
          <input
            type="text"
            value={data.immatriculation || ""}
            onChange={(e) => onChange("immatriculation", e.target.value)}
            placeholder="Ex: CE 1234 AB"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Date du sinistre
          </label>
          <input
            type="date"
            value={data.dateSinistre || ""}
            onChange={(e) => onChange("dateSinistre", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Lieu du sinistre
          </label>
          <input
            type="text"
            value={data.lieuSinistre || ""}
            onChange={(e) => onChange("lieuSinistre", e.target.value)}
            placeholder="Ex: Autoroute Douala-Yaoundé"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Estimation des dégâts (FCFA)
          </label>
          <input
            type="number"
            value={data.estimationDegats || ""}
            onChange={(e) => onChange("estimationDegats", e.target.value)}
            placeholder="Ex: 2500000"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Garage/Expert
          </label>
          <input
            type="text"
            value={data.garage || ""}
            onChange={(e) => onChange("garage", e.target.value)}
            placeholder="Ex: Garage Central Douala"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Description des dommages
        </label>
        <textarea
          value={data.descriptionDommages || ""}
          onChange={(e) => onChange("descriptionDommages", e.target.value)}
          rows={3}
          placeholder="Décrire les dommages matériels..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
        />
      </div>
    </div>
  );
}

// Formulaire Immobilier
function FormImmobilier({ data, onChange }: FormDetailsProps<ImmobilierDetails>) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        🏠 Détails du dossier immobilier
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Type de bien
          </label>
          <select
            value={data.typeBien || ""}
            onChange={(e) => onChange("typeBien", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          >
            <option value="">Sélectionner</option>
            <option value="TERRAIN">Terrain</option>
            <option value="MAISON">Maison</option>
            <option value="APPARTEMENT">Appartement</option>
            <option value="IMMEUBLE">Immeuble</option>
            <option value="COMMERCE">Local commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Localisation
          </label>
          <input
            type="text"
            value={data.localisation || ""}
            onChange={(e) => onChange("localisation", e.target.value)}
            placeholder="Ex: Kotto, Douala"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Superficie (m²)
          </label>
          <input
            type="number"
            value={data.superficie || ""}
            onChange={(e) => onChange("superficie", e.target.value)}
            placeholder="Ex: 500"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Titre foncier
          </label>
          <input
            type="text"
            value={data.titreFoncier || ""}
            onChange={(e) => onChange("titreFoncier", e.target.value)}
            placeholder="Ex: TF 12345"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Valeur estimée (FCFA)
          </label>
          <input
            type="number"
            value={data.valeurEstimee || ""}
            onChange={(e) => onChange("valeurEstimee", e.target.value)}
            placeholder="Ex: 50000000"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Notaire
          </label>
          <input
            type="text"
            value={data.notaire || ""}
            onChange={(e) => onChange("notaire", e.target.value)}
            placeholder="Ex: Me Epanda"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

// Formulaire Contentieux
function FormContentieux({ data, onChange }: FormDetailsProps<ContentieuxDetails>) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        ⚖️ Détails du contentieux
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Juridiction
          </label>
          <select
            value={data.juridiction || ""}
            onChange={(e) => onChange("juridiction", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          >
            <option value="">Sélectionner</option>
            <option value="TPI">Tribunal de Première Instance</option>
            <option value="TGI">Tribunal de Grande Instance</option>
            <option value="COUR_APPEL">Cour d&apos;Appel</option>
            <option value="COUR_SUPREME">Cour Suprême</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            N° RG (Rôle général)
          </label>
          <input
            type="text"
            value={data.numeroRG || ""}
            onChange={(e) => onChange("numeroRG", e.target.value)}
            placeholder="Ex: RG 2024/123"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Date d&apos;assignation
          </label>
          <input
            type="date"
            value={data.dateAssignation || ""}
            onChange={(e) => onChange("dateAssignation", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Partie adverse
          </label>
          <input
            type="text"
            value={data.partieAdverse || ""}
            onChange={(e) => onChange("partieAdverse", e.target.value)}
            placeholder="Nom de la partie adverse"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Montant du litige (FCFA)
          </label>
          <input
            type="number"
            value={data.montantLitige || ""}
            onChange={(e) => onChange("montantLitige", e.target.value)}
            placeholder="Ex: 10000000"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Avocat adverse
          </label>
          <input
            type="text"
            value={data.avocatAdverse || ""}
            onChange={(e) => onChange("avocatAdverse", e.target.value)}
            placeholder="Ex: Me Talla"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Objet du litige
        </label>
        <textarea
          value={data.objetLitige || ""}
          onChange={(e) => onChange("objetLitige", e.target.value)}
          rows={3}
          placeholder="Décrire l'objet du contentieux..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
        />
      </div>
    </div>
  );
}