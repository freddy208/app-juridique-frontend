/**
 * Service API pour les Événements du calendrier
 */

import { BaseService } from "./base.service";
import {
  EvenementCalendrier,
  CreateEvenementDto,
  UpdateEvenementDto,
  EvenementFilters,
  PaginatedEvenements,
} from "@/types/evenement.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class EvenementsService extends BaseService {
  constructor() {
    super("/evenements");
  }

  /**
   * Récupérer les événements avec filtres/pagination
   */
  async getEvenements(
    filters?: EvenementFilters,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedEvenements> {
    if (USE_MOCK) {
      console.log("[MOCK] getEvenements", filters, pagination);
      await new Promise((r) => setTimeout(r, 300));

      const filtered = MOCK_EVENEMENTS.filter((e) => {
        if (filters?.dossierId && e.dossierId !== filters.dossierId) return false;
        if (filters?.creeParId && e.creeParId !== filters.creeParId) return false;
        if (filters?.statut && e.statut !== filters.statut) return false;
        return true;
      });

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return {
        data: paged,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
        },
      };
    }

    try {
      const response = await api.get(this.endpoint, {
        params: { ...filters, ...pagination },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer un événement par ID
   */
  async getEvenementById(id: string): Promise<EvenementCalendrier> {
    if (USE_MOCK) {
      console.log("[MOCK] getEvenementById", id);
      await new Promise((r) => setTimeout(r, 200));
      const found = MOCK_EVENEMENTS.find((e) => e.id === id);
      if (!found) throw new Error("Événement non trouvé");
      return found;
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Créer un nouvel événement
   */
  async createEvenement(data: CreateEvenementDto): Promise<EvenementCalendrier> {
    if (USE_MOCK) {
      console.log("[MOCK] createEvenement", data);
      await new Promise((r) => setTimeout(r, 300));

      const newEvent: EvenementCalendrier = {
        id: `evt-${Date.now()}`,
        dossierId: data.dossierId || null,
        titre: data.titre,
        description: data.description || null,
        debut: data.debut,
        fin: data.fin,
        creeParId: data.creeParId,
        statut: data.statut || "PREVU",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };
      MOCK_EVENEMENTS.unshift(newEvent);
      return newEvent;
    }

    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Mettre à jour un événement
   */
  async updateEvenement(id: string, data: UpdateEvenementDto): Promise<EvenementCalendrier> {
    if (USE_MOCK) {
      console.log("[MOCK] updateEvenement", id, data);
      await new Promise((r) => setTimeout(r, 200));
      const idx = MOCK_EVENEMENTS.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error("Événement non trouvé");
      MOCK_EVENEMENTS[idx] = { ...MOCK_EVENEMENTS[idx], ...data, modifieLe: new Date().toISOString() };
      return MOCK_EVENEMENTS[idx];
    }

    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Supprimer un événement
   */
  async deleteEvenement(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteEvenement", id);
      await new Promise((r) => setTimeout(r, 200));
      const idx = MOCK_EVENEMENTS.findIndex((e) => e.id === id);
      if (idx !== -1) MOCK_EVENEMENTS.splice(idx, 1);
      return;
    }

    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtenir les événements à venir d’un utilisateur
   */
  async getUpcomingEvents(utilisateurId: string): Promise<EvenementCalendrier[]> {
    if (USE_MOCK) {
      const now = new Date().toISOString();
      return MOCK_EVENEMENTS.filter(
        (e) => e.creeParId === utilisateurId && e.debut > now && e.statut === "PREVU"
      );
    }

    try {
      const response = await api.get(`${this.endpoint}/upcoming`, {
        params: { utilisateurId },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * Données Mockées (pour tests en local)
 */
const MOCK_EVENEMENTS: EvenementCalendrier[] = [
  {
    id: "evt-1",
    dossierId: "dossier-1",
    titre: "Audience au tribunal",
    description: "Affaire contre X prévue au tribunal de Yaoundé.",
    debut: "2025-10-25T09:00:00Z",
    fin: "2025-10-25T12:00:00Z",
    creeParId: "user-1",
    statut: "PREVU",
    creeLe: "2025-10-01T08:00:00Z",
    modifieLe: "2025-10-01T08:00:00Z",
  },
  {
    id: "evt-2",
    dossierId: "dossier-2",
    titre: "Réunion interne du cabinet",
    description: "Préparation des plaidoiries de la semaine prochaine.",
    debut: "2025-10-18T14:00:00Z",
    fin: "2025-10-18T16:00:00Z",
    creeParId: "user-2",
    statut: "PREVU",
    creeLe: "2025-10-02T09:00:00Z",
    modifieLe: "2025-10-02T09:00:00Z",
  },
];

export const evenementsService = new EvenementsService();
