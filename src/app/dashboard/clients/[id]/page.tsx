"use client";

import { useState } from "react";
import { useClient, useDeleteClient, useUpdateClientStatut } from "@/hooks/useClients";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Edit, Trash2, Crown, Building2, Mail, Phone, MapPin,
  CheckCircle, XCircle, MoreVertical, FileText, DollarSign,
  MessageSquare, History as HistoryIcon, AlertTriangle
} from "lucide-react";
import ClientOverview from "../../components/clients/ClientOverview";
import ClientDossiers from "../../components/clients/ClientDossiers";
import ClientDocuments from "../../components/clients/ClientDocuments";
import ClientFacturation from "../../components/clients/ClientFacturation";
import ClientCorrespondances from "../../components/clients/ClientCorrespondances";
import ClientNotes from "../../components/clients/ClientNotes";
import ClientAudit from "../../components/clients/ClientAudit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { data: client, isLoading } = useClient(clientId);
  const deleteMutation = useDeleteClient();
  const updateStatutMutation = useUpdateClientStatut();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const calculateCA = () => {
    return client?.factures?.reduce((sum, f) => sum + Number(f.montant), 0) || 0;
  };

  const isVIP = () => calculateCA() > 1000000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(clientId);
      toast.success("Client supprimé avec succès");
      router.push("/dashboard/clients");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleStatut = async () => {
    if (!client) return;
    
    const newStatut = client.statut === "ACTIF" ? "INACTIF" : "ACTIF";
    try {
      await updateStatutMutation.mutateAsync({ id: clientId, statut: newStatut });
      toast.success(`Client ${newStatut === "ACTIF" ? "activé" : "désactivé"}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement du client...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Client introuvable</h2>
          <p className="text-slate-600 mb-6">Le client demandé n&apos;existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push("/dashboard/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </Card>
      </div>
    );
  }

  const ca = calculateCA();
  const vip = isVIP();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Breadcrumb */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>

        {/* Header */}
        <Card className="overflow-hidden shadow-xl border-slate-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Client Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-2 border-white/30">
                  {client.prenom?.[0] || client.nom[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {client.prenom} {client.nom}
                    </h1>
                    {vip && (
                      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                        <Crown className="w-5 h-5 text-white" />
                        <span className="text-sm font-bold text-white">VIP</span>
                      </div>
                    )}
                  </div>

                  {client.nomEntreprise && (
                    <div className="flex items-center gap-2 text-white/90 mb-3">
                      <Building2 className="w-5 h-5" />
                      <span className="text-lg font-medium">{client.nomEntreprise}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-white/80">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                    )}
                    {client.telephone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{client.telephone}</span>
                      </div>
                    )}
                    {client.adresse && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{client.adresse}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                      client.statut === "ACTIF"
                        ? "bg-green-500 text-white"
                        : "bg-slate-400 text-white"
                    }`}>
                      {client.statut === "ACTIF" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {client.statut}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push(`/dashboard/clients/${clientId}/modifier`)}
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Éditer
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleToggleStatut}>
                      {client.statut === "ACTIF" ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activer
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50/50">
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium mb-1">Dossiers</p>
              <p className="text-2xl font-bold text-slate-900">{client._count?.dossiers || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium mb-1">CA Total</p>
              <p className={`text-2xl font-bold ${vip ? "text-amber-600" : "text-slate-900"}`}>
                {formatCurrency(ca)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium mb-1">Factures</p>
              <p className="text-2xl font-bold text-slate-900">{client.factures?.length || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium mb-1">Payées</p>
              <p className="text-2xl font-bold text-green-600">
                {client.factures?.filter(f => f.payee).length || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="p-2 border-slate-200 bg-white/80 backdrop-blur-sm">
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-7 gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Vue d&apos;ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="dossiers" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Dossiers</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {client._count?.dossiers || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="facturation" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Facturation</span>
              </TabsTrigger>
              <TabsTrigger value="correspondances" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Correspondances</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="overview" className="space-y-6">
            <ClientOverview client={client} />
          </TabsContent>

          <TabsContent value="dossiers" className="space-y-6">
            <ClientDossiers clientId={clientId} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <ClientDocuments clientId={clientId} />
          </TabsContent>

          <TabsContent value="facturation" className="space-y-6">
            <ClientFacturation clientId={clientId} />
          </TabsContent>

          <TabsContent value="correspondances" className="space-y-6">
            <ClientCorrespondances clientId={clientId} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <ClientNotes clientId={clientId} />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <ClientAudit clientId={clientId} />
          </TabsContent>
        </Tabs>

        {/* Dialog suppression */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}