"use client";

import { useState } from "react";
import { useClientAudit } from "@/hooks/useClients";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, User, ChevronLeft, ChevronRight, Clock, Edit, Trash2, Plus } from "lucide-react";

interface ClientAuditProps {
  clientId: string;
}

export default function ClientAudit({ clientId }: ClientAuditProps) {
  const [page, setPage] = useState(0);
  const take = 20;

  const { data, isLoading } = useClientAudit(clientId, page * take, take);

  const audits = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / take);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getActionIcon = (action: string) => {
    if (action.includes("Création") || action.includes("Ajout")) {
      return <Plus className="w-4 h-4" />;
    }
    if (action.includes("Modification") || action.includes("Mise à jour")) {
      return <Edit className="w-4 h-4" />;
    }
    if (action.includes("Suppression")) {
      return <Trash2 className="w-4 h-4" />;
    }
    return <History className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes("Création") || action.includes("Ajout")) {
      return "bg-green-100 text-green-700";
    }
    if (action.includes("Modification") || action.includes("Mise à jour")) {
      return "bg-blue-100 text-blue-700";
    }
    if (action.includes("Suppression")) {
      return "bg-red-100 text-red-700";
    }
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <History className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Historique d&apos;audit</h3>
            <p className="text-sm text-slate-600">Toutes les modifications effectuées sur ce client</p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement de l&apos;historique...</p>
        </Card>
      ) : audits.length === 0 ? (
        <Card className="p-12 text-center">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun historique</h3>
          <p className="text-slate-600">Aucune action n&apos;a été enregistrée pour ce client.</p>
        </Card>
      ) : (
        <>
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-6">
              {audits.map((audit) => (
                <div key={audit.id} className="relative flex gap-6">
                  {/* Point sur la timeline */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${getActionColor(audit.action)}`}>
                    {getActionIcon(audit.action)}
                  </div>

                  {/* Contenu */}
                  <Card className="flex-1 p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{audit.action}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(audit.creeLe)}</span>
                          </div>
                          {audit.utilisateur && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>
                                {audit.utilisateur.prenom} {audit.utilisateur.nom}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Détails des modifications */}
                    {audit.ancienneValeur && audit.nouvelleValeur && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-2">Avant</p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <pre className="text-xs text-red-900 whitespace-pre-wrap font-mono">
                                {JSON.stringify(audit.ancienneValeur, null, 2)}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-2">Après</p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <pre className="text-xs text-green-900 whitespace-pre-wrap font-mono">
                                {JSON.stringify(audit.nouvelleValeur, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
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