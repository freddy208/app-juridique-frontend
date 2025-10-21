"use client";

import { useState } from "react";
import { useClientNotes, useAddClientNote } from "@/hooks/useClients";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from  "@/components/ui/textarea";
import { Label } from  "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, FileText, ChevronLeft, ChevronRight, User } from "lucide-react";
import { toast } from "sonner";

interface ClientNotesProps {
  clientId: string;
}

export default function ClientNotes({ clientId }: ClientNotesProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const take = 10;

  const { data, isLoading } = useClientNotes(clientId, page * take, take);
  const addMutation = useAddClientNote();

  const [noteContent, setNoteContent] = useState("");

  const notes = data?.data || [];
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

  const handleAdd = async () => {
    if (!noteContent.trim()) {
      toast.error("Veuillez saisir une note");
      return;
    }

    try {
      await addMutation.mutateAsync({
        clientId,
        contenu: noteContent,
      });
      toast.success("Note ajoutée avec succès");
      setShowAddDialog(false);
      setNoteContent("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const filteredNotes = notes.filter(note =>
    search === "" || note.contenu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher une note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une note
          </Button>
        </div>
      </Card>

      {/* Liste des notes */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des notes...</p>
        </Card>
      ) : filteredNotes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune note</h3>
          <p className="text-slate-600 mb-6">Aucune note n&apos;a été ajoutée pour ce client.</p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la première note
          </Button>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <Card key={note.id} className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                    {note.utilisateur ? (
                      <>
                        {note.utilisateur.prenom[0]}
                        {note.utilisateur.nom[0]}
                      </>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {note.utilisateur && (
                          <span className="font-semibold text-slate-900">
                            {note.utilisateur.prenom} {note.utilisateur.nom}
                          </span>
                        )}
                        <span className="text-sm text-slate-500">{formatDate(note.creeLe)}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{note.contenu}</p>
                    {note.dossier && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                          Lié au dossier: <span className="font-medium text-slate-700">{note.dossier.titre}</span>
                        </p>
                      </div>
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
            <DialogTitle>Ajouter une note interne</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="note-content">Note</Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={6}
                placeholder="Saisissez votre note..."
                className="resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                Cette note sera visible uniquement par l&apos;équipe interne.
              </p>
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