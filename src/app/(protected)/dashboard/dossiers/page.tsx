/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * PAGE LISTE DOSSIERS
 * ============================================
 * Liste complète avec stats, filtres et cartes
 * 100% piloté par l'API via useDossiers
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useDossiers } from '@/lib/hooks/dossier/useDossiers';
import { StatsCards } from '@/components/dossiers/cards/StatsCards';
import { DossierFilters } from '@/components/dossiers/filters/DossierFilters';
import { DossierCard } from '@/components/dossiers/cards/DossierCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dossier } from '@/lib/types/dossier';

// ============================================
// SKELETON LOADING
// ============================================

const DossierCardSkeleton = () => (
  <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
    <div className="px-6 py-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DossiersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Construire les paramètres de requête depuis l'URL
  const params = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    titre: searchParams.get('titre') || undefined,
    type: searchParams.get('type') || undefined,
    statut: searchParams.get('statut') || undefined,
    risqueJuridique: searchParams.get('risqueJuridique') || undefined,
  };

  // Récupérer les dossiers via le hook
  const { data, isLoading, error } = useDossiers(params);

  const dossiers = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-['Playfair_Display']">
            Dossiers
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez tous vos dossiers juridiques
          </p>
        </div>

        <Button
          onClick={() => router.push('/dossiers/nouveau')}
          className="bg-[#4169e1] hover:bg-[#2e4fa8] text-white h-11 px-6"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau Dossier
        </Button>
      </motion.div>

      {/* Cartes de statistiques */}
      <StatsCards />

      {/* Filtres */}
      <DossierFilters />

      {/* État de chargement */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <DossierCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* État d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center"
        >
          <p className="text-red-700 font-medium">
            Erreur lors du chargement des dossiers
          </p>
          <p className="text-red-600 text-sm mt-2">
            {(error as any)?.message || 'Une erreur est survenue'}
          </p>
        </motion.div>
      )}

      {/* Liste des dossiers */}
      {!isLoading && !error && dossiers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center"
        >
          <FolderX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucun dossier trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre premier dossier
          </p>
          <Button
            onClick={() => router.push('/dossiers/nouveau')}
            className="bg-[#4169e1] hover:bg-[#2e4fa8]"
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer un dossier
          </Button>
        </motion.div>
      )}

      {!isLoading && !error && dossiers.length > 0 && (
        <>
          {/* Grille de cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dossiers.map((dossier: Dossier, index: number) => (
              <DossierCard key={dossier.id} dossier={dossier} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (meta.page > 1) {
                          const newParams = new URLSearchParams(searchParams.toString());
                          newParams.set('page', String(meta.page - 1));
                          router.push(`/dossiers?${newParams.toString()}`);
                        }
                      }}
                      className={meta.page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {[...Array(meta.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Afficher max 5 pages autour de la page courante
                    if (
                      pageNum === 1 ||
                      pageNum === meta.totalPages ||
                      (pageNum >= meta.page - 2 && pageNum <= meta.page + 2)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => {
                              const newParams = new URLSearchParams(searchParams.toString());
                              newParams.set('page', String(pageNum));
                              router.push(`/dossiers?${newParams.toString()}`);
                            }}
                            isActive={pageNum === meta.page}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (meta.page < meta.totalPages) {
                          const newParams = new URLSearchParams(searchParams.toString());
                          newParams.set('page', String(meta.page + 1));
                          router.push(`/dossiers?${newParams.toString()}`);
                        }
                      }}
                      className={
                        meta.page === meta.totalPages ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Info pagination */}
          {meta && (
            <p className="text-center text-sm text-gray-600">
              Affichage de {(meta.page - 1) * meta.limit + 1} à{' '}
              {Math.min(meta.page * meta.limit, meta.total)} sur {meta.total} dossiers
            </p>
          )}
        </>
      )}
    </div>
  );
}