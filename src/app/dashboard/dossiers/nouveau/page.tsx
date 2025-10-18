/**
 * Page Créer un Dossier - VERSION PREMIUM
 * Avec responsable, design premium, responsive total
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Info,
  Upload,
  CheckCircle2,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  User,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { useCreateDossier, useClients } from "@/hooks";
import type { TypeDossier } from "@/types/dossier.types";
import type { Client } from "@/types/client.types";
import Image from "next/image";

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

// Types
type Step = 1 | 2 | 3 | 4;

type TachePriorite = "BASSE" | "MOYENNE" | "HAUTE" | "URGENTE";

interface Tache {
  id: string;
  titre: string;
  assigneeId: string;
  dateLimite: string;
  priorite: TachePriorite;
}

interface FileWithPreview extends File {
  preview?: string;
}

type FormData = {
  titre: string;
  type: TypeDossier | "";
  clientId: string;
  responsableId: string;
  description: string;
  detailsSpecifiques: DetailsSpecifiques;
  documents: FileWithPreview[];
  taches: Tache[];
};

interface FormDetailsProps<T> {
  data: T;
  onChange: (key: string, value: string) => void;
}

// Modal de succès
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Brouillon sauvegardé !
          </h3>
          <p className="text-slate-600 mb-6">
            Votre brouillon a été enregistré avec succès. Vous pouvez le retrouver en rechargeant la page.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
          >
            Compris
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NouveauDossierPage() {
  const router = useRouter();
  const createMutation = useCreateDossier();
  const { data: clients } = useClients({ take: 100 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    titre: "",
    type: "",
    clientId: "",
    responsableId: "", // Sera rempli avec l'utilisateur connecté
    description: "",
    detailsSpecifiques: {},
    documents: [],
    taches: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Charger le brouillon et définir le responsable par défaut
  useEffect(() => {
    // TODO: Récupérer l'ID de l'utilisateur connecté depuis votre système d'auth
    const currentUserId = "USER_ID_FROM_AUTH"; // À remplacer par la vraie logique
    
    const draft = localStorage.getItem("dossier_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as FormData;
        setFormData(parsed);
      } catch (e) {
        console.error("Erreur chargement brouillon:", e);
      }
    } else {
      // Définir le responsable par défaut
      setFormData((prev) => ({ ...prev, responsableId: currentUserId }));
    }
  }, []);

  // Navigation
  const goToNextStep = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Validation par étape
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.titre.trim()) {
        newErrors.titre = "Le titre est obligatoire";
      }
      if (!formData.type) {
        newErrors.type = "Le type de dossier est obligatoire";
      }
      if (!formData.clientId) {
        newErrors.clientId = "Le client est obligatoire";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit final
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      await createMutation.mutateAsync({
        titre: formData.titre,
        type: formData.type as TypeDossier,
        clientId: formData.clientId,
        responsableId: formData.responsableId || undefined,
        description: formData.description || undefined,
      });

      localStorage.removeItem("dossier_draft");
      router.push("/dashboard/dossiers");
    } catch (error) {
      console.error("Erreur création dossier:", error);
      setErrors({ submit: "Erreur lors de la création du dossier" });
    }
  };

  // Save draft
  const saveDraft = () => {
    localStorage.setItem("dossier_draft", JSON.stringify(formData));
    setShowSuccessModal(true);
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      // Créer un aperçu pour les images
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      return fileWithPreview;
    });

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newFiles],
    }));
  };

  const removeDocument = (index: number) => {
    const file = formData.documents[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  // Nettoyer les previews au démontage
  useEffect(() => {
    return () => {
      formData.documents.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [formData.documents]);

  const steps = [
    { number: 1, title: "Informations générales", icon: Info },
    { number: 2, title: "Détails spécifiques", icon: FileText },
    { number: 3, title: "Documents", icon: Upload },
    { number: 4, title: "Tâches initiales", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Retour</span>
          </button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-serif font-bold text-slate-900"
          >
            Créer un nouveau dossier
          </motion.h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Remplissez les informations étape par étape
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        isCompleted
                          ? "bg-green-100 text-green-700 border-2 border-green-500"
                          : isActive
                          ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                          : "bg-slate-100 text-slate-400 border-2 border-slate-300"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    <span
                      className={`mt-2 text-[10px] sm:text-xs font-semibold text-center max-w-[60px] sm:max-w-none ${
                        isActive ? "text-amber-700" : "text-slate-600"
                      }`}
                    >
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">Étape {step.number}</span>
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-all ${
                        currentStep > step.number
                          ? "bg-green-500"
                          : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 sm:mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">
                {errors.submit}
              </p>
            </div>
          </motion.div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-8 mb-4 sm:mb-6 shadow-sm">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Etape1InformationsGenerales
                formData={formData}
                setFormData={setFormData}
                clients={clients?.data || []}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <Etape2DetailsSpecifiques
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 3 && (
              <Etape3Documents
                formData={formData}
                setFormData={setFormData}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                removeDocument={removeDocument}
                isDragging={isDragging}
              />
            )}

            {currentStep === 4 && (
              <Etape4Taches formData={formData} setFormData={setFormData} />
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 gap-4 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {currentStep > 1 && (
              <button
                onClick={goToPrevStep}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
                <span className="sm:hidden">Préc.</span>
              </button>
            )}

            <button
              onClick={saveDraft}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Enregistrer brouillon</span>
              <span className="sm:hidden">Brouillon</span>
            </button>
          </div>

          <div className="w-full sm:w-auto">
            {currentStep < 4 ? (
              <button
                onClick={goToNextStep}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/30 transition-all"
              >
                <span>Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/30 transition-all"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Créer le dossier</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== ÉTAPE 1 ====================
function Etape1InformationsGenerales({
  formData,
  setFormData,
  clients,
  errors,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  clients: Client[];
  errors: Record<string, string>;
}) {
  // TODO: Récupérer la liste des utilisateurs (personnel) depuis votre API
  const personnel = [
    { id: "USER_ID_FROM_AUTH", nom: "Moi (par défaut)" },
    // Ajouter d'autres utilisateurs ici
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        Informations générales
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Titre */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Titre du dossier <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            placeholder="Ex: Sinistre corporel - Accident route"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.titre ? "border-red-500" : "border-slate-300"
            } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all`}
          />
          {errors.titre && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.titre}
            </p>
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
              setFormData({ ...formData, type: e.target.value as TypeDossier })
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
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.type}
            </p>
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
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.prenom} {client.nom}
                {client.nomEntreprise && ` (${client.nomEntreprise})`}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.clientId}
            </p>
          )}
        </div>

        {/* Responsable du dossier - NOUVEAU */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2 items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            Responsable du dossier
            <span className="text-xs font-normal text-slate-500">(optionnel)</span>
          </label>
          <select
            value={formData.responsableId}
            onChange={(e) =>
              setFormData({ ...formData, responsableId: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-amber-50/30"
          >
            {personnel.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nom}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Par défaut, vous êtes assigné comme responsable
          </p>
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
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
    </motion.div>
  );
}

// ==================== ÉTAPE 2 ====================
function Etape2DetailsSpecifiques({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const updateDetails = (key: string, value: string) => {
    setFormData({
      ...formData,
      detailsSpecifiques: {
        ...formData.detailsSpecifiques,
        [key]: value,
      },
    });
  };

  if (!formData.type) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="text-center py-12"
      >
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-sm sm:text-base">
          Veuillez d&apos;abord sélectionner un type de dossier à l&apos;étape
          précédente
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        Détails spécifiques - {formData.type}
      </h2>

      {/* Formulaires conditionnels selon le type */}
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

      {/* Autres types - Message générique */}
      {!["SINISTRE_CORPOREL", "SINISTRE_MATERIEL", "IMMOBILIER", "CONTENTIEUX"].includes(
        formData.type
      ) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Les détails spécifiques pour ce type de dossier sont optionnels.
              Vous pourrez les ajouter ultérieurement.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ==================== FORMULAIRES PAR TYPE ====================

// Formulaire Sinistre Corporel
function FormSinistreCorporel({ data, onChange }: FormDetailsProps<SinistreCorporelDetails>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <span className="text-2xl">🩹</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Détails du sinistre corporel
        </h3>
      </div>

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
            placeholder="Ex: Douala, Rond-point Deido"
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
          placeholder="Ex: Jean Mbarga - 677 XX XX XX&#10;Marie Ngo - 699 YY YY YY"
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
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <span className="text-2xl">🚗</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Détails du sinistre matériel
        </h3>
      </div>

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
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <span className="text-2xl">🏠</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Détails du dossier immobilier
        </h3>
      </div>

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
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <span className="text-2xl">⚖️</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Détails du contentieux
        </h3>
      </div>

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

// ==================== ÉTAPE 3 - DOCUMENTS ====================
function Etape3Documents({
  formData,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  removeDocument,
  isDragging,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeDocument: (index: number) => void;
  isDragging: boolean;
}) {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 octets";
    const k = 1024;
    const sizes = ["octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        Documents initiaux (optionnel)
      </h2>

      {/* Zone d'upload avec drag & drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-amber-500 bg-amber-50"
            : "border-slate-300 hover:border-amber-500 hover:bg-amber-50/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload
          className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 transition-colors ${
            isDragging ? "text-amber-600" : "text-slate-400"
          }`}
        />
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-slate-500">
          PDF, DOC, DOCX, JPG, PNG (max 10 Mo par fichier)
        </p>
      </div>

      {/* Liste des fichiers avec preview */}
      {formData.documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Fichiers sélectionnés ({formData.documents.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.documents.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-500 transition-all group"
                >
                  {/* Preview ou icône */}
                 <div className="flex-shrink-0">
                    {file.preview ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                        <Image
                          src={file.preview}
                          alt={file.name}
                          fill // fait remplir le parent
                          className="object-cover"
                          sizes="48px" // optionnel, optimise le chargement pour cette taille
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-amber-600" />
                      </div>
                    )}
                  </div>

                  {/* Info fichier */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(index);
                    }}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message info si aucun fichier */}
      {formData.documents.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Info className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-blue-900 font-medium mb-1">
            Aucun document ajouté
          </p>
          <p className="text-xs text-blue-700">
            Vous pourrez ajouter des documents après la création du dossier
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ==================== ÉTAPE 4 - TÂCHES ====================
function Etape4Taches({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const [newTache, setNewTache] = useState({
    titre: "",
    assigneeId: "",
    dateLimite: "",
    priorite: "MOYENNE" as TachePriorite,
  });

  const addTache = () => {
    if (!newTache.titre.trim()) return;

    setFormData({
      ...formData,
      taches: [
        ...formData.taches,
        {
          ...newTache,
          id: crypto.randomUUID(),
        },
      ],
    });

    setNewTache({
      titre: "",
      assigneeId: "",
      dateLimite: "",
      priorite: "MOYENNE",
    });
  };

  const removeTache = (id: string) => {
    setFormData({
      ...formData,
      taches: formData.taches.filter((t) => t.id !== id),
    });
  };

  const prioriteConfig: Record<TachePriorite, { color: string; icon: string; label: string }> = {
    BASSE: { color: "bg-gray-100 text-gray-700 border-gray-300", icon: "🔵", label: "Basse" },
    MOYENNE: { color: "bg-blue-100 text-blue-700 border-blue-300", icon: "🟡", label: "Moyenne" },
    HAUTE: { color: "bg-orange-100 text-orange-700 border-orange-300", icon: "🟠", label: "Haute" },
    URGENTE: { color: "bg-red-100 text-red-700 border-red-300", icon: "🔴", label: "Urgente" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        Tâches initiales (optionnel)
      </h2>

      {/* Formulaire d'ajout de tâche */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-600" />
          Ajouter une tâche
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newTache.titre}
              onChange={(e) =>
                setNewTache({ ...newTache, titre: e.target.value })
              }
              placeholder="Titre de la tâche..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              onKeyPress={(e) => {
                if (e.key === "Enter" && newTache.titre.trim()) {
                  addTache();
                }
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Date limite
            </label>
            <input
              type="date"
              value={newTache.dateLimite}
              onChange={(e) =>
                setNewTache({ ...newTache, dateLimite: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Priorité
            </label>
            <select
              value={newTache.priorite}
              onChange={(e) =>
                setNewTache({
                  ...newTache,
                  priorite: e.target.value as TachePriorite,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              {Object.entries(prioriteConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={addTache}
          disabled={!newTache.titre.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter la tâche</span>
        </button>
      </div>

      {/* Liste des tâches */}
      {formData.taches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Tâches ajoutées ({formData.taches.length})
          </h3>
          <div className="space-y-3">
            {formData.taches.map((tache) => {
              const config = prioriteConfig[tache.priorite];
              return (
                <motion.div
                  key={tache.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-500 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      {tache.titre}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {tache.dateLimite && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1">
                          📅 {new Date(tache.dateLimite).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border ${config.color}`}
                      >
                        {config.icon} {config.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTache(tache.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Supprimer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message info si aucune tâche */}
      {formData.taches.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-blue-900 font-medium mb-1">
            Aucune tâche ajoutée
          </p>
          <p className="text-xs text-blue-700">
            Vous pourrez créer des tâches après la création du dossier
          </p>
        </div>
      )}
    </motion.div>
  );
}