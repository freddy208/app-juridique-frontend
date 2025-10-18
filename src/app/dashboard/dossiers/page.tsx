/**
 * Page Liste des Dossiers - VERSION ULTRA PREMIUM
 * Design professionnel avec modals customisées et tableau spacieux
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  Grid3x3,
  List,
  Eye,
  Edit,
  Archive,
  Trash2,
  RefreshCw,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  useDossiers,
  useDeleteDossier,
  useUpdateDossierStatut,
  usePermissions,
  useDebounce,
} from "@/hooks";
import type { Dossier, TypeDossier, StatutDossier } from "@/types/dossier.types";

// Types
type ViewMode = "list" | "grid";
type FilterState = {
  search: string;
  type?: TypeDossier;
  statut?: StatutDossier;
  responsableId?: string;
  clientId?: string;
  skip: number;
  take: number;
};

type ModalType = "delete" | "archive" | "bulkDelete" | "bulkArchive" | null;
type ModalData = {
  id?: string;
  titre?: string;
  count?: number;
};

export default function DossiersPage() {
  const router = useRouter();
  const { canWrite, canDelete } = usePermissions("dossiers");

  // États
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDossiers, setSelectedDossiers] = useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>({});
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    skip: 0,
    take: 25,
  });

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Query
  const { data, isLoading, refetch } = useDossiers({
    ...filters,
    search: debouncedSearch,
  });

  // Mutations
  const deleteMutation = useDeleteDossier();
  const updateStatutMutation = useUpdateDossierStatut();

  // Handlers
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, skip: 0 }));
  };

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, skip: 0 }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TypeDossier | "";
    handleFilterChange("type", value === "" ? undefined : value);
  };

  const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as StatutDossier | "";
    handleFilterChange("statut", value === "" ? undefined : value);
  };

  const handlePageChange = (newSkip: number) => {
    setFilters((prev) => ({ ...prev, skip: newSkip }));
  };

  // Modal handlers
  const openDeleteModal = (id: string, titre: string) => {
    setModalType("delete");
    setModalData({ id, titre });
    setShowActionsMenu(null);
  };

  const openArchiveModal = (id: string, titre: string) => {
    setModalType("archive");
    setModalData({ id, titre });
    setShowActionsMenu(null);
  };

  const openBulkDeleteModal = () => {
    setModalType("bulkDelete");
    setModalData({ count: selectedDossiers.length });
  };

  const openBulkArchiveModal = () => {
    setModalType("bulkArchive");
    setModalData({ count: selectedDossiers.length });
  };

  const closeModal = () => {
    setModalType(null);
    setModalData({});
  };

  const confirmDelete = async () => {
    if (!modalData.id) return;
    try {
      await deleteMutation.mutateAsync(modalData.id);
      closeModal();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const confirmArchive = async () => {
    if (!modalData.id) return;
    try {
      await updateStatutMutation.mutateAsync({
        id: modalData.id,
        statut: "ARCHIVE",
      });
      closeModal();
    } catch (error) {
      console.error("Erreur archivage:", error);
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedDossiers.map((id) => deleteMutation.mutateAsync(id))
      );
      setSelectedDossiers([]);
      closeModal();
    } catch (error) {
      console.error("Erreur suppression en masse:", error);
    }
  };

  const confirmBulkArchive = async () => {
    try {
      await Promise.all(
        selectedDossiers.map((id) =>
          updateStatutMutation.mutateAsync({ id, statut: "ARCHIVE" })
        )
      );
      setSelectedDossiers([]);
      closeModal();
    } catch (error) {
      console.error("Erreur archivage en masse:", error);
    }
  };

  const handleExport = () => {
    alert("🔄 Export en cours de développement...");
  };

  const toggleSelectDossier = (id: string) => {
    setSelectedDossiers((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDossiers.length === data?.data.length) {
      setSelectedDossiers([]);
    } else {
      setSelectedDossiers(data?.data.map((d: Dossier) => d.id) || []);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: undefined,
      statut: undefined,
      skip: 0,
      take: 25,
    });
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

  const getTypeBadge = (type: TypeDossier) => {
    const badges = {
      SINISTRE_CORPOREL: "bg-red-50 text-red-700 border-red-200",
      SINISTRE_MATERIEL: "bg-orange-50 text-orange-700 border-orange-200",
      SINISTRE_MORTEL: "bg-rose-50 text-rose-700 border-rose-200",
      IMMOBILIER: "bg-purple-50 text-purple-700 border-purple-200",
      SPORT: "bg-cyan-50 text-cyan-700 border-cyan-200",
      CONTRAT: "bg-indigo-50 text-indigo-700 border-indigo-200",
      CONTENTIEUX: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
      AUTRE: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return badges[type] || badges.AUTRE;
  };

  const hasActiveFilters = filters.type || filters.statut || filters.search;
  const totalCount = data?.total ?? data?.data?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/50 space-y-6 pb-8">
      {/* Modals */}
      <ConfirmModal
        isOpen={modalType === "delete"}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Supprimer le dossier"
        message={`Êtes-vous sûr de vouloir supprimer définitivement le dossier "${modalData.titre}" ?`}
        confirmText="Supprimer"
        type="danger"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={modalType === "archive"}
        onClose={closeModal}
        onConfirm={confirmArchive}
        title="Archiver le dossier"
        message={`Voulez-vous archiver le dossier "${modalData.titre}" ?`}
        confirmText="Archiver"
        type="warning"
        isLoading={updateStatutMutation.isPending}
      />

      <ConfirmModal
        isOpen={modalType === "bulkDelete"}
        onClose={closeModal}
        onConfirm={confirmBulkDelete}
        title="Suppression multiple"
        message={`Êtes-vous sûr de vouloir supprimer ${modalData.count} dossier${
          (modalData.count ?? 0) > 1 ? "s" : ""
        } ?`}
        confirmText="Supprimer tout"
        type="danger"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={modalType === "bulkArchive"}
        onClose={closeModal}
        onConfirm={confirmBulkArchive}
        title="Archivage multiple"
        message={`Voulez-vous archiver ${modalData.count} dossier${
          (modalData.count ?? 0) > 1 ? "s" : ""
        } ?`}
        confirmText="Archiver tout"
        type="warning"
        isLoading={updateStatutMutation.isPending}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <FileText className="w-8 h-8 text-slate-600" />
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              Dossiers
            </h1>
          </motion.div>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-600 flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg font-bold text-amber-900 border border-amber-200">
                {totalCount}
              </span>
              <span>
                dossier{totalCount !== 1 ? "s" : ""} au total
              </span>
            </p>
            <button
              onClick={() => router.push("/dashboard/dossiers/archives")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-sm font-semibold transition-all border border-slate-200"
            >
              📦 Archives
            </button>
          </div>
        </div>

        {canWrite && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard/dossiers/nouveau")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau dossier</span>
          </motion.button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par numéro, titre ou client..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                  : "bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-xs font-bold">
                  ✓
                </span>
              )}
            </button>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vue grille"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => refetch()}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              title="Actualiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type de dossier
                  </label>
                  <select
                    value={filters.type || ""}
                    onChange={handleTypeChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="">Tous les types</option>
                    <option value="SINISTRE_CORPOREL">🩹 Sinistre corporel</option>
                    <option value="SINISTRE_MATERIEL">🚗 Sinistre matériel</option>
                    <option value="SINISTRE_MORTEL">⚰️ Sinistre mortel</option>
                    <option value="IMMOBILIER">🏠 Immobilier</option>
                    <option value="SPORT">⚽ Sport</option>
                    <option value="CONTRAT">📄 Contrat</option>
                    <option value="CONTENTIEUX">⚖️ Contentieux</option>
                    <option value="AUTRE">📋 Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={filters.statut || ""}
                    onChange={handleStatutChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="OUVERT">🔵 Ouvert</option>
                    <option value="EN_COURS">🟡 En cours</option>
                    <option value="CLOS">🟢 Clos</option>
                    <option value="ARCHIVE">⚪ Archivé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Résultats par page
                  </label>
                  <select
                    value={filters.take}
                    onChange={(e) =>
                      handleFilterChange("take", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Réinitialiser les filtres</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDossiers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-amber-700" />
              <span className="text-sm font-bold text-amber-900">
                {selectedDossiers.length} dossier
                {selectedDossiers.length > 1 ? "s" : ""} sélectionné
                {selectedDossiers.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openBulkArchiveModal}
                disabled={updateStatutMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-900 text-sm font-semibold hover:bg-blue-200 transition-all disabled:opacity-50"
              >
                <Archive className="w-4 h-4" />
                <span>Archiver</span>
              </button>
              {canDelete && (
                <button
                  onClick={openBulkDeleteModal}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-900 text-sm font-semibold hover:bg-red-200 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              )}
              <button
                onClick={() => setSelectedDossiers([])}
                className="p-2 rounded-lg hover:bg-amber-200 transition-all"
              >
                <XCircle className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-semibold">Chargement des dossiers...</p>
        </div>
      ) : viewMode === "list" ? (
        <ListeView
          dossiers={data?.data || []}
          selectedDossiers={selectedDossiers}
          toggleSelectDossier={toggleSelectDossier}
          toggleSelectAll={toggleSelectAll}
          getStatutBadge={getStatutBadge}
          getTypeBadge={getTypeBadge}
          openDeleteModal={openDeleteModal}
          openArchiveModal={openArchiveModal}
          canDelete={canDelete}
          canWrite={canWrite}
          router={router}
          showActionsMenu={showActionsMenu}
          setShowActionsMenu={setShowActionsMenu}
        />
      ) : (
        <GridView
          dossiers={data?.data || []}
          getStatutBadge={getStatutBadge}
          getTypeBadge={getTypeBadge}
          router={router}
        />
      )}

      {data && totalCount > filters.take && (
        <Pagination
          total={totalCount}
          skip={filters.skip}
          take={filters.take}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

// CONFIRM MODAL
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type: "danger" | "warning";
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type,
  isLoading,
}: ConfirmModalProps) {
  const colors = {
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700",
    },
  };

  const style = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className={`${style.bg} ${style.border} border-b p-6`}>
                <div className="flex items-start gap-4">
                  <div className={`${style.bg} p-3 rounded-xl`}>
                    <AlertTriangle className={`w-6 h-6 ${style.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {message}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex items-center gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50 ${style.button} shadow-lg`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Traitement...
                    </span>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// LIST VIEW
interface StatutBadge {
  class: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface ListeViewProps {
  dossiers: Dossier[];
  selectedDossiers: string[];
  toggleSelectDossier: (id: string) => void;
  toggleSelectAll: () => void;
  getStatutBadge: (statut: StatutDossier) => StatutBadge;
  getTypeBadge: (type: TypeDossier) => string;
  openDeleteModal: (id: string, titre: string) => void;
  openArchiveModal: (id: string, titre: string) => void;
  canDelete: boolean;
  canWrite: boolean;
  router: ReturnType<typeof useRouter>;
  showActionsMenu: string | null;
  setShowActionsMenu: (id: string | null) => void;
}

function ListeView({
  dossiers,
  selectedDossiers,
  toggleSelectDossier,
  toggleSelectAll,
  getStatutBadge,
  getTypeBadge,
  openDeleteModal,
  openArchiveModal,
  canDelete,
  canWrite,
  router,
  showActionsMenu,
  setShowActionsMenu,
}: ListeViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-12" />
            <col className="w-32" />
            <col className="w-64" />
            <col className="w-48" />
            <col className="w-52" />
            <col className="w-40" />
            <col className="w-48" />
            <col className="w-40" />
            <col className="w-32" />
          </colgroup>
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedDossiers.length === dossiers.length && dossiers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-600 cursor-pointer"
                />
              </th>
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
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dossiers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold mb-2">Aucun dossier trouvé</p>
                  <p className="text-sm text-slate-400">Essayez de modifier vos filtres de recherche</p>
                </td>
              </tr>
            ) : (
              dossiers.map((dossier: Dossier, index: number) => {
                const statutBadge = getStatutBadge(dossier.statut);
                const StatutIcon = statutBadge.icon;

                return (
                  <motion.tr
                    key={dossier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/dashboard/dossiers/${dossier.id}`)}
                  >
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedDossiers.includes(dossier.id)}
                        onChange={() => toggleSelectDossier(dossier.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                          #{dossier.numeroUnique}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                        {dossier.titre}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate">
                          {dossier.client?.prenom} {dossier.client?.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${getTypeBadge(
                          dossier.type
                        )}`}
                      >
                        {dossier.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${statutBadge.class}`}
                      >
                        <StatutIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        {dossier.statut.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {dossier.responsable ? (
                        <span className="text-sm text-slate-700 truncate block">
                          {dossier.responsable.prenom} {dossier.responsable.nom}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 italic whitespace-nowrap">
                          Non assigné
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {new Date(dossier.creeLe).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/dossiers/${dossier.id}`)}
                          className="p-2 rounded-lg hover:bg-blue-100 transition-colors group/btn"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4 text-slate-600 group-hover/btn:text-blue-700" />
                        </button>

                        {canWrite && (
                          <button
                            onClick={() =>
                              router.push(`/dashboard/dossiers/${dossier.id}/modifier`)
                            }
                            className="p-2 rounded-lg hover:bg-amber-100 transition-colors group/btn"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 text-slate-600 group-hover/btn:text-amber-700" />
                          </button>
                        )}

                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionsMenu(
                                showActionsMenu === dossier.id ? null : dossier.id
                              )
                            }
                            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                            title="Plus d'actions"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>

                          <AnimatePresence>
                            {showActionsMenu === dossier.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                              >
                                <button
                                  onClick={() =>
                                    openArchiveModal(dossier.id, dossier.titre)
                                  }
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                                >
                                  <Archive className="w-4 h-4" />
                                  <span>Archiver</span>
                                </button>

                                {canDelete && (
                                  <button
                                    onClick={() =>
                                      openDeleteModal(dossier.id, dossier.titre)
                                    }
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
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// GRID VIEW
interface GridViewProps {
  dossiers: Dossier[];
  getStatutBadge: (statut: StatutDossier) => StatutBadge;
  getTypeBadge: (type: TypeDossier) => string;
  router: ReturnType<typeof useRouter>;
}

function GridView({ dossiers, getStatutBadge, getTypeBadge, router }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dossiers.length === 0 ? (
        <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold mb-2">Aucun dossier trouvé</p>
          <p className="text-sm text-slate-400">Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        dossiers.map((dossier: Dossier, index: number) => {
          const statutBadge = getStatutBadge(dossier.statut);
          const StatutIcon = statutBadge.icon;

          return (
            <motion.div
              key={dossier.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer"
              onClick={() => router.push(`/dashboard/dossiers/${dossier.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-500">
                    #{dossier.numeroUnique}
                  </span>
                </div>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${statutBadge.class}`}
                >
                  <StatutIcon className="w-3.5 h-3.5" />
                  {dossier.statut.replace(/_/g, " ")}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 min-h-[56px]">
                {dossier.titre}
              </h3>

              <span
                className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border mb-4 ${getTypeBadge(
                  dossier.type
                )}`}
              >
                {dossier.type.replace(/_/g, " ")}
              </span>

              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">
                  {dossier.client?.prenom?.[0]}
                  {dossier.client?.nom?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {dossier.client?.prenom} {dossier.client?.nom}
                  </p>
                  <p className="text-xs text-slate-500">Client</p>
                </div>
              </div>

              {dossier.responsable ? (
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs text-slate-600 truncate">
                    <span className="font-semibold">Responsable:</span>{" "}
                    {dossier.responsable.prenom} {dossier.responsable.nom}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-orange-600 font-semibold">Non assigné</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(dossier.creeLe).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-amber-700 hover:text-amber-800 text-sm font-bold flex items-center gap-1">
                  Détails
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </span>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

// PAGINATION
interface PaginationProps {
  total: number;
  skip: number;
  take: number;
  onPageChange: (newSkip: number) => void;
}

function Pagination({ total, skip, take, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / take);
  const currentPage = Math.floor(skip / take) + 1;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-semibold">
            Affichage {skip + 1} à {Math.min(skip + take, total)}
          </span>
          <span>sur</span>
          <span className="px-2 py-1 bg-slate-100 rounded-lg font-bold text-slate-900">
            {total}
          </span>
          <span>résultats</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, skip - take))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange((Number(page) - 1) * take)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentPage === page
                      ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <div className="md:hidden px-4 py-2 text-sm font-semibold text-slate-900">
            Page {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => onPageChange(skip + take)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}