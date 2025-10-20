/**
 * Service API pour les Tâches
 */

import { BaseService } from "./base.service";
import {
  Tache,
  CreateTacheDto,
  UpdateTacheDto,
  TacheFilters,
  StatutTache,
} from "@/types/tache.types";
import { PaginatedResponse, PaginationParams } from "@/types/api.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class TachesService extends BaseService {
  constructor() {
    super("/tasks");
  }

  /**
   * Récupérer toutes les tâches avec filtres
   */
  async getTaches(
    filters?: TacheFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Tache>> {
    if (USE_MOCK) {
      console.log("[MOCK] getTaches", filters, pagination);
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        data: MOCK_TACHES,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: MOCK_TACHES.length,
          totalPages: Math.ceil(MOCK_TACHES.length / (pagination?.limit || 10)),
        },
      };
    }

    return this.getAllPaginated<Tache>({ ...filters, ...pagination });
  }

  /**
   * Récupérer une tâche par ID
   */
  async getTacheById(id: string): Promise<Tache> {
    if (USE_MOCK) {
      console.log("[MOCK] getTacheById", id);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const tache = MOCK_TACHES.find((t) => t.id === id);
      if (!tache) {
        throw new Error("Tâche non trouvée");
      }
      return tache;
    }

    return this.getById<Tache>(id);
  }

  /**
   * Créer une nouvelle tâche
   */
  async createTache(data: CreateTacheDto): Promise<Tache> {
    if (USE_MOCK) {
      console.log("[MOCK] createTache", data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTache: Tache = {
        id: `mock-tache-${Date.now()}`,
        dossierId: data.dossierId,
        titre: data.titre,
        description: data.description,
        assigneeId: data.assigneeId,
        creeParId: "user-1",
        dateLimite: data.dateLimite,
        statut: "A_FAIRE",
        priorite: data.priorite || "MOYENNE", // ✅ ajouté
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };

      return newTache;
    }

    return this.create<Tache, CreateTacheDto>(data);
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTache(id: string, data: UpdateTacheDto): Promise<Tache> {
    if (USE_MOCK) {
      console.log("[MOCK] updateTache", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const tache = MOCK_TACHES.find((t) => t.id === id);
      if (!tache) {
        throw new Error("Tâche non trouvée");
      }

    const updated: Tache = {
      ...tache,
      ...(data.titre && { titre: data.titre }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
      ...(data.dateLimite !== undefined && { dateLimite: data.dateLimite }),
      ...(data.statut && { statut: data.statut }),
      ...(data.priorite && { priorite: data.priorite }), // ✅ ajouté
      modifieLe: new Date().toISOString(),
    };


      return updated;
    }

    return this.update<Tache, UpdateTacheDto>(id, data);
  }

  /**
   * Supprimer une tâche
   */
  async deleteTache(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteTache", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    return this.delete(id);
  }

  /**
   * Changer le statut d'une tâche
   */
  async changeStatut(id: string, statut: StatutTache): Promise<Tache> {
    if (USE_MOCK) {
      console.log("[MOCK] changeStatut", id, statut);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const tache = MOCK_TACHES.find((t) => t.id === id);
      if (!tache) {
        throw new Error("Tâche non trouvée");
      }

      return { ...tache, statut, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { statut });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Réassigner une tâche
   */
  async reassignTache(id: string, assigneeId: string): Promise<Tache> {
    if (USE_MOCK) {
      console.log("[MOCK] reassignTache", id, assigneeId);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const tache = MOCK_TACHES.find((t) => t.id === id);
      if (!tache) {
        throw new Error("Tâche non trouvée");
      }

      return { ...tache, assigneeId, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/reassign`, { assigneeId });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer mes tâches (assignées à moi)
   */
  async getMyTaches(userId: string): Promise<Tache[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getMyTaches", userId);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_TACHES.filter((t) => t.assigneeId === userId);
    }

    try {
      const response = await api.get("/tasks/my-tasks");
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les tâches en retard
   */
  async getTachesEnRetard(): Promise<Tache[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getTachesEnRetard");
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const now = new Date();
      return MOCK_TACHES.filter(
        (t) => t.dateLimite && new Date(t.dateLimite) < now && t.statut !== "TERMINEE"
      );
    }

    try {
      const response = await api.get("/tasks/overdue");
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Données mockées
const MOCK_TACHES: Tache[] = [
  {
    id: "tache-1",
    dossierId: "1",
    titre: "Préparer mémoire en défense",
    description: "Rédiger le mémoire pour l'audience du 25/01",
    assigneeId: "user-1",
    creeParId: "user-1",
    dateLimite: "2024-01-24T17:00:00Z",
    statut: "EN_COURS",
    creeLe: "2024-01-18T09:00:00Z",
    modifieLe: "2024-01-20T14:00:00Z",
    dossier: {
      id: "1",
      numeroUnique: "DOS-2024-001",
      titre: "Sinistre corporel - Accident route",
    },
    priorite: "BASSE"
  },
  {
    id: "tache-2",
    dossierId: "2",
    titre: "Rendez-vous client NGONO",
    description: "Réunion pour discuter du litige foncier",
    assigneeId: "user-1",
    creeParId: "user-1",
    dateLimite: "2024-02-05T10:00:00Z",
    statut: "A_FAIRE",
    creeLe: "2024-02-01T10:00:00Z",
    modifieLe: "2024-02-01T10:00:00Z",
    priorite: "BASSE"
  },
  {
    id: "tache-3",
    titre: "Relancer paiement facture #2024-003",
    description: "Client n'a pas encore payé la facture échue",
    assigneeId: "user-2",
    creeParId: "user-1",
    dateLimite: "2024-01-22T12:00:00Z",
    statut: "A_FAIRE",
    creeLe: "2024-01-20T11:00:00Z",
    modifieLe: "2024-01-20T11:00:00Z",
    priorite: "BASSE"
  },
];

export const tachesService = new TachesService();
  