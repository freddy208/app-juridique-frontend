/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * STEP 1 - INFORMATIONS GÉNÉRALES
 * ============================================
 * Première étape du wizard de création de dossier
 * Champs : titre, description, client, responsable, type, etc.
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateDossierRequest, TypeDossier, StatutDossier, NiveauRisque } from '@/lib/types/dossier';
import { TYPE_DOSSIER_CONFIG, STATUT_DOSSIER_CONFIG, NIVEAU_RISQUE_CONFIG } from '@/lib/dossiers/constants';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

// ============================================
// SCHEMA VALIDATION
// ============================================

const step1Schema = z.object({
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Veuillez sélectionner un client'),
  responsableId: z.string().optional(),
  type: z.nativeEnum(TypeDossier, { 
    message: 'Veuillez sélectionner un type'
  }),
  valeurFinanciere: z.number().optional(),
  risqueJuridique: z.nativeEnum(NiveauRisque).optional(),
  chancesSucces: z.number().min(0).max(100).optional(),
  statut: z.nativeEnum(StatutDossier).optional(),
});

type Step1FormData = z.infer<typeof step1Schema>;

// ============================================
// TYPES
// ============================================

interface Step1GeneralProps {
  initialData?: Partial<CreateDossierRequest>;
  onComplete: (data: Partial<CreateDossierRequest>) => void;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const Step1General: React.FC<Step1GeneralProps> = ({ initialData, onComplete }) => {
  // Récupérer la liste des clients
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await apiClient.get('/clients', { params: { limit: 100 } });
      return data;
    },
  });

  // Récupérer la liste des utilisateurs (responsables)
  const { data: utilisateursData } = useQuery({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/utilisateurs', { params: { limit: 100 } });
      return data;
    },
  });

  const clients = clientsData?.data || [];
  const utilisateurs = utilisateursData?.data || [];

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      titre: initialData?.titre || '',
      description: initialData?.description || '',
      clientId: initialData?.clientId || '',
      responsableId: initialData?.responsableId || '',
      type: initialData?.type,
      valeurFinanciere: initialData?.valeurFinanciere,
      risqueJuridique: initialData?.risqueJuridique,
      chancesSucces: initialData?.chancesSucces,
      statut: initialData?.statut || StatutDossier.OUVERT,
    },
  });

  const onSubmit = (data: Step1FormData) => {
    const submitData = {
      ...data,
      statut: data.statut || StatutDossier.OUVERT,
    };
    onComplete(submitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-['Playfair_Display']">
            Informations Générales
          </CardTitle>
          <CardDescription>
            Renseignez les informations de base du dossier
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
                        placeholder="Ex: Accident de la route - M. Dupont"
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
                        placeholder="Description détaillée du dossier..."
                        className="min-h-[100px] border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optionnel - Ajoutez des détails supplémentaires</FormDescription>
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
                            <SelectValue placeholder="Sélectionner un client" />
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
                            <SelectValue placeholder="Sélectionner un responsable" />
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
                      <FormDescription>Optionnel - Peut être assigné plus tard</FormDescription>
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
                      <FormLabel className="text-gray-900">
                        Type de dossier <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Sélectionner un type" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Statut initial</FormLabel>
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

              {/* Bouton suivant */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-[#4169e1] hover:bg-[#2e4fa8] text-white px-8"
                >
                  Suivant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};