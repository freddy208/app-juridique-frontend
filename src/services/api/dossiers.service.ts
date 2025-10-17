/**
 * Service API pour les Dossiers
 */

import { BaseService } from "./base.service";
import {
  Dossier,
  CreateDossierDto,
  UpdateDossierDto,
  DossierFilters,
  StatutDossier,
} from "@/types/dossier.types";
import { PaginatedResponse, PaginationParams } from "@/types/api.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class DossiersService extends BaseService {
  constructor() {
    super("/dossiers");
  }

  /**
   * Récupérer tous les dossiers avec filtres
   */
  async getDossiers(
    filters?: DossierFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Dossier>> {
    if (USE_MOCK) {
      console.log("[MOCK] getDossiers", filters, pagination);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        data: MOCK_DOSSIERS,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: MOCK_DOSSIERS.length,
          totalPages: Math.ceil(MOCK_DOSSIERS.length / (pagination?.limit || 10)),
        },
      };
    }

    return this.getAllPaginated<Dossier>({ ...filters, ...pagination });
  }

  /**
   * Récupérer un dossier par ID
   */
  async getDossierById(id: string): Promise<Dossier> {
    if (USE_MOCK) {
      console.log("[MOCK] getDossierById", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dossier = MOCK_DOSSIERS.find((d) => d.id === id);
      if (!dossier) {
        throw new Error("Dossier non trouvé");
      }
      return dossier;
    }

    return this.getById<Dossier>(id);
  }

  /**
   * Créer un nouveau dossier
   */
  async createDossier(data: CreateDossierDto): Promise<Dossier> {
    if (USE_MOCK) {
      console.log("[MOCK] createDossier", data);
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const newDossier: Dossier = {
        id: `mock-${Date.now()}`,
        numeroUnique: `DOS-${Date.now()}`,
        clientId: data.clientId,
        titre: data.titre,
        type: data.type,
        description: data.description,
        responsableId: data.responsableId,
        statut: "OUVERT",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };
      
      return newDossier;
    }

    return this.create<Dossier, CreateDossierDto>(data);
  }

  /**
   * Mettre à jour un dossier
   */
  async updateDossier(id: string, data: UpdateDossierDto): Promise<Dossier> {
    if (USE_MOCK) {
      console.log("[MOCK] updateDossier", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const dossier = MOCK_DOSSIERS.find((d) => d.id === id);
      if (!dossier) {
        throw new Error("Dossier non trouvé");
      }
      
      const updated: Dossier = {
        ...dossier,
        ...(data.titre && { titre: data.titre }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.responsableId !== undefined && { responsableId: data.responsableId }),
        ...(data.statut && { statut: data.statut }),
        modifieLe: new Date().toISOString(),
      };
      
      return updated;
    }

    return this.update<Dossier, UpdateDossierDto>(id, data);
  }

  /**
   * Supprimer un dossier
   */
  async deleteDossier(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteDossier", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    return this.delete(id);
  }

  /**
   * Changer le statut d'un dossier
   */
  async changeStatut(id: string, statut: StatutDossier): Promise<Dossier> {
    if (USE_MOCK) {
      console.log("[MOCK] changeStatut", id, statut);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const dossier = MOCK_DOSSIERS.find((d) => d.id === id);
      if (!dossier) {
        throw new Error("Dossier non trouvé");
      }
      
      return { ...dossier, statut, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { statut });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Réassigner un dossier
   */
  async reassignDossier(id: string, responsableId: string): Promise<Dossier> {
    if (USE_MOCK) {
      console.log("[MOCK] reassignDossier", id, responsableId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const dossier = MOCK_DOSSIERS.find((d) => d.id === id);
      if (!dossier) {
        throw new Error("Dossier non trouvé");
      }
      
      return { ...dossier, responsableId, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/assign`, { responsableId });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Archiver un dossier
   */
  async archiverDossier(id: string): Promise<Dossier> {
    return this.changeStatut(id, "ARCHIVE");
  }

  /**
   * Restaurer un dossier archivé
   */
  async restaurerDossier(id: string): Promise<Dossier> {
    if (USE_MOCK) {
      console.log("[MOCK] restaurerDossier", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const dossier = MOCK_DOSSIERS.find((d) => d.id === id);
      if (!dossier) {
        throw new Error("Dossier non trouvé");
      }
      
      return { ...dossier, statut: "OUVERT", modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/restore`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Exporter les dossiers (Excel/PDF)
   */
  async exportDossiers(filters?: DossierFilters, format: "excel" | "pdf" = "excel"): Promise<Blob> {
    if (USE_MOCK) {
      console.log("[MOCK] exportDossiers", filters, format);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return new Blob(["Mock export data"], { type: "application/octet-stream" });
    }

    try {
      const response = await api.get(`${this.endpoint}/export`, {
        params: { ...filters, format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Données mockées
const MOCK_DOSSIERS: Dossier[] = [
  {
    id: "1",
    numeroUnique: "DOS-2024-001",
    clientId: "client-1",
    titre: "Sinistre corporel - Accident route",
    type: "SINISTRE_CORPOREL",
    description: "Accident de la circulation avec blessures",
    responsableId: "user-1",
    statut: "EN_COURS",
    creeLe: "2024-01-15T10:00:00Z",
    modifieLe: "2024-01-20T14:30:00Z",
    client: {
      id: "client-1",
      prenom: "Jean",
      nom: "MBIDA",
      email: "jean.mbida@email.cm",
      telephone: "+237 6XX XXX XXX",
    },
    responsable: {
      id: "user-1",
      prenom: "Maître",
      nom: "ESSOMBA",
      email: "essomba@cabinet.cm",
      role: "AVOCAT",
    },
  },
  {
    id: "2",
    numeroUnique: "DOS-2024-002",
    clientId: "client-2",
    titre: "Litige foncier - Terrain Douala",
    type: "IMMOBILIER",
    description: "Contestation propriété terrain",
    responsableId: "user-1",
    statut: "OUVERT",
    creeLe: "2024-02-01T09:00:00Z",
    modifieLe: "2024-02-01T09:00:00Z",
    client: {
      id: "client-2",
      prenom: "Marie",
      nom: "NGONO",
      email: "marie.ngono@email.cm",
    },
  },
];

export const dossiersService = new DossiersService();