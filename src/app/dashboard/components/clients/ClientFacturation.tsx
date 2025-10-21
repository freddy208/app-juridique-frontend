"use client";

import { useState } from "react";
import { useClientFactures } from "@/hooks/useClients";
import { ClientFacture } from "@/types/client.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClientFacturationProps {
  clientId: string;
}

export default function ClientFacturation({ clientId }: ClientFacturationProps) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const take = 10;

  const { data, isLoading } = useClientFactures(clientId, page * take, take);

  const factures = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / take);

  const totalCA = factures.reduce((sum, f) => sum + Number(f.montant), 0);
  const totalPaid = factures.filter(f => f.payee).reduce((sum, f) => sum + Number(f.montant), 0);
  const totalUnpaid = totalCA - totalPaid;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatutBadge = (facture: ClientFacture) => {
    if (facture.payee) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="w-3.5 h-3.5" />
          Payée
        </span>
      );
    }
    
    const isOverdue = new Date(facture.dateEcheance) < new Date();
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <XCircle className="w-3.5 h-3.5" />
          En retard
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <XCircle className="w-3.5 h-3.5" />
        En attente
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">CA Total</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalCA)}</p>
          <p className="text-xs text-slate-500 mt-2">{factures.length} facture(s)</p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">Payé</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-slate-500 mt-2">{factures.filter(f => f.payee).length} facture(s)</p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">Impayé</p>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalUnpaid)}</p>
          <p className="text-xs text-slate-500 mt-2">{factures.filter(f => !f.payee).length} facture(s)</p>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex justify-end">
          <Button
            onClick={() => router.push(`/dashboard/factures/nouveau?clientId=${clientId}`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </Card>

      {/* Liste des factures */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement des factures...</p>
        </Card>
      ) : factures.length === 0 ? (
        <Card className="p-12 text-center">
          <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune facture</h3>
          <p className="text-slate-600 mb-6">Ce client n&apos;a pas encore de facture.</p>
          <Button
            onClick={() => router.push(`/dashboard/factures/nouveau?clientId=${clientId}`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer la première facture
          </Button>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Référence</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Dossier</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Montant</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Échéance</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Statut</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {factures.map(facture => (
                    <tr key={facture.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">FAC-{facture.id.substring(0, 8)}</p>
                      </td>
                      <td className="px-4 py-4">
                        {facture.dossier ? (
                          <div>
                            <p className="font-medium text-slate-900">{facture.dossier.titre}</p>
                            <p className="text-xs text-slate-500">{facture.dossier.numeroUnique}</p>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(Number(facture.montant))}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-900 whitespace-nowrap">{formatDate(facture.dateEcheance)}</p>
                      </td>
                      <td className="px-4 py-4">
                        {getStatutBadge(facture)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

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