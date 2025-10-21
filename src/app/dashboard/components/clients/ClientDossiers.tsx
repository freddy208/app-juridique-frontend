"use client";

import { useState } from "react";
import { useClientDossiers } from "@/hooks/useClients";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, FileText, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatutDossier, TypeDossier } from "@/types/client.types";

interface ClientDossiersProps {
  clientId: string;
}

export default function ClientDossiers({ clientId }: ClientDossiersProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState<StatutDossier | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TypeDossier | "all">("all");
  const [page, setPage] = useState(0);
  const take = 10;

  const { data, isLoading } = useClientDossiers(clientId, page * take, take);

  const dossiers = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / take);

  const getStatutBadge = (statut: string) => {
    const colors = {
      OUVERT: "bg-blue-100 text-blue-700",
      EN_COURS: "bg-amber-100 text-amber-700",
      CLOS: "bg-green-100 text-green-700",
      ARCHIVE: "bg-slate-100 text-slate-700",
    };
    return colors[statut as keyof typeof colors] || "bg-slate-100 text-slate-700";
  };

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = search === "" || 
      dossier.numeroUnique.toLowerCase().includes(search.toLowerCase()) ||
      dossier.titre.toLowerCase().includes(search.toLowerCase());
    const matchesStatut = statutFilter === "all" || dossier.statut === statutFilter;
    const matchesType = typeFilter === "all" || dossier.type === typeFilter;
    return matchesSearch && matchesStatut && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher un dossier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statutFilter} onValueChange={(v) => setStatutFilter(v as "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="OUVERT">Ouvert</SelectItem>
                <SelectItem value="EN_COURS">En cours</SelectItem>
                <SelectItem value="CLOS">Clos</SelectItem>
                <SelectItem value="ARCHIVE">Archivé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="SINISTRE_CORPOREL">Sinistre corporel</SelectItem>
                <SelectItem value="SINISTRE_MATERIEL">Sinistre matériel</SelectItem>
                <SelectItem value="SINISTRE_MORTEL">Sinistre mortel</SelectItem>
                <SelectItem value="IMMOBILIER">Immobilier</SelectItem>
                <SelectItem value="SPORT">Sport</SelectItem>
                <SelectItem value="CONTRAT">Contrat</SelectItem>
                <SelectItem value="CONTENTIEUX">Contentieux</SelectItem>
                <SelectItem value="AUTRE">Autre</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => router.push(`/dashboard/dossiers/nouveau?clientId=${clientId}`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau dossier
            </Button>
          </div>
        </div>
      </Card>

      {/* Liste des dossiers */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des dossiers...</p>
        </Card>
      ) : filteredDossiers.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun dossier</h3>
          <p className="text-slate-600 mb-6">Ce client n&apos;a pas encore de dossier.</p>
          <Button
            onClick={() => router.push(`/dashboard/dossiers/nouveau?clientId=${clientId}`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer le premier dossier
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {filteredDossiers.map(dossier => (
              <Card
                key={dossier.id}
                className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/dossiers/${dossier.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900 text-lg truncate">
                          {dossier.titre}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatutBadge(dossier.statut)}`}>
                          {dossier.statut.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {dossier.numeroUnique} • {dossier.type.replace("_", " ")}
                      </p>
                      {dossier.description && (
                        <p className="text-sm text-slate-500 line-clamp-2">{dossier.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/dossiers/${dossier.id}`);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600">
                Page {page + 1} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}