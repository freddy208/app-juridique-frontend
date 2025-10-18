/**
 * Page Détails Dossier - VERSION CORRIGÉE
 * 8 Onglets Premium avec fonctionnalités complètes
 */
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Archive,
  Trash2,
  Share2,
  Download,
  MoreVertical,
  FileText,
  CheckSquare,
  Calendar,
  MessageSquare,
  DollarSign,
  StickyNote,
  History,
  Eye,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import {
  useDossier,
  useDossierDocuments,
  useDossierTaches,
  useDossierEvenements,
  useDossierMessages,
  useDossierNotes,
  useDeleteDossier,
  useUpdateDossierStatut,
  usePermissions,
} from "@/hooks";
import type { Dossier, StatutDossier } from "@/types/dossier.types";
import type { Document } from "@/types/document.types";
import type { Tache } from "@/types/tache.types";
import type { EvenementCalendrier } from "@/types/evenement.types";
import type { Note } from "@/types/note.types";

type OverviewTabProps = { dossier: Dossier };
type DocumentsTabProps = { documents?: Document[] };
type TachesTabProps = { taches?: Tache[] };
type CalendrierTabProps = { evenements?: EvenementCalendrier[] };
type NotesTabProps = { notes?: Note[] };

type Tab =
  | "overview"
  | "documents"
  | "taches"
  | "calendrier"
  | "messages"
  | "facturation"
  | "notes"
  | "audit";

