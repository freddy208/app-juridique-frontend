"use client";

import { useState } from "react";
import { useClientDocuments } from "@/hooks/useClients";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  Search, File, Download, Eye, Upload, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClientDocumentsProps {
  clientId: string;
}

export default function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const take = 10;

  const { data, isLoading } = useClientDocuments(clientId, page * take, take);

  const documents = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / take);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }

    // Simuler l'upload
    toast.success(`${selectedFiles.length} document(s) téléversé(s)`);
    setShowUploadDialog(false);
    setSelectedFiles([]);
  };

  const filteredDocuments = documents.filter(doc =>
    search === "" ||
    doc.titre.toLowerCase().includes(search.toLowerCase()) ||
    doc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Upload className="w-4 h-4 mr-2" />
                Téléverser
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Téléverser des documents</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all">
                  <input
                    type="file"
                    id="doc-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-slate-900 font-semibold mb-1">Cliquez pour téléverser</p>
                    <p className="text-sm text-slate-600">PDF, JPG, PNG, DOC (Max 10 MB)</p>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{file.name}</p>
                            <p className="text-xs text-slate-600">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
                    Téléverser {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Liste des documents */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des documents...</p>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card className="p-12 text-center">
          <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun document</h3>
          <p className="text-slate-600 mb-6">Aucun document n&apos;a été téléversé pour ce client.</p>
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Téléverser le premier document
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(document => (
              <Card
                key={document.id}
                className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <File className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(document.creeLe)}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 truncate">{document.titre}</h3>
                <p className="text-sm text-slate-600 mb-4">{document.type}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
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