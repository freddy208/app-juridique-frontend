// src/app/(dashboard)/notes/components/note-form.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreateNoteForm, UpdateNoteForm, Note } from '../../lib/types/note.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/Card';
import { ClientSelector } from './client-selector';
import { DossierSelector } from './dossier-selector';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Schéma de validation
const noteSchema = z.object({
  titre: z.string().optional(),
  contenu: z.string().min(1, 'Le contenu est obligatoire'),
  clientId: z.string().optional(),
  dossierId: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  initialData?: Note;
  onSubmit: (data: CreateNoteForm | UpdateNoteForm) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      titre: initialData?.titre || '',
      contenu: initialData?.contenu || '',
      clientId: initialData?.clientId,
      dossierId: initialData?.dossierId,
    },
  });

  const watchedFields = watch();

  const handleFormSubmit = async (data: NoteFormData) => {
    try {
      await onSubmit(data);
      toast.success(initialData ? 'Note modifiée avec succès' : 'Note créée avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card className="p-6 bg-white border-2 border-gray-200 shadow-sm">
        <div className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="titre" className="text-sm font-semibold text-gray-700">
              Titre <span className="text-gray-500 font-normal">(optionnel)</span>
            </Label>
            <Input
              id="titre"
              placeholder="Titre de la note"
              {...register('titre')}
              className="bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 text-gray-900 h-12"
            />
            {errors.titre && (
              <p className="text-xs text-red-600">{errors.titre.message}</p>
            )}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contenu" className="text-sm font-semibold text-gray-700">
                Contenu <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2 hover:bg-blue-50 text-blue-600"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Masquer l&apos;aperçu
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Aperçu
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Éditeur */}
              <div>
                <Textarea
                  id="contenu"
                  placeholder="Écrivez votre note ici..."
                  rows={12}
                  {...register('contenu')}
                  className="bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 text-gray-900 resize-none"
                />
                {errors.contenu && (
                  <p className="text-xs text-red-600 mt-1">{errors.contenu.message}</p>
                )}
              </div>

              {/* Aperçu */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 overflow-auto"
                    style={{ minHeight: '300px', maxHeight: '300px' }}
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Aperçu
                    </h4>
                    {watchedFields.titre && (
                      <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {watchedFields.titre}
                      </h3>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {watchedFields.contenu || 'Le contenu apparaîtra ici...'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Association Client/Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-100">
            {/* Client */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Client <span className="text-gray-500 font-normal">(optionnel)</span>
              </Label>
              <ClientSelector
                value={watchedFields.clientId}
                onChange={(clientId) => setValue('clientId', clientId)}
                error={errors.clientId?.message}
              />
            </div>

            {/* Dossier */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Dossier <span className="text-gray-500 font-normal">(optionnel)</span>
              </Label>
              <DossierSelector
                value={watchedFields.dossierId}
                onChange={(dossierId) => setValue('dossierId', dossierId)}
                error={errors.dossierId?.message}
                clientId={watchedFields.clientId}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="gap-2 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700"
        >
          <X className="h-4 w-4" />
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Enregistrement...' : (initialData ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};