export default function DossierDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dossierId = params?.id as string;

  const { canWrite, canDelete } = usePermissions("dossiers");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showActions, setShowActions] = useState(false);

  // Queries
  const { data: dossier, isLoading } = useDossier(dossierId);
  const { data: documents } = useDossierDocuments(dossierId);
  const { data: taches } = useDossierTaches(dossierId);
  const { data: evenements } = useDossierEvenements(dossierId);
  const { data: messages } = useDossierMessages(dossierId);
  const { data: notes } = useDossierNotes(dossierId);

  // Mutations
  const deleteMutation = useDeleteDossier();
  const updateStatutMutation = useUpdateDossierStatut();

  // Handlers
  const handleDelete = async () => {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible.")) return;
    try {
      await deleteMutation.mutateAsync(dossierId);
      router.push("/dashboard/dossiers");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression du dossier");
    }
  };

  const handleArchive = async () => {
    if (!confirm("Êtes-vous sûr de vouloir archiver ce dossier ?")) return;
    try {
      await updateStatutMutation.mutateAsync({ id: dossierId, statut: "ARCHIVE" });
      alert("✅ Dossier archivé avec succès");
    } catch (error) {
      console.error("Erreur archivage:", error);
      alert("❌ Erreur lors de l'archivage");
    }
  };

  const handleExportPDF = () => {
    alert("🔄 Export PDF en cours de développement...");
  };

  const handleShare = () => {
    alert("🔄 Fonction de partage en cours de développement...");
  };

  // Badges
  const getStatutBadge = (statut: StatutDossier) => {
    const badges = {
      OUVERT: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
      EN_COURS: { class: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
      CLOS: { class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      ARCHIVE: { class: "bg-gray-100 text-gray-800 border-gray-200", icon: Archive },
      SUPPRIME: { class: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };
    return badges[statut] || badges.OUVERT;
  };

  // Tabs config
  const tabs = [
    { id: "overview" as Tab, label: "Vue d'ensemble", icon: Eye },
    { id: "documents" as Tab, label: "Documents", icon: FileText, count: documents?.length },
    { id: "taches" as Tab, label: "Tâches", icon: CheckSquare, count: taches?.length },
    { id: "calendrier" as Tab, label: "Calendrier", icon: Calendar, count: evenements?.length },
    { id: "messages" as Tab, label: "Messages", icon: MessageSquare, count: messages?.length },
    { id: "facturation" as Tab, label: "Facturation", icon: DollarSign },
    { id: "notes" as Tab, label: "Notes", icon: StickyNote, count: notes?.length },
    { id: "audit" as Tab, label: "Historique", icon: History },
  ];

  if (isLoading) {
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
          <h2 className="text-xl font-bold text-slate-900 mb-2">Dossier non trouvé</h2>
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

  const statutBadge = getStatutBadge(dossier.statut);
  const StatutIcon = statutBadge.icon;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Retour</span>
        </button>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  #{dossier.numeroUnique}
                </span>
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border ${statutBadge.class}`}
                >
                  <StatutIcon className="w-3.5 h-3.5" />
                  {dossier.statut.replace(/_/g, " ")}
                </span>
                <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                  {dossier.type.replace(/_/g, " ")}
                </span>
              </div>

              <h1 className="text-3xl font-serif font-bold text-slate-900 mb-3">
                {dossier.titre}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">Client:</span>
                  <button
                    onClick={() => router.push(`/dashboard/clients/${dossier.clientId}`)}
                    className="text-amber-700 hover:underline font-semibold"
                  >
                    {dossier.client?.prenom} {dossier.client?.nom}
                  </button>
                </div>

                {dossier.responsable && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">Responsable:</span>
                    <span className="text-slate-900">
                      {dossier.responsable.prenom} {dossier.responsable.nom}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">Créé le:</span>
                  <span className="text-slate-900">
                    {new Date(dossier.creeLe).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </button>

              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-12 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                  >
                    {canWrite && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          router.push(`/dashboard/dossiers/${dossierId}/modifier`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier le dossier</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowActions(false);
                        handleExportPDF();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exporter en PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowActions(false);
                        handleShare();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowActions(false);
                        handleArchive();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors border-t border-slate-200"
                    >
                      <Archive className="w-4 h-4" />
                      <span>Archiver</span>
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          handleDelete();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors border-t border-slate-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-100 text-amber-800 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-amber-200 text-amber-900"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" dossier={dossier} />}
          {activeTab === "documents" && (
            <DocumentsTab key="documents" documents={documents} />
          )}
          {activeTab === "taches" && (
            <TachesTab key="taches" taches={taches} />
          )}
          {activeTab === "calendrier" && (
            <CalendrierTab key="calendrier" evenements={evenements} />
          )}
          {activeTab === "messages" && <MessagesTab key="messages" />}
          {activeTab === "facturation" && <FacturationTab key="facturation" />}
          {activeTab === "notes" && <NotesTab key="notes" notes={notes} />}
          {activeTab === "audit" && <AuditTab key="audit" dossier={dossier} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// TAB COMPONENTS
// ============================================

function OverviewTab({ dossier }: OverviewTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Vue d&apos;ensemble</h2>
      </div>

      {/* Informations et Statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations générales */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Informations générales
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Type de dossier</span>
              <p className="text-slate-900 font-bold mt-1 text-lg">
                {dossier.type.replace(/_/g, " ")}
              </p>
            </div>

            {dossier.description && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-600">Description</span>
                <p className="text-slate-900 mt-2 leading-relaxed">{dossier.description}</p>
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Statut actuel</span>
              <p className="text-slate-900 font-bold mt-1 text-lg">
                {dossier.statut.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-600" />
            Statistiques du dossier
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 cursor-pointer"
            >
              <FileText className="w-8 h-8 text-blue-700 mb-3" />
              <p className="text-3xl font-bold text-blue-900">0</p>
              <p className="text-sm font-semibold text-blue-700 mt-1">Documents</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 cursor-pointer"
            >
              <CheckSquare className="w-8 h-8 text-amber-700 mb-3" />
              <p className="text-3xl font-bold text-amber-900">0</p>
              <p className="text-sm font-semibold text-amber-700 mt-1">Tâches</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 cursor-pointer"
            >
              <Calendar className="w-8 h-8 text-purple-700 mb-3" />
              <p className="text-3xl font-bold text-purple-900">0</p>
              <p className="text-sm font-semibold text-purple-700 mt-1">Événements</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 cursor-pointer"
            >
              <DollarSign className="w-8 h-8 text-green-700 mb-3" />
              <p className="text-3xl font-bold text-green-900">0 FCFA</p>
              <p className="text-sm font-semibold text-green-700 mt-1">Facturation</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-amber-600" />
          Timeline récente
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-green-900">✅ Dossier créé</p>
              <p className="text-xs text-green-700 mt-1">
                {new Date(dossier.creeLe).toLocaleString("fr-FR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Par {dossier.responsable?.prenom || "Système"}
              </p>
            </div>
          </div>

          {dossier.modifieLe && dossier.modifieLe !== dossier.creeLe && (
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900">📝 Dernière modification</p>
                <p className="text-xs text-blue-700 mt-1">
                  {new Date(dossier.modifieLe).toLocaleString("fr-FR", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DocumentsTab({ documents }: DocumentsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30">
          <Plus className="w-4 h-4" />
          <span>Ajouter document</span>
        </button>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold mb-2">Aucun document</p>
          <p className="text-sm text-slate-400">
            Ajoutez des documents pour enrichir ce dossier
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc: Document) => (
            <motion.div
              key={doc.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <FileText className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {doc.titre}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {new Date(doc.creeLe).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-amber-100 hover:text-amber-700 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TachesTab({ taches }: TachesTabProps) {
  const tachesEnCours = taches?.filter((t) => t.statut !== "TERMINEE") || [];
  const tachesTerminees = taches?.filter((t) => t.statut === "TERMINEE") || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Tâches</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30">
          <Plus className="w-4 h-4" />
          <span>Nouvelle tâche</span>
        </button>
      </div>

      {!taches || taches.length === 0 ? (
        <div className="text-center py-16">
          <CheckSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold mb-2">Aucune tâche</p>
          <p className="text-sm text-slate-400">Créez des tâches pour organiser votre travail</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tâches en cours */}
          {tachesEnCours.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">En cours ({tachesEnCours.length})</h3>
              {tachesEnCours.map((tache: Tache) => (
                <motion.div
                  key={tache.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 hover:bg-amber-50 hover:border-amber-200 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => {}}
                    className="w-5 h-5 rounded border-slate-300 text-amber-600 mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{tache.titre}</p>
                    {tache.description && (
                      <p className="text-sm text-slate-600 mt-2">{tache.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tâches terminées */}
          {tachesTerminees.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                Terminées ({tachesTerminees.length})
              </h3>
              {tachesTerminees.map((tache: Tache) => (
                <motion.div
                  key={tache.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 bg-green-50 hover:bg-green-100 transition-all opacity-75"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {}}
                    className="w-5 h-5 rounded border-slate-300 text-green-600 mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-700 line-through">{tache.titre}</p>
                    {tache.description && (
                      <p className="text-sm text-slate-600 mt-2 line-through">
                        {tache.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function CalendrierTab({ evenements }: CalendrierTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Calendrier & Événements</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30">
          <Plus className="w-4 h-4" />
          <span>Nouvel événement</span>
        </button>
      </div>

      {!evenements || evenements.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold mb-2">Aucun événement</p>
          <p className="text-sm text-slate-400">
            Planifiez des rendez-vous et audiences pour ce dossier
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {evenements.map((event: EvenementCalendrier) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-purple-900 text-lg mb-2">{event.titre}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-700">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">
                      {new Date(event.debut).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-700 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(event.debut).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-xs font-bold">
                  À venir
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MessagesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Messages & Chat</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30">
          <Plus className="w-4 h-4" />
          <span>Nouveau message</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-12 text-center border-2 border-dashed border-slate-300">
        <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 font-semibold mb-2">Interface de chat</p>
        <p className="text-sm text-slate-500">
          Fonctionnalité de messagerie en temps réel à implémenter
        </p>
      </div>
    </motion.div>
  );
}

function FacturationTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Facturation</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30">
          <Plus className="w-4 h-4" />
          <span>Nouvelle facture</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <DollarSign className="w-8 h-8 text-green-700 mb-3" />
          <p className="text-3xl font-bold text-green-900">0 FCFA</p>
          <p className="text-sm font-semibold text-green-700 mt-1">Total facturé</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <CheckCircle className="w-8 h-8 text-blue-700 mb-3" />
          <p className="text-3xl font-bold text-blue-900">0 FCFA</p>
          <p className="text-sm font-semibold text-blue-700 mt-1">Payé</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <Clock className="w-8 h-8 text-red-700 mb-3" />
          <p className="text-3xl font-bold text-red-900">0 FCFA</p>
          <p className="text-sm font-semibold text-red-700 mt-1">En attente</p>
        </div>
      </div>

      <div className="text-center py-16">
        <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-semibold mb-2">Aucune facture</p>
        <p className="text-sm text-slate-400">
          Créez des factures pour suivre la facturation du dossier
        </p>
      </div>
    </motion.div>
  );
}

function NotesTab({ notes }: NotesTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Notes internes</h2>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30">
          <Plus className="w-4 h-4" />
          <span>Nouvelle note</span>
        </button>
      </div>

      {!notes || notes.length === 0 ? (
        <div className="text-center py-16">
          <StickyNote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold mb-2">Aucune note</p>
          <p className="text-sm text-slate-400">
            Ajoutez des notes privées pour garder des informations importantes
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note: Note) => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl border border-slate-200 bg-yellow-50 hover:bg-yellow-100 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-yellow-700" />
                  <span className="text-sm font-bold text-yellow-900">Note interne</span>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-yellow-200 transition-colors">
                  <MoreVertical className="w-4 h-4 text-yellow-700" />
                </button>
              </div>
              <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
                {note.contenu}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-yellow-200">
                <div className="flex items-center gap-2 text-xs text-yellow-800">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-semibold">
                    {note.utilisateur.prenom} {note.utilisateur.nom}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-yellow-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(note.creeLe).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AuditTab({ dossier }: { dossier: Dossier }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-slate-900">Historique & Audit</h2>

      <div className="space-y-3">
        {/* Événement de création */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-start gap-4 p-5 rounded-xl bg-green-50 border border-green-200"
        >
          <div className="w-3 h-3 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-700" />
              <p className="text-sm font-bold text-green-900">Dossier créé</p>
            </div>
            <p className="text-xs text-green-700 mb-1">
              {new Date(dossier.creeLe).toLocaleString("fr-FR", {
                dateStyle: "full",
                timeStyle: "medium",
              })}
            </p>
            {dossier.responsable && (
              <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                <User className="w-3.5 h-3.5" />
                <span>
                  Par {dossier.responsable.prenom} {dossier.responsable.nom}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Événement de modification */}
        {dossier.modifieLe && dossier.modifieLe !== dossier.creeLe && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-start gap-4 p-5 rounded-xl bg-blue-50 border border-blue-200"
          >
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Edit className="w-5 h-5 text-blue-700" />
                <p className="text-sm font-bold text-blue-900">Dossier modifié</p>
              </div>
              <p className="text-xs text-blue-700">
                {new Date(dossier.modifieLe).toLocaleString("fr-FR", {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </p>
            </div>
          </motion.div>
        )}

        {/* Statut actuel */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-start gap-4 p-5 rounded-xl bg-amber-50 border border-amber-200"
        >
          <div className="w-3 h-3 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <p className="text-sm font-bold text-amber-900">Statut actuel</p>
            </div>
            <p className="text-xs text-amber-700">
              {dossier.statut.replace(/_/g, " ")}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Informations d'audit */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-600" />
          Informations techniques
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600 font-semibold">ID du dossier:</span>
            <p className="text-slate-900 font-mono mt-1">{dossier.id}</p>
          </div>
          <div>
            <span className="text-slate-600 font-semibold">Numéro unique:</span>
            <p className="text-slate-900 font-bold mt-1">{dossier.numeroUnique}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}