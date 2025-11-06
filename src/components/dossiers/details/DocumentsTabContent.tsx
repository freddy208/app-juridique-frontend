/**
 * ============================================
 * DOCUMENTS TAB CONTENT
 * ============================================
 * Contenu de l'onglet Documents
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Download, Eye, Plus, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Document, StatutDocument } from '../../../lib/types/documents.types';

interface DocumentsTabContentProps {
  documents?: Document[];
  dossierId: string;
}

// Fonction pour formater la date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Fonction pour obtenir le libellé du statut
const getStatutLabel = (statut: StatutDocument): string => {
  switch (statut) {
    case StatutDocument.ACTIF:
      return 'Actif';
    case StatutDocument.ARCHIVE:
      return 'Archivé';
    case StatutDocument.SUPPRIME:
      return 'Supprimé';
    default:
      return statut;
  }
};

// Fonction pour obtenir la couleur du badge selon le statut
const getStatutBadgeVariant = (statut: StatutDocument): "default" | "secondary" | "destructive" | "outline" => {
  switch (statut) {
    case StatutDocument.ACTIF:
      return 'default';
    case StatutDocument.ARCHIVE:
      return 'secondary';
    case StatutDocument.SUPPRIME:
      return 'destructive';
    default:
      return 'outline';
  }
};

export const DocumentsTabContent: React.FC<DocumentsTabContentProps> = ({ 
  documents, 
  dossierId 
}) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documents liés</CardTitle>
            <CardDescription>
              {documents?.length || 0} document(s) associé(s) à ce dossier
            </CardDescription>
          </div>
          <Button
            onClick={() => router.push(`/documents/nouveau?dossierId=${dossierId}`)}
            className="bg-[#4169e1] hover:bg-[#2e4fa8]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#4169e1] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-[#4169e1]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {doc.titre}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <Badge variant={getStatutBadgeVariant(doc.statut)} className="text-xs">
                          {getStatutLabel(doc.statut)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                        {doc.taille && (
                          <span className="text-xs text-gray-600">
                            {(doc.taille / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                        {doc.extension && (
                          <span className="text-xs text-gray-600">
                            .{doc.extension}
                          </span>
                        )}
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(doc.creeLe)}
                        </span>
                        {doc.version > 1 && (
                          <span className="text-xs text-gray-600">
                            v{doc.version}
                          </span>
                        )}
                      </div>
                      {doc.contenuOCR && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {doc.contenuOCR.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/documents/${doc.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {doc.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Aucun document</p>
            <p className="text-sm text-gray-500 mb-4">
              Aucun document n&apos;a encore été ajouté à ce dossier
            </p>
            <Button
              onClick={() => router.push(`/documents/nouveau?dossierId=${dossierId}`)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};