"use client"

import { useState, useCallback } from "react"
import useSWR, { mutate } from "swr"
import apiClient from "@/lib/api/client"
import { clientsEndpoints } from "@/lib/api/endpoints"
import type {
  Client,
  CreateClientForm,
  UpdateClientForm,
  ClientFilters,
  PaginatedResponse,
  ClientStats,
  ClientPerformance,
  GlobalClientStats,
  FinancialSummary,
  ClientActivity,
  InactiveClient,
  ChangeClientStatusDto,
  AddIdentityDocumentDto,
  AddClientNoteDto,
  BulkActionClientsDto,
  DocumentIdentite,
  NoteClient,
} from "@/lib/types/client.types"

/**
 * ============================================
 * HOOK PRINCIPAL - useClients
 * ============================================
 * Hook complet pour gérer toutes les opérations CRUD des clients
 */

interface UseClientsOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  filters?: ClientFilters
  autoFetch?: boolean
}

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

export function useClients(options: UseClientsOptions = {}) {
  const { page = 1, limit = 10, sortBy = "creeLe", sortOrder = "desc", filters = {}, autoFetch = true } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Construction de la clé SWR avec tous les paramètres
  const buildKey = useCallback(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== "")),
    })
    return `${clientsEndpoints.getAll}?${params.toString()}`
  }, [page, limit, sortBy, sortOrder, filters])

  // Fetcher pour SWR
  const fetcher = async (url: string) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Client>>>(url)
    return response.data.data // Double .data car backend renvoie { data: { data: [...] } }
  }

  // SWR pour la liste des clients
  const {
    data,
    error: swrError,
    isValidating,
  } = useSWR(autoFetch ? buildKey() : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  
  // ============================================
  // CRUD OPERATIONS
  // ============================================

  /**
   * Créer un nouveau client
   */
  const createClient = useCallback(
    async (clientData: CreateClientForm) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<ApiResponse<Client>>(clientsEndpoints.create, clientData)

        // Revalider la liste des clients
        await mutate(buildKey())

        return response.data.data
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création du client"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [buildKey],
  )

  /**
   * Obtenir un client par son ID
   */
  const getClientById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<Client>>(clientsEndpoints.getById(id))
      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération du client"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Mettre à jour un client
   */
  const updateClient = useCallback(
    async (id: string, clientData: UpdateClientForm) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.patch<ApiResponse<Client>>(clientsEndpoints.update(id), clientData)

        // Revalider la liste et le client individuel
        await mutate(buildKey())
        await mutate(clientsEndpoints.getById(id))

        return response.data.data
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour du client"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [buildKey],
  )

  /**
   * Supprimer un client (archivage)
   */
  const deleteClient = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await apiClient.delete(clientsEndpoints.delete(id))

        // Revalider la liste
        await mutate(buildKey())

        return true
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression du client"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [buildKey],
  )

  // ============================================
  // STATISTICS & PERFORMANCE
  // ============================================

  /**
   * Obtenir les statistiques globales des clients
   */
  const getGlobalStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<GlobalClientStats>>(clientsEndpoints.stats)
      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des statistiques"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Obtenir les statistiques d'un client
   */
  const getClientStats = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<ClientStats>>(clientsEndpoints.getClientStats(id))
      return response.data.data
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la récupération des statistiques du client"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Obtenir les performances d'un client
   */
  const getClientPerformance = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<ClientPerformance>>(clientsEndpoints.getClientPerformance(id))
      return response.data.data
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la récupération des performances du client"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Obtenir l'historique d'activité d'un client
   */
  const getClientActivity = useCallback(async (id: string, limit = 50) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<ClientActivity[]>>(
        `${clientsEndpoints.getActivity(id)}?limit=${limit}`,
      )
      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération de l'activité du client"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Obtenir le résumé financier d'un client
   */
  const getFinancialSummary = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<FinancialSummary>>(clientsEndpoints.getFinancialSummary(id))
      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération du résumé financier"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Obtenir les clients inactifs
   */
  const getInactiveClients = useCallback(async (days = 90) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<InactiveClient[]>>(`${clientsEndpoints.inactive}?days=${days}`)
      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des clients inactifs"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================
  // SPECIAL ACTIONS
  // ============================================

  /**
   * Changer le statut d'un client
   */
  const changeStatus = useCallback(
    async (id: string, statusData: ChangeClientStatusDto) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.patch<ApiResponse<Client>>(clientsEndpoints.changeStatus(id), statusData)

        await mutate(buildKey())
        await mutate(clientsEndpoints.getById(id))

        return response.data.data
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors du changement de statut"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [buildKey],
  )

  /**
   * Marquer la dernière visite d'un client
   */
  const markLastVisit = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<ApiResponse<Client>>(clientsEndpoints.markVisit(id))

        await mutate(buildKey())
        await mutate(clientsEndpoints.getById(id))

        return response.data.data
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour de la dernière visite"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [buildKey],
  )

  /**
   * Ajouter un document d'identité
   */
  const addIdentityDocument = useCallback(async (id: string, documentData: AddIdentityDocumentDto, file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("typeDocument", documentData.typeDocument)
      formData.append("numeroDocument", documentData.numeroDocument)
      if (documentData.dateExpiration) {
        formData.append("dateExpiration", documentData.dateExpiration)
      }

      const response = await apiClient.post<ApiResponse<DocumentIdentite>>(clientsEndpoints.addDocument(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      await mutate(clientsEndpoints.getById(id))

      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'ajout du document"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Ajouter une note pour un client
   */
  const addNote = useCallback(async (id: string, noteData: AddClientNoteDto) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post<ApiResponse<NoteClient>>(clientsEndpoints.addNote(id), noteData)

      await mutate(clientsEndpoints.getById(id))

      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'ajout de la note"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Actions en masse sur des clients
   */
  const bulkAction = useCallback(
    async (actionData: BulkActionClientsDto) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<ApiResponse<{ message: string; count: number }>>(
          clientsEndpoints.bulkAction,
          actionData,
        )

        await mutate(buildKey())

        return response.data.data
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'action en masse"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [buildKey],
  )

  /**
   * Obtenir les statuts disponibles
   */
  const getAvailableStatuses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(clientsEndpoints.statuses)
      return response.data.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des statuts"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================
  // RETURN
  // ============================================

  return {
    // Data
    clients: data?.data || [],
    total: data?.total || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    totalPages: data?.totalPages || 0,

    // States
    isLoading: isLoading || isValidating,
    error: error || (swrError ? "Erreur lors du chargement des clients" : null),

    // CRUD Operations
    createClient,
    getClientById,
    updateClient,
    deleteClient,

    // Statistics & Performance
    getGlobalStats,
    getClientStats,
    getClientPerformance,
    getClientActivity,
    getFinancialSummary,
    getInactiveClients,

    // Special Actions
    changeStatus,
    markLastVisit,
    addIdentityDocument,
    addNote,
    bulkAction,
    getAvailableStatuses,

    // Utilities
    refresh: () => mutate(buildKey()),
  }
}

/**
 * ============================================
 * HOOK SECONDAIRE - useClient (client unique)
 * ============================================
 */

export function useClient(id: string | null) {
  const fetcher = async (url: string) => {
    const response = await apiClient.get<ApiResponse<Client>>(url)
    return response.data.data
  }

  const {
    data,
    error,
    isValidating,
    mutate: mutateClient,
  } = useSWR(id ? clientsEndpoints.getById(id) : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  return {
    client: data || null,
    isLoading: isValidating,
    error: error ? "Erreur lors du chargement du client" : null,
    refresh: mutateClient,
  }
}
