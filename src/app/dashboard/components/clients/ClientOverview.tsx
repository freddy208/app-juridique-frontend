"use client";

import { Client } from "@/types/client.types";
import { Card } from "@/components/ui/card";
import {
  FileText, DollarSign, TrendingUp, Clock, CheckCircle,
  XCircle, Calendar, Activity
} from "lucide-react";

interface ClientOverviewProps {
  client: Client;
}

export default function ClientOverview({ client }: ClientOverviewProps) {
  const calculateCA = () => {
    return client.factures?.reduce((sum, f) => sum + Number(f.montant), 0) || 0;
  };

  const facturesPaid = client.factures?.filter(f => f.payee).length || 0;
  const facturesUnpaid = (client.factures?.length || 0) - facturesPaid;
  const ca = calculateCA();

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">Dossiers actifs</p>
          <p className="text-3xl font-bold text-slate-900">
            {client.dossiers?.filter(d => d.statut !== "CLOS").length || 0}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            sur {client.dossiers?.length || 0} total
          </p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">Chiffre d&apos;affaires</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(ca)}</p>
          <p className="text-xs text-slate-500 mt-2">Total généré</p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">Factures payées</p>
          <p className="text-3xl font-bold text-emerald-600">{facturesPaid}</p>
          <p className="text-xs text-slate-500 mt-2">sur {client.factures?.length || 0} total</p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">Factures impayées</p>
          <p className="text-3xl font-bold text-red-600">{facturesUnpaid}</p>
          <p className="text-xs text-slate-500 mt-2">En attente</p>
        </Card>
      </div>

      {/* Informations générales */}
      <Card className="p-6 border-slate-200 bg-white">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600 font-medium mb-2">Prénom</p>
            <p className="text-slate-900 font-semibold">{client.prenom || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 font-medium mb-2">Nom</p>
            <p className="text-slate-900 font-semibold">{client.nom}</p>
          </div>
          {client.nomEntreprise && (
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600 font-medium mb-2">Entreprise</p>
              <p className="text-slate-900 font-semibold">{client.nomEntreprise}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-600 font-medium mb-2">Email</p>
            <p className="text-slate-900">{client.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 font-medium mb-2">Téléphone</p>
            <p className="text-slate-900">{client.telephone || "-"}</p>
          </div>
          {client.adresse && (
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600 font-medium mb-2">Adresse</p>
              <p className="text-slate-900">{client.adresse}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6 border-slate-200 bg-white">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Dernière activité
        </h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="w-0.5 h-full bg-slate-200 mt-2" />
            </div>
            <div className="flex-1 pb-6">
              <p className="font-semibold text-slate-900 mb-1">Client créé</p>
              <p className="text-sm text-slate-600 mb-2">{formatDate(client.creeLe)}</p>
              <p className="text-sm text-slate-500">Création de la fiche client</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 mb-1">Dernière modification</p>
              <p className="text-sm text-slate-600 mb-2">{formatDate(client.modifieLe)}</p>
              <p className="text-sm text-slate-500">Mise à jour des informations</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}