/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * PAGE DÉTAILS DOSSIER (VERSION MISE À JOUR)
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
import { Card, CardContent } from '@/components/ui/Card';
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
} from '@/lib/dossiers/constants';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { 
  StatutDossier, 
  Client as DossierClient,
  Document as DossierDocument,
  Facture as DossierFacture,
  Tache as DossierTache,
  Note as DossierNote
} from '../../../../../lib/types/dossier';

// Import des types pour les composants
import { 
  Client as ClientType, 
  TypeClient, 
  StatutClient 
} from '@/lib/types/client.types';
import { 
  Document as DocumentType, 
  StatutDocument 
} from '@/lib/types/documents.types';
import { 
  Facture as FactureType, 
  StatutFacture 
} from '@/lib/types/factures.types';
import { 
  TacheResponse, 
  StatutTache, 
  TachePriorite 
} from '@/lib/types/tache.types';
import { 
  Note as NoteType, 
  StatutNote 
} from '@/lib/types/note.types';

// Import des composants de détails
import {
  DossierInfoCard,
  ClientTabContent,
  DocumentsTabContent,
  TachesTabContent,
  FacturesTabContent,
  NotesTabContent,
} from '@/components/dossiers/details';

// ============================================
// FONCTIONS D'ADAPTATION DES TYPES
// ============================================

// Adapter le type Client du Dossier vers le type attendu par ClientTabContent
const adaptClientForTab = (client: DossierClient): ClientType => {
  // Créer un objet avec les propriétés requises par ClientType
  const adaptedClient: ClientType = {
    id: client.id,
    prenom: client.prenom,
    nom: client.nom,
    entreprise: client.entreprise,
    // Ajouter les propriétés manquantes avec des valeurs par défaut
    typeClient: TypeClient.PARTICULIER, // Valeur par défaut
    statut: StatutClient.ACTIF, // Valeur par défaut
    creeLe: new Date(), // Valeur par défaut
    modifieLe: new Date(), // Valeur par défaut
    estVIP: false, // Valeur par défaut
  };
  
  return adaptedClient;
};

// Adapter le type Document du Dossier vers le type attendu par DocumentsTabContent
const adaptDocumentsForTab = (documents: DossierDocument[]): DocumentType[] => {
  return documents.map(doc => ({
    id: doc.id,
    titre: doc.titre,
    type: doc.type,
    creeLe: new Date(doc.creeLe),
    // Ajouter les propriétés manquantes avec des valeurs par défaut
    dossierId: '', // Valeur par défaut
    televersePar: '', // Valeur par défaut
    url: '', // Valeur par défaut
    version: 1, // Valeur par défaut
    statut: StatutDocument.ACTIF, // Valeur par défaut
    modifieLe: new Date(), // Valeur par défaut
  }));
};

// Adapter le type Facture du Dossier vers le type attendu par FacturesTabContent
const adaptFacturesForTab = (factures: DossierFacture[]): FactureType[] => {
  return factures.map(facture => ({
    id: facture.id,
    numero: facture.numero,
    montantTotal: facture.montantTotal,
    statut: facture.statut as StatutFacture,
    creeLe: new Date(facture.creeLe),
    // Ajouter les propriétés manquantes avec des valeurs par défaut
    clientId: '', // Valeur par défaut
    dateEmission: new Date(facture.creeLe), // Utiliser creeLe comme date d'émission par défaut
    montantPaye: 0, // Valeur par défaut
    modifieLe: new Date(), // Valeur par défaut
  }));
};

// Adapter le type Tache du Dossier vers le type attendu par TachesTabContent
const adaptTachesForTab = (taches: DossierTache[]): TacheResponse[] => {
  return taches.map(tache => ({
    id: tache.id,
    titre: tache.titre,
    statut: tache.statut as StatutTache,
    dateLimite: new Date(tache.dateLimite),
    // Ajouter les propriétés manquantes avec des valeurs par défaut
    priorite: TachePriorite.MOYENNE, // Valeur par défaut
    creeLe: new Date(), // Valeur par défaut
    modifieLe: new Date(), // Valeur par défaut
    enRetard: false, // Valeur par défaut
    createur: {
      id: '',
      prenom: '',
      nom: '',
      role: ''
    }
  }));
};

// Adapter le type Note du Dossier vers le type attendu par NotesTabContent
const adaptNotesForTab = (notes: DossierNote[]): NoteType[] => {
  return notes.map(note => ({
    id: note.id,
    titre: note.titre,
    creeLe: new Date(note.creeLe),
    // Ajouter les propriétés manquantes avec des valeurs par défaut
    contenu: '', // Valeur par défaut
    utilisateurId: '', // Valeur par défaut
    statut: StatutNote.ACTIF, // Valeur par défaut
    modifieLe: new Date(), // Valeur par défaut
    utilisateur: {
      id: '',
      prenom: '',
      nom: ''
    }
  }));
};

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

  // Utiliser une assertion de type pour accéder à la configuration
  const typeConfig = TYPE_DOSSIER_CONFIG[dossier.type as keyof typeof TYPE_DOSSIER_CONFIG];
  const statutConfig = STATUT_DOSSIER_CONFIG[dossier.statut as keyof typeof STATUT_DOSSIER_CONFIG];
  const risqueConfig = dossier.risqueJuridique
    ? NIVEAU_RISQUE_CONFIG[dossier.risqueJuridique as keyof typeof NIVEAU_RISQUE_CONFIG]
    : null;

  // Adapter les données pour les composants d'onglets
  const adaptedClient = dossier.client ? adaptClientForTab(dossier.client) : undefined;
  const adaptedDocuments = dossier.documents ? adaptDocumentsForTab(dossier.documents) : undefined;
  const adaptedFactures = dossier.factures ? adaptFacturesForTab(dossier.factures) : undefined;
  const adaptedTaches = dossier.taches ? adaptTachesForTab(dossier.taches) : undefined;
  const adaptedNotes = dossier.notes ? adaptNotesForTab(dossier.notes) : undefined;

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
              changeStatutMutation.mutate({ id: dossier.id, statut: value as StatutDossier })
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
            value={dossier.responsableId || ''}
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

      {/* Informations principales - Composant dédié */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <DossierInfoCard dossier={dossier} />
      </motion.div>

      {/* Onglets relations - Composants dédiés */}
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
            {adaptedClient && <ClientTabContent client={adaptedClient} />}
          </TabsContent>

          {/* Onglet Documents */}
          <TabsContent value="documents">
            <DocumentsTabContent 
              documents={adaptedDocuments} 
              dossierId={dossier.id} 
            />
          </TabsContent>

          {/* Onglet Tâches */}
          <TabsContent value="taches">
            <TachesTabContent 
              taches={adaptedTaches} 
              dossierId={dossier.id} 
            />
          </TabsContent>

          {/* Onglet Factures */}
          <TabsContent value="factures">
            <FacturesTabContent 
              factures={adaptedFactures} 
              dossierId={dossier.id} 
            />
          </TabsContent>

          {/* Onglet Notes */}
          <TabsContent value="notes">
            <NotesTabContent 
              notes={adaptedNotes} 
              dossierId={dossier.id} 
            />
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