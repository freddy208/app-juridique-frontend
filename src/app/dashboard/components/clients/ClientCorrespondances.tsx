"use client";

import { useState } from "react";
import { useClientCorrespondances, useAddClientCorrespondance } from "@/hooks/useClients";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Phone, Mail, Calendar, MessageSquare, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ClientCorrespondancesProps {
  clientId: string;
}

type TypeCorrespondance = "APPEL" | "EMAIL" | "RENDEZ_VOUS" | "AUTRE";

export default function ClientCorrespondances({ clientId }: ClientCorrespondancesProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const take = 10;

  const { data, isLoading } = useClientCorrespondances(clientId, page * take, take);
  const addMutation = useAddClientCorrespondance();

  const [formData, setFormData] = useState<{
    type: TypeCorrespondance;
    contenu: string;
  }>({
    type: "APPEL",
    contenu: "",
  });

  const correspondances = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / take);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "APPEL":
        return <Phone className="w-5 h-5" />;
      case "EMAIL":
        return <Mail className="w-5 h-5" />;
      case "RENDEZ_VOUS":
        return <Calendar className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "APPEL":
        return "bg-blue-100 text-blue-700";
      case "EMAIL":
        return "bg-purple-100 text-purple-700";
      case "RENDEZ_VOUS":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as TypeCorrespondance }));
  };

  const handleAdd = async () => {
    if (!formData.contenu.trim()) {
      toast.error("Veuillez saisir un contenu");
      return;
    }

    try {
      await addMutation.mutateAsync({
        clientId,
        data: formData,
      });
      toast.success("Correspondance ajoutée avec succès");
      setShowAddDialog(false);
      setFormData({ type: "APPEL", contenu: "" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const filteredCorrespondances = correspondances.filter(corresp => {
    const matchesSearch = search === "" || 
      corresp.contenu?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || corresp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher une correspondance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="APPEL">Appels</SelectItem>
                <SelectItem value="EMAIL">Emails</SelectItem>
                <SelectItem value="RENDEZ_VOUS">Rendez-vous</SelectItem>
                <SelectItem value="AUTRE">Autre</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>
      </Card>

      {/* Liste des correspondances */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des correspondances...</p>
        </Card>
      ) : filteredCorrespondances.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune correspondance</h3>
          <p className="text-slate-600 mb-6">Aucune correspondance n&apos;a été enregistrée pour ce client.</p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la première correspondance
          </Button>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filteredCorrespondances.map(corresp => (
              <Card key={corresp.id} className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(corresp.type)}`}>
                    {getTypeIcon(corresp.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(corresp.type)}`}>
                          {corresp.type.replace("_", " ")}
                        </span>
                        <span className="text-sm text-slate-600">{formatDate(corresp.creeLe)}</span>
                      </div>
                    </div>
                    <p className="text-slate-900 mb-2">{corresp.contenu || "Aucun contenu"}</p>
                    {corresp.utilisateur && (
                      <p className="text-sm text-slate-500">
                        Par {corresp.utilisateur.prenom} {corresp.utilisateur.nom}
                      </p>
                    )}
                  </div>
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

      {/* Dialog Ajouter */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une correspondance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPEL">Appel téléphonique</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="RENDEZ_VOUS">Rendez-vous</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contenu">Contenu</Label>
              <Textarea
                id="contenu"
                value={formData.contenu}
                onChange={(e) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
                rows={4}
                placeholder="Décrivez la correspondance..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {addMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Ajout...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}