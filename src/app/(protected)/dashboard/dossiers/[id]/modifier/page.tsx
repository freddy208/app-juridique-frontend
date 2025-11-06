/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * PAGE MODIFICATION DOSSIER
 * ============================================
 * Modification d'un dossier existant
 * Formulaire pré-rempli avec les données actuelles
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDossier } from '@/lib/hooks/dossier/useDossier';
import { useUpdateDossier } from '@/lib/hooks/dossier/useUpdateDossier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { TypeDossier, StatutDossier, NiveauRisque, UpdateDossierRequest } from '@/lib/types/dossier';
import {
  TYPE_DOSSIER_CONFIG,
  STATUT_DOSSIER_CONFIG,
  NIVEAU_RISQUE_CONFIG,
} from '@/lib/dossiers/constants';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

// ============================================
// SCHEMA VALIDATION
// ============================================

const updateDossierSchema = z.object({
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Veuillez sélectionner un client'),
  responsableId: z.string().optional(),
  type: z.nativeEnum(TypeDossier),
  valeurFinanciere: z.number().optional(),
  risqueJuridique: z.nativeEnum(NiveauRisque).optional(),
  chancesSucces: z.number().min(0).max(100).optional(),
  statut: z.nativeEnum(StatutDossier),
});

type UpdateDossierFormData = z.infer<typeof updateDossierSchema>;

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function ModifierDossierPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Récupération du dossier à modifier
  const { data: dossier, isLoading: isLoadingDossier } = useDossier(params.id);

  // Récupération des clients
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await apiClient.get('/clients', { params: { limit: 100 } });
      return data;
    },
  });

  // Récupération des utilisateurs
  const { data: utilisateursData } = useQuery({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/utilisateurs', { params: { limit: 100 } });
      return data;
    },
  });

  const clients = clientsData?.data || [];
  const utilisateurs = utilisateursData?.data || [];

  // Formulaire
  const form = useForm<UpdateDossierFormData>({
    resolver: zodResolver(updateDossierSchema),
    values: dossier ? {
      titre: dossier.titre,
      description: dossier.description || '',
      clientId: dossier.clientId,
      responsableId: dossier.responsableId || '',
      type: dossier.type,
      valeurFinanciere: dossier.valeurFinanciere,
      risqueJuridique: dossier.risqueJuridique,
      chancesSucces: dossier.chancesSucces,
      statut: dossier.statut,
    } : undefined,
  });

  // Mutation de mise à jour
  const updateMutation = useUpdateDossier({
    onSuccess: (data: { numeroUnique: any; }) => {
      toast.success('✅ Dossier modifié avec succès !', {
        description: `Les modifications du dossier ${data.numeroUnique} ont été enregistrées`,
      });
      router.push(`/dossiers/${params.id}`);
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error("❌ Vous n'avez pas les permissions pour modifier ce dossier");
      } else {
        const message = error.response?.data?.message || 'Une erreur est survenue';
        toast.error('❌ Échec de la modification du dossier', {
          description: message,
        });
      }
    },
  });

  const onSubmit = (data: UpdateDossierFormData) => {
    updateMutation.mutate({
      id: params.id,
      data: data as UpdateDossierRequest,
    });
  };

  // État de chargement
  if (isLoadingDossier) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!dossier) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="text-red-700 font-medium">Dossier introuvable</p>
          <Button onClick={() => router.back()} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Playfair_Display']">
            Modifier le dossier
          </h1>
          <p className="text-gray-600 mt-1 font-mono">
            {dossier.numeroUnique} - {dossier.titre}
          </p>
        </div>
      </motion.div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-4xl"
      >
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-['Playfair_Display']">
              Informations du dossier
            </CardTitle>
            <CardDescription>
              Modifiez les informations générales du dossier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Titre */}
                <FormField
                  control={form.control}
                  name="titre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">
                        Titre du dossier <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Titre du dossier"
                          className="border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description détaillée..."
                          className="min-h-[100px] border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Client et Responsable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">
                          Client <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client: any) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.prenom} {client.nom}
                                {client.entreprise && ` - ${client.entreprise}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsableId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Responsable</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Aucun responsable</SelectItem>
                            {utilisateurs.map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.prenom} {user.nom} - {user.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Type et Statut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Type de dossier</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(TYPE_DOSSIER_CONFIG).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <span className="flex items-center gap-2">
                                  <span>{config.icon}</span>
                                  <span>{config.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          ⚠️ Modifier le type peut nécessiter de compléter de nouveaux champs spécifiques
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Statut</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Informations complémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="valeurFinanciere"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Valeur financière (FCFA)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="border-gray-300"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risqueJuridique"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Niveau de risque</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Non évalué" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Non évalué</SelectItem>
                            {Object.entries(NIVEAU_RISQUE_CONFIG).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <span className="flex items-center gap-2">
                                  <span>{config.icon}</span>
                                  <span>{config.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chancesSucces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Chances de succès (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            className="border-gray-300"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={updateMutation.isPending}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="bg-[#4169e1] hover:bg-[#2e4fa8] text-white px-8"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}