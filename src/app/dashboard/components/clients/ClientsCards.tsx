"use client";

import { Client } from "@/types/client.types";
import { Building2, Mail, Phone, Eye, Edit, CheckCircle2, XCircle, Crown, FileText, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ClientsCardsProps {
  clients: Client[];
  selectedClients: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function ClientsCards({
  clients,
  selectedClients,
  onSelectionChange,
}: ClientsCardsProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map(client => {
        const ca = calculateCA(client);
        const vip = isVIP(ca);
        const isSelected = selectedClients.includes(client.id);

        return (
          <Card
            key={client.id}
            className={`overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
              isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(client.id)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {client.prenom?.[0] || client.nom[0]}
                  </div>
                </div>
                {vip && (
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">VIP</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {client.prenom} {client.nom}
                </h3>
                {client.nomEntreprise && (
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm truncate">{client.nomEntreprise}</span>
                  </div>
                )}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  client.statut === "ACTIF" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {client.statut === "ACTIF" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {client.statut}
                </span>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.telephone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{client.telephone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Dossiers</span>
                  </div>
                  <p className="text-lg font-bold text-blue-900">{client._count?.dossiers || 0}</p>
                </div>
                <div className={`rounded-lg p-3 ${vip ? "bg-amber-50" : "bg-green-50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className={`w-4 h-4 ${vip ? "text-amber-600" : "text-green-600"}`} />
                    <span className={`text-xs font-medium ${vip ? "text-amber-600" : "text-green-600"}`}>CA</span>
                  </div>
                  <p className={`text-sm font-bold ${vip ? "text-amber-900" : "text-green-900"}`}>
                    {formatCurrency(ca)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/clients/${client.id}/modifier`)}
                  variant="outline"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}