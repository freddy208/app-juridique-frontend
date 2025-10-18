/**
 * Page Dossiers Archivés - VERSION AMÉLIORÉE
 * Liste des dossiers archivés avec possibilité de restaurer
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  Trash2,
  Eye,
  Archive,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  useDossiers,
  useUpdateDossierStatut,
  useDeleteDossier,
  useIsAdmin,
  usePermissions,
} from "@/hooks";
import { Dossier } from "@/types/dossier.types";

export default function DossiersArchivesPage() {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const { canWrite, canDelete } = usePermissions("dossiers");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useDossiers({ statut: "ARCHIVE" });
  const updateStatutMutation = useUpdateDossierStatut();
  const deleteMutation = useDeleteDossier();

  // Filtrage
  const filteredDossiers = data?.data.filter((dossier: Dossier) => {
    const matchSearch =
      dossier.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.numeroUnique.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${dossier.client?.prenom} ${dossier.client?.nom}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchType = selectedType === "ALL" || dossier.type === selectedType;

    return matchSearch && matchType;
  });

  const handleRestore = async (id: string, titre: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir restaurer le dossier "${titre}" ?`))
      return;
    try {
      await updateStatutMutation.mutateAsync({ id, statut: "EN_COURS" });
      alert("✅ Dossier restauré avec succès !");
    } catch (error) {
      console.error("Erreur restauration:", error);
      alert("❌ Erreur lors de la restauration");
    }
  };

  const handleDeletePermanent = async (id: string, titre: string) => {
    if (
      !confirm(
        `⚠️ ATTENTION : Voulez-vous SUPPRIMER DÉFINITIVEMENT le dossier "${titre}" ?\n\nCette action est IRRÉVERSIBLE et effacera :\n- Le dossier\n- Tous les documents\n- Toutes les tâches\n- Tout l'historique\n\nTapez "SUPPRIMER" pour confirmer.`
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(id);
      alert("✅ Dossier supprimé définitivement");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const typesOptions = [
    { value: "ALL", label: "Tous les types" },
    { value: "SINISTRE_CORPOREL", label: "Sinistre corporel" },
    { value: "SINISTRE_MATERIEL", label: "Sinistre matériel" },
    { value: "SINISTRE_MORTEL", label: "Sinistre mortel" },
    { value: "IMMOBILIER", label: "Immobilier" },
    { value: "SPORT", label: "Sport" },
    { value: "CONTRAT", label: "Contrat" },
    { value: "CONTENTIEUX", label: "Contentieux" },
    { value: "AUTRE", label: "Autre" },
  ];

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

        <div className="flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <Archive className="w-8 h-8 text-slate-600" />
              <h1 className="text-3xl font-serif font-bold text-slate-900">
                Dossiers archivés
              </h1>
            </motion.div>
            <p className="text-slate-600 mt-2 flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-100 rounded-lg font-bold text-slate-900">
                {filteredDossiers?.length || 0}
              </span>
              <span>
                dossier{(filteredDossiers?.length || 0) !== 1 ? "s" : ""}{" "}
                archivé{(filteredDossiers?.length || 0) !== 1 ? "s" : ""}
              </span>
            </p>
          </div>

          {/* Actions rapides */}
          {canWrite && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/dossiers")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
              >
                Dossiers actifs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par numéro, titre ou client..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
              showFilters
                ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                : "bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-slate-200"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Filtres étendus */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Type de dossier
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full lg:w-1/3 px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                >
                  {typesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info admin */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-900 mb-1">
              Mode Administrateur
            </p>
            <p className="text-sm text-red-800">
              Vous pouvez supprimer définitivement les dossiers archivés. Cette
              action est <strong>irréversible</strong> et effacera toutes les
              données liées au dossier.
            </p>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-semibold">
            Chargement des dossiers archivés...
          </p>
        </div>
      ) : !filteredDossiers || filteredDossiers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold mb-2">
            {searchTerm || selectedType !== "ALL"
              ? "Aucun dossier archivé ne correspond à vos critères"
              : "Aucun dossier archivé"}
          </p>
          {(searchTerm || selectedType !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("ALL");
              }}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Date archivage
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDossiers.map((dossier: Dossier, index: number) => (
                  <motion.tr
                    key={dossier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900">
                          #{dossier.numeroUnique}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {dossier.titre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">
                          {dossier.client?.prenom} {dossier.client?.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                        {dossier.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(dossier.modifieLe).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/dossiers/${dossier.id}`)
                          }
                          className="p-2 rounded-lg hover:bg-blue-100 transition-colors group"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4 text-slate-600 group-hover:text-blue-700" />
                        </button>

                        {canWrite && (
                          <button
                            onClick={() =>
                              handleRestore(dossier.id, dossier.titre)
                            }
                            disabled={updateStatutMutation.isPending}
                            className="p-2 rounded-lg hover:bg-green-100 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Restaurer le dossier"
                          >
                            <RotateCcw className="w-4 h-4 text-slate-600 group-hover:text-green-700" />
                          </button>
                        )}

                        {isAdmin && canDelete && (
                          <button
                            onClick={() =>
                              handleDeletePermanent(dossier.id, dossier.titre)
                            }
                            disabled={deleteMutation.isPending}
                            className="p-2 rounded-lg hover:bg-red-100 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-red-700" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistiques en bas */}
      {filteredDossiers && filteredDossiers.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Archive className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {filteredDossiers.length}
                </p>
                <p className="text-sm text-slate-600 font-semibold">
                  Dossiers archivés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    filteredDossiers.filter((d: Dossier) => d.statut === "CLOS")
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600 font-semibold">
                  Dossiers clos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(filteredDossiers.map((d: Dossier) => d.type)).size}
                </p>
                <p className="text-sm text-slate-600 font-semibold">
                  Types différents
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}