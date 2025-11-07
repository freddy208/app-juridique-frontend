/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/notes/components/note-form.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, Edit3 } from 'lucide-react';
import { Note, CreateNoteForm, UpdateNoteForm } from '../../lib/types/note.types';
import { ClientSelector } from './client-selector';
import { DossierSelector } from './dossier-selector';
import { generateDefaultTitle } from '@/lib/utils/notes';

// Interface pour le mode création
interface CreateNoteFormProps {
  mode: 'create';
  note?: never;
  onSubmit: (data: CreateNoteForm) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

// Interface pour le mode modification
interface UpdateNoteFormProps {
  mode: 'update';
  note: Note;
  onSubmit: (data: UpdateNoteForm) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

// Type union des props (avec intersection correcte)
type NoteFormProps = CreateNoteFormProps | UpdateNoteFormProps;

export const NoteForm: React.FC<NoteFormProps> = (props) => {
  // Extraction des props communs
  const { mode, onCancel, loading = false, error = null } = props;
  
  // Détermination du type de formulaire en fonction du mode
  const isCreateMode = mode === 'create';
  const note = isCreateMode ? undefined : (props as UpdateNoteFormProps).note;
  const onSubmit = isCreateMode 
    ? (props as CreateNoteFormProps).onSubmit 
    : (props as UpdateNoteFormProps).onSubmit;
  
  // Initialisation des données du formulaire en fonction du mode
  const [formData, setFormData] = useState<CreateNoteForm | UpdateNoteForm>(() => {
    if (isCreateMode) {
      return {
        titre: '',
        contenu: '',
        clientId: undefined,
        dossierId: undefined,
      } as CreateNoteForm;
    } else {
      return {
        titre: note?.titre || '',
        contenu: note?.contenu || '',
        clientId: note?.clientId || undefined,
        dossierId: note?.dossierId || undefined,
      } as UpdateNoteForm;
    }
  });
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [generatedTitle, setGeneratedTitle] = useState('');

  useEffect(() => {
    if (formData.contenu && !formData.titre) {
      const title = generateDefaultTitle(formData.contenu);
      setGeneratedTitle(title);
    } else {
      setGeneratedTitle('');
    }
  }, [formData.contenu, formData.titre]);

  const handleChange = (field: keyof (CreateNoteForm | UpdateNoteForm), value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation spécifique pour le mode création
    if (isCreateMode && !(formData as CreateNoteForm).contenu) {
      return;
    }
    
    await onSubmit(formData as any);
  };

  const useGeneratedTitle = () => {
    setFormData(prev => ({
      ...prev,
      titre: generatedTitle
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            {isCreateMode ? 'Créer une nouvelle note' : 'Modifier la note'}
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre (optionnel)</Label>
                <Input
                  id="titre"
                  value={formData.titre || ''}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  placeholder="Entrez un titre pour cette note"
                />
                {generatedTitle && !formData.titre && (
                  <div className="text-sm text-gray-500">
                    Suggestion: &quot;{generatedTitle}&quot; 
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto text-blue-600"
                      onClick={useGeneratedTitle}
                    >
                      Utiliser
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Association</Label>
                <Tabs defaultValue="none" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="none">Aucune</TabsTrigger>
                    <TabsTrigger value="client">Client</TabsTrigger>
                    <TabsTrigger value="dossier">Dossier</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="none" className="mt-2">
                    <div className="text-sm text-gray-500 py-2">
                      Cette note ne sera associée à aucun client ou dossier.
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="client" className="mt-2">
                    <ClientSelector
                      value={formData.clientId}
                      onChange={(clientId) => {
                        handleChange('clientId', clientId);
                        handleChange('dossierId', undefined); // Réinitialiser le dossier si un client est sélectionné
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="dossier" className="mt-2">
                    <DossierSelector
                      value={formData.dossierId}
                      onChange={(dossierId) => {
                        handleChange('dossierId', dossierId);
                        handleChange('clientId', undefined); // Réinitialiser le client si un dossier est sélectionné
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="contenu">Contenu {isCreateMode && '*'}</Label>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
                  <TabsList>
                    <TabsTrigger value="edit" className="flex items-center">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Éditer
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Aperçu
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="edit" className="mt-0">
                  <Textarea
                    id="contenu"
                    value={formData.contenu || ''}
                    onChange={(e) => handleChange('contenu', e.target.value)}
                    placeholder="Entrez le contenu de votre note..."
                    className="min-h-[200px]"
                    required={isCreateMode} // Obligatoire seulement en mode création
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="border rounded-md p-4 min-h-[200px] bg-gray-50 whitespace-pre-wrap">
                    {formData.contenu || "Aucun contenu à afficher"}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreateMode ? 'Création...' : 'Modification...'}
                </>
              ) : (
                <>
                  {isCreateMode ? 'Créer' : 'Mettre à jour'} la note
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};