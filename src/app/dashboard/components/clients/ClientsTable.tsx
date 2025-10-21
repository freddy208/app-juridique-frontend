"use client";

import { Client } from "@/types/client.types";
import { 
  Building2, Mail, Phone, MoreVertical, Eye, Edit, Trash2,
  CheckCircle2, XCircle, Crown, FileText, ChevronLeft, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientsTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectionChange: (ids: string[]) => void;
  onPageChange: (skip: number) => void;
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

export default function ClientsTable({
  clients,
  selectedClients,
  onSelectionChange,
  onPageChange,
  pagination,
}: ClientsTableProps) {
  const router = useRouter();

  const calculateCA = (client: Client) => {
    return client.factures?.reduce((sum, f) => sum + Number(f.montant), 0) || 0;
  };

  const isVIP = (ca: number) => ca > 1000000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleSelection = (id: string) => {
    if (selectedClients.includes(id)) {
      onSelectionChange(selectedClients.filter(cid => cid !== id));
    } else {
      onSelectionChange([...selectedClients, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(clients.map(c => c.id));
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.take);
  const currentPage = Math.floor(pagination.skip / pagination.take) + 1;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="w-12 px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedClients.length === clients.length && clients.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                />
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Client</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Contact</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Statut</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Dossiers</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase">CA Total</th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map(client => {
              const ca = calculateCA(client);
              const vip = isVIP(ca);

              return (
                <tr key={client.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleSelection(client.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg flex-shrink-0">
                        {client.prenom?.[0] || client.nom[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 truncate whitespace-nowrap">
                            {client.prenom} {client.nom}
                          </p>
                          {vip && <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                        </div>
                        {client.nomEntreprise && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <p className="text-sm text-slate-600 truncate whitespace-nowrap">{client.nomEntreprise}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-1.5">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 truncate whitespace-nowrap">{client.email}</span>
                        </div>
                      )}
                      {client.telephone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 whitespace-nowrap">{client.telephone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      client.statut === "ACTIF"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {client.statut === "ACTIF" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {client.statut}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{client._count?.dossiers || 0}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`font-bold whitespace-nowrap ${vip ? "text-amber-600" : "text-slate-900"}`}>
                      {formatCurrency(ca)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/clients/${client.id}/modifier`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Affichage de <span className="font-semibold">{pagination.skip + 1}</span> à{" "}
            <span className="font-semibold">
              {Math.min(pagination.skip + pagination.take, pagination.total)}
            </span>{" "}
            sur <span className="font-semibold">{pagination.total}</span> clients
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(0, pagination.skip - pagination.take))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="px-4 py-2 text-sm font-medium text-slate-700">
              Page {currentPage} sur {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.skip + pagination.take)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}