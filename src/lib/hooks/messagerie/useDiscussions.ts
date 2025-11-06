/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/messagerie/useDiscussions.ts

import { useState, useEffect } from 'react';
import apiClient from '../../api/client';  // Correction ici : import par défaut
import { 
  Discussion, 
  CreateDiscussionDto, 
  UpdateDiscussionDto, 
  QueryDiscussionsDto,
  PaginationResult 
} from '@/lib/types/messagerie.types';

export const useDiscussions = (initialQuery: QueryDiscussionsDto = {}) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [query, setQuery] = useState<QueryDiscussionsDto>({
    page: 1,
    limit: 10,
    sortBy: 'modifieLe',
    sortOrder: 'desc',
    ...initialQuery,
  });

  // Récupérer la liste des discussions
  const fetchDiscussions = async (newQuery?: QueryDiscussionsDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const finalQuery = newQuery || query;
      const params = new URLSearchParams();
      
      Object.entries(finalQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`/messagerie/discussions?${params.toString()}`);
      const result: PaginationResult<Discussion> = response.data;
      
      setDiscussions(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
      
      if (newQuery) {
        setQuery(finalQuery);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des discussions');
      console.error('Erreur lors de la récupération des discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer une discussion par son ID
  const getDiscussion = async (id: string): Promise<Discussion | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/messagerie/discussions/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération de la discussion');
      console.error('Erreur lors de la récupération de la discussion:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle discussion
  const createDiscussion = async (data: CreateDiscussionDto): Promise<Discussion | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/messagerie/discussions', data);
      const newDiscussion = response.data;
      
      // Ajouter la nouvelle discussion à la liste
      setDiscussions(prev => [newDiscussion, ...prev]);
      
      return newDiscussion;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la discussion');
      console.error('Erreur lors de la création de la discussion:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une discussion
  const updateDiscussion = async (id: string, data: UpdateDiscussionDto): Promise<Discussion | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.patch(`/messagerie/discussions/${id}`, data);
      const updatedDiscussion = response.data;
      
      // Mettre à jour la discussion dans la liste
      setDiscussions(prev => 
        prev.map(discussion => 
          discussion.id === id ? updatedDiscussion : discussion
        )
      );
      
      return updatedDiscussion;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la discussion');
      console.error('Erreur lors de la mise à jour de la discussion:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une discussion
  const deleteDiscussion = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await apiClient.delete(`/messagerie/discussions/${id}`);
      
      // Supprimer la discussion de la liste
      setDiscussions(prev => prev.filter(discussion => discussion.id !== id));
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de la discussion');
      console.error('Erreur lors de la suppression de la discussion:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les discussions d'un dossier
  const getDiscussionsByDossier = async (dossierId: string, newQuery?: QueryDiscussionsDto): Promise<PaginationResult<Discussion> | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const finalQuery = { ...query, dossierId, ...newQuery };
      const params = new URLSearchParams();
      
      Object.entries(finalQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await apiClient.get(`/messagerie/discussions/dossier/${dossierId}?${params.toString()}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération des discussions du dossier');
      console.error('Erreur lors de la récupération des discussions du dossier:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Effacer l'erreur
  const clearError = () => setError(null);

  // Charger les discussions au montage du composant
  useEffect(() => {
    fetchDiscussions();
  }, []);

  return {
    discussions,
    loading,
    error,
    pagination,
    query,
    fetchDiscussions,
    getDiscussion,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    getDiscussionsByDossier,
    setQuery,
    clearError,
  };
};