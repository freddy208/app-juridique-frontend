/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/notes.ts

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { notesEndpoints } from '@/lib/api/endpoints';
import {
  NotesQuery,
  NotesResponse,
  NoteResponse,
  CreateNoteForm,
  UpdateNoteForm,
  NoteStats,
} from '../types/note.types';
import { toast } from 'sonner';

// Hook pour récupérer toutes les notes avec filtres et pagination
// Hook pour récupérer toutes les notes avec filtres et pagination
// Hook pour récupérer toutes les notes avec filtres et pagination
export const useNotes = (query: NotesQuery = {}) => {
  const [filters, setFilters] = useState<NotesQuery>(query);

  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotesResponse>({
    queryKey: ['notes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`${notesEndpoints.getAll}?${params.toString()}`);
      return response.data;
    },
    // ✅ AJOUTER CETTE OPTION 'select'
    select: (data) => {
      // S'assurer que data.data est toujours un tableau, même si l'API renvoie null ou autre chose
      return {
        ...data,
        data: Array.isArray(data?.data) ? data.data : []
      };
    }
  });

  const updateFilters = useCallback((newFilters: Partial<NotesQuery>) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    // ✅ RENFORCER LA SÉCURITÉ ICI AUSSI
    notes: Array.isArray(notesData?.data) ? notesData.data : [],
    pagination: notesData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
  };
};

// Hook pour récupérer une note par son ID
export const useNote = (id: string) => {
  const {
    data: noteData,
    isLoading,
    error,
    refetch,
  } = useQuery<NoteResponse>({
    queryKey: ['note', id],
    queryFn: async () => {
      const response = await apiClient.get(notesEndpoints.getById(id));
      return response.data;
    },
    enabled: !!id,
  });

  return {
    note: noteData?.data || null,
    isLoading,
    error,
    refetch,
  };
};

// Hook pour créer une note
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createNote,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (noteData: CreateNoteForm) => {
      const response = await apiClient.post(notesEndpoints.create, noteData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-stats'] });
    },
  });

  return {
    createNote,
    isPending,
    error,
  };
};

// Hook pour mettre à jour une note
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateNote,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNoteForm }) => {
      const response = await apiClient.patch(notesEndpoints.update(id), data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      queryClient.invalidateQueries({ queryKey: ['notes-stats'] });
    },
  });

  return {
    updateNote,
    isPending,
    error,
  };
};

// Hook pour supprimer une note
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteNote,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(notesEndpoints.delete(id));
      return id;
    },
    onSuccess: () => {
      // ✅ C'est l'endroit idéal pour les effets de bord après un succès
      toast.success('Note supprimée avec succès');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-stats'] });
    },
    onError: (error: any) => {
      // ✅ Et ici pour les erreurs
      toast.error(error.message || 'Erreur lors de la suppression de la note');
    },
  });

  return {
    deleteNote,
    isPending,
    error,
  };
};

// Hook pour rechercher des notes
export const useSearchNotes = (searchTerm: string, query: NotesQuery = {}) => {
  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery<NotesResponse>({
    queryKey: ['notes-search', searchTerm, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('q', searchTerm);
      
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`${notesEndpoints.search}?${params.toString()}`);
      return response.data;
    },
    enabled: !!searchTerm,
  });

  return {
    notes: notesData?.data || [],
    pagination: notesData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    error,
  };
};

// Hook pour récupérer les statistiques des notes
export const useNotesStats = (utilisateurId?: string) => {
  const {
    data: statsData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ data: NoteStats }>({
    queryKey: ['notes-stats', utilisateurId],
    queryFn: async () => {
      const endpoint = utilisateurId 
        ? `${notesEndpoints.getStats}?utilisateurId=${utilisateurId}`
        : notesEndpoints.getStats;
      const response = await apiClient.get(endpoint);
      return response.data;
    },
  });

  return {
    stats: statsData?.data || null,
    isLoading,
    error,
    refetch,
  };
};

// Hook pour récupérer les notes d'un client
export const useNotesByClient = (clientId: string, query: NotesQuery = {}) => {
  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotesResponse>({
    queryKey: ['notes-client', clientId, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`${notesEndpoints.getByClient(clientId)}?${params.toString()}`);
      return response.data;
    },
    enabled: !!clientId,
  });

  return {
    notes: notesData?.data || [],
    pagination: notesData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    error,
    refetch,
  };
};

// Hook pour récupérer les notes d'un dossier
export const useNotesByDossier = (dossierId: string, query: NotesQuery = {}) => {
  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotesResponse>({
    queryKey: ['notes-dossier', dossierId, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`${notesEndpoints.getByDossier(dossierId)}?${params.toString()}`);
      return response.data;
    },
    enabled: !!dossierId,
  });

  return {
    notes: notesData?.data || [],
    pagination: notesData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    error,
    refetch,
  };
};

// Hook pour récupérer les notes de l'utilisateur connecté
export const useMyNotes = (query: NotesQuery = {}) => {
  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotesResponse>({
    queryKey: ['my-notes', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`${notesEndpoints.getMyNotes}?${params.toString()}`);
      return response.data;
    },
  });

  return {
    notes: notesData?.data || [],
    pagination: notesData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    error,
    refetch,
  };
};

// Hook pour récupérer les statistiques des notes de l'utilisateur connecté
export const useMyNotesStats = () => {
  const {
    data: statsData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ data: NoteStats }>({
    queryKey: ['my-notes-stats'],
    queryFn: async () => {
      const response = await apiClient.get(notesEndpoints.getMyStats);
      return response.data;
    },
  });

  return {
    stats: statsData?.data || null,
    isLoading,
    error,
    refetch,
  };
};