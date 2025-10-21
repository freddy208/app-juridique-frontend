"use client";

import { useState } from "react";
import { useClients, useBulkDeleteClients, useExportClients } from "@/hooks/useClients";
import { ClientFilters } from "@/types/client.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Download, Grid3x3, List, Trash2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ClientsTable from "../components/clients/ClientsTable";
import ClientsCards from "../components/clients/ClientsCards";
import BulkDeleteDialog from "../components/clients/dialogs/BulkDeleteDialog";

export default function ClientsPage() {
  const router = useRouter();
  
  // États
  const [view, setView] = useState<"table" | "cards">("table");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [search, setSearch] = useState("");
  
  // Filtres
  const [filters, setFilters] = useState<ClientFilters>({
    skip: 0,
    take: 10,
  });

  // Queries & Mutations
  const { data, isLoading, refetch } = useClients(filters);
  const bulkDeleteMutation = useBulkDeleteClients();
  const exportMutation = useExportClients();

  // Calculs des stats
  const clients = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const activeClients = clients.filter(c => c.statut === "ACTIF").length;
  const vipClients = clients.filter(c => {
    const ca = c.factures?.reduce((sum, f) => sum + Number(f.montant), 0) || 0;
    return ca > 1000000;
  }).length;

  // Handlers
  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters(prev => ({ ...prev, search: value, skip: 0 }));
  };

  const handleExport = async () => {
    try {
      toast.loading("Export en cours...");
      const data = await exportMutation.mutateAsync(filters);
      
      // Créer CSV
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clients-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      
      toast.dismiss();
      toast.success("Export réussi !");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.dismiss();
      toast.error("Erreur lors de l'export");
    }
  };

// Fonction utilitaire pour convertir en CSV
const convertToCSV = <T extends object>(data: T[]): string => {
  if (data.length === 0) return "";

  // Récupérer les clés de l'objet
  const headers = Object.keys(data[0]) as (keyof T)[];
  
  // Échapper les valeurs CSV
  const escapeCSV = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csvRows = data.map(row =>
    headers.map(header => escapeCSV(row[header])).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
};


  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedClients);
      toast.success(`${selectedClients.length} client(s) supprimé(s)`);
      setSelectedClients([]);
      setShowBulkDelete(false);
      refetch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePageChange = (newSkip: number) => {
    setFilters(prev => ({ ...prev, skip: newSkip }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Clients
            </h1>
            <p className="text-slate-600 mt-1">
              Gérez vos clients et leurs dossiers
            </p>
          </div>
          
          <Button
            onClick={() => router.push("/dashboard/clients/nouveau")}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau client
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Actifs</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{activeClients}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Inactifs</p>
                <p className="text-2xl font-bold text-slate-500 mt-1">
                  {totalCount - activeClients}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-slate-400" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">VIP</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{vipClients}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="p-4 border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, email, téléphone, entreprise..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={filters.statut || "all"}
                onValueChange={(value: "all" | "ACTIF" | "INACTIF") =>
                  setFilters(prev => ({
                    ...prev,
                    statut: value === "all" ? undefined : value ,
                    skip: 0,
                  }))
                }
              >
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="ACTIF">Actifs</SelectItem>
                  <SelectItem value="INACTIF">Inactifs</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="lg" onClick={handleExport} disabled={exportMutation.isPending}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>

              <Button variant="outline" size="lg" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>

              <div className="flex border border-slate-300 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setView("table")}
                  className={view === "table" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setView("cards")}
                  className={view === "cards" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>

              {selectedClients.length > 0 && (
                <Button variant="destructive" size="lg" onClick={() => setShowBulkDelete(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer ({selectedClients.length})
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Contenu */}
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600">Chargement des clients...</p>
            </div>
          </Card>
        ) : view === "table" ? (
          <ClientsTable
            clients={clients}
            selectedClients={selectedClients}
            onSelectionChange={setSelectedClients}
            onPageChange={handlePageChange}
            pagination={{
              skip: filters.skip || 0,
              take: filters.take || 10,
              total: totalCount,
            }}
          />
        ) : (
          <ClientsCards
            clients={clients}
            selectedClients={selectedClients}
            onSelectionChange={setSelectedClients}
          />
        )}

        {/* Dialog suppression */}
        <BulkDeleteDialog
          open={showBulkDelete}
          onOpenChange={setShowBulkDelete}
          count={selectedClients.length}
          onConfirm={handleBulkDelete}
          isLoading={bulkDeleteMutation.isPending}
        />
      </div>
    </div>
  );
}