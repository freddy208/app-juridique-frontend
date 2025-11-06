/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * PAGE DÉTAILS DOSSIER
 * ============================================
 * Vue complète d'un dossier avec:
 * - Informations principales
 * - Actions rapides (statut, responsable)
 * - Onglets relations (client, documents, tâches, etc.)
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Trash2,
  UserPlus,
  RefreshCw,
  FileText,
  Users,
  DollarSign,
  CheckSquare,
  StickyNote,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDossier } from '@/lib/hooks/dossier/useDossier';
import {
  useChangeDossierStatut,
  useAssignDossierResponsable,
  useDeleteDossier,
} from '@/lib/hooks/dossier/useDossierActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  TYPE_DOSSIER_CONFIG,
  STATUT_DOSSIER_CONFIG,
  NIVEAU_RISQUE_CONFIG,
  formatCurrency,
  formatDate,
} from '@/lib/dossiers/constants';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DossierDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Récupération du dossier
  const { data: dossier, isLoading, error } = useDossier(params.id);

  // Récupération des utilisateurs pour l'assignation
  const { data: utilisateursData } = useQuery({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/utilisateurs', { params: { limit: 100 } });
      return data;
    },
  });

  const utilisateurs = utilisateursData?.data || [];

  // Mutations
  const changeStatutMutation = useChangeDossierStatut({
    onSuccess: () => {
      toast.success('✅ Statut modifié avec succès');
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error("❌ Vous n'avez pas les permissions pour modifier le statut");
      } else {
        toast.error('❌ Erreur lors de la modification du statut');
      }
    },
  });

  const assignResponsableMutation = useAssignDossierResponsable({
    onSuccess: () => {
      toast.success('✅ Responsable assigné avec succès');
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error("❌ Vous n'avez pas les permissions pour assigner un responsable");
      } else {
        toast.error("❌ Erreur lors de l'assignation du responsable");
      }
    },
  });

  const deleteMutation = useDeleteDossier({
    onSuccess: () => {
      toast.success('✅ Dossier supprimé avec succès');
      router.push('/dossiers');
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error("❌ Vous n'avez pas les permissions pour supprimer ce dossier");
      } else {
        toast.error('❌ Erreur lors de la suppression du dossier');
      }
    },
  });

  // État de chargement
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-12 w-96" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  // État d'erreur
  if (error || !dossier) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="text-red-700 font-medium text-lg mb-2">
            Erreur lors du chargement du dossier
          </p>
          <p className="text-red-600 text-sm mb-4">
            {(error as any)?.message || 'Le dossier demandé est introuvable'}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  const typeConfig = TYPE_DOSSIER_CONFIG[dossier.type];
  const statutConfig = STATUT_DOSSIER_CONFIG[dossier.statut];
  const risqueConfig = dossier.risqueJuridique
    ? NIVEAU_RISQUE_CONFIG[dossier.risqueJuridique]
    : null;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{typeConfig.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">
                    {dossier.titre}
                  </h1>
                  <p className="text-gray-600 font-mono text-sm mt-1">
                    {dossier.numeroUnique}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className={`${statutConfig.bgColor} ${statutConfig.color} font-medium`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${statutConfig.dotColor}`} />
                  {statutConfig.label}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {typeConfig.label}
                </Badge>
                {risqueConfig && (
                  <Badge className={`${risqueConfig.bgColor} ${risqueConfig.color} font-medium`}>
                    {risqueConfig.icon} {risqueConfig.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Menu actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push(`/dossiers/${dossier.id}/modifier`)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Select
            value={dossier.statut}
            onValueChange={(value) =>
              changeStatutMutation.mutate({ id: dossier.id, statut: value })
            }
            disabled={changeStatutMutation.isPending}
          >
            <SelectTrigger className="w-[220px] border-gray-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Changer le statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUT_DOSSIER_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <span>{config.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={dossier.responsable?.id || ''}
            onValueChange={(value) =>
              assignResponsableMutation.mutate({ id: dossier.id, responsableId: value })
            }
            disabled={assignResponsableMutation.isPending}
          >
            <SelectTrigger className="w-[280px] border-gray-300">
              <UserPlus className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Assigner un responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucun responsable</SelectItem>
              {utilisateurs.map((user: any) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.prenom} {user.nom} - {user.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Informations principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#4169e1]" />
              Informations du dossier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Grille d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Client</p>
                <p className="font-semibold text-gray-900">
                  {dossier.client.prenom} {dossier.client.nom}
                </p>
                {dossier.client.entreprise && (
                  <p className="text-sm text-gray-600 mt-0.5">{dossier.client.entreprise}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Responsable</p>
                <p className="font-semibold text-gray-900">
                  {dossier.responsable
                    ? `${dossier.responsable.prenom} ${dossier.responsable.nom}`
                    : 'Non assigné'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Valeur financière</p>
                <p className="font-semibold text-gray-900 font-mono">
                  {formatCurrency(dossier.valeurFinanciere)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Chances de succès</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 font-mono">
                    {dossier.chancesSucces ? `${dossier.chancesSucces}%` : 'Non évalué'}
                  </p>
                  {dossier.chancesSucces && dossier.chancesSucces >= 70 && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Créé le
                </p>
                <p className="font-semibold text-gray-900">{formatDate(dossier.creeLe)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Mis à jour le
                </p>
                <p className="font-semibold text-gray-900">{formatDate(dossier.misAJourLe)}</p>
              </div>
            </div>

            {/* Description */}
            {dossier.description && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                <p className="text-gray-900 leading-relaxed">{dossier.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets relations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs defaultValue="client" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="client" className="py-3">
              <Users className="h-4 w-4 mr-2" />
              Client
            </TabsTrigger>
            <TabsTrigger value="documents" className="py-3">
              <FileText className="h-4 w-4 mr-2" />
              Documents ({dossier.documents?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="taches" className="py-3">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tâches ({dossier.taches?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="factures" className="py-3">
              <DollarSign className="h-4 w-4 mr-2" />
              Factures ({dossier.factures?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="notes" className="py-3">
              <StickyNote className="h-4 w-4 mr-2" />
              Notes ({dossier.notes?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Onglet Client */}
          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle>Détails du client</CardTitle>
                <CardDescription>Informations complètes sur le client associé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom complet</span>
                    <span className="font-semibold">
                      {dossier.client.prenom} {dossier.client.nom}
                    </span>
                  </div>
                  {dossier.client.entreprise && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entreprise</span>
                      <span className="font-semibold">{dossier.client.entreprise}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents liés</CardTitle>
                <CardDescription>
                  {dossier.documents?.length || 0} document(s) associé(s) à ce dossier
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dossier.documents && dossier.documents.length > 0 ? (
                  <div className="space-y-3">
                    {dossier.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#4169e1] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{doc.titre}</p>
                            <p className="text-sm text-gray-600">{doc.type}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun document associé à ce dossier</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Tâches */}
          <TabsContent value="taches">
            <Card>
              <CardHeader>
                <CardTitle>Tâches</CardTitle>
                <CardDescription>
                  {dossier.taches?.length || 0} tâche(s) en lien avec ce dossier
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dossier.taches && dossier.taches.length > 0 ? (
                  <div className="space-y-3">
                    {dossier.taches.map((tache) => (
                      <div
                        key={tache.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#4169e1] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{tache.titre}</p>
                            <p className="text-sm text-gray-600">
                              Échéance: {formatDate(tache.dateLimite)}
                            </p>
                          </div>
                          <Badge variant="outline">{tache.statut}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune tâche associée à ce dossier</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Factures */}
          <TabsContent value="factures">
            <Card>
              <CardHeader>
                <CardTitle>Factures & Honoraires</CardTitle>
                <CardDescription>Gestion financière du dossier</CardDescription>
              </CardHeader>
              <CardContent>
                {dossier.factures && dossier.factures.length > 0 ? (
                  <div className="space-y-3">
                    {dossier.factures.map((facture) => (
                      <div
                        key={facture.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#4169e1] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{facture.numero}</p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(facture.montantTotal)}
                            </p>
                          </div>
                          <Badge variant="outline">{facture.statut}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune facture associée à ce dossier</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notes */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  {dossier.notes?.length || 0} note(s) enregistrée(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dossier.notes && dossier.notes.length > 0 ? (
                  <div className="space-y-3">
                    {dossier.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#4169e1] transition-colors"
                      >
                        <p className="font-medium text-gray-900">{note.titre}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Créée le {formatDate(note.creeLe)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune note pour ce dossier</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous absolument sûr de vouloir supprimer le dossier{' '}
              <strong className="text-gray-900">{dossier.numeroUnique}</strong> ?
              <br />
              <br />
              Cette action est <strong className="text-red-600">irréversible</strong> et supprimera
              définitivement toutes les données associées (documents, tâches, factures, notes...).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(dossier.id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Suppression...
                </>
              ) : (
                'Supprimer définitivement'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}