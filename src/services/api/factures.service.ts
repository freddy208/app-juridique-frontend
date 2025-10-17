/**
 * Service API pour les Factures
 */

import { BaseService } from "./base.service";
import {
  Facture,
  CreateFactureDto,
  UpdateFactureDto,
  FactureFilters,
  StatutFacture,
} from "@/types/facture.types";
import { PaginatedResponse, PaginationParams } from "@/types/api.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class FacturesService extends BaseService {
  constructor() {
    super("/factures");
  }

  /**
   * Récupérer toutes les factures avec filtres
   */
  async getFactures(
    filters?: FactureFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Facture>> {
    if (USE_MOCK) {
      console.log("[MOCK] getFactures", filters, pagination);
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        data: MOCK_FACTURES,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: MOCK_FACTURES.length,
          totalPages: Math.ceil(MOCK_FACTURES.length / (pagination?.limit || 10)),
        },
      };
    }

    return this.getAllPaginated<Facture>({ ...filters, ...pagination });
  }

  /**
   * Récupérer une facture par ID
   */
  async getFactureById(id: string): Promise<Facture> {
    if (USE_MOCK) {
      console.log("[MOCK] getFactureById", id);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const facture = MOCK_FACTURES.find((f) => f.id === id);
      if (!facture) {
        throw new Error("Facture non trouvée");
      }
      return facture;
    }

    return this.getById<Facture>(id);
  }

  /**
   * Créer une nouvelle facture
   */
  async createFacture(data: CreateFactureDto): Promise<Facture> {
    if (USE_MOCK) {
      console.log("[MOCK] createFacture", data);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newFacture: Facture = {
        id: `mock-facture-${Date.now()}`,
        dossierId: data.dossierId,
        clientId: data.clientId,
        montant: data.montant,
        dateEcheance: data.dateEcheance,
        payee: false,
        statut: "BROUILLON",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };

      return newFacture;
    }

    return this.create<Facture, CreateFactureDto>(data);
  }

  /**
   * Mettre à jour une facture
   */
  async updateFacture(id: string, data: UpdateFactureDto): Promise<Facture> {
    if (USE_MOCK) {
      console.log("[MOCK] updateFacture", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const facture = MOCK_FACTURES.find((f) => f.id === id);
      if (!facture) {
        throw new Error("Facture non trouvée");
      }

      const updated: Facture = {
        ...facture,
        ...(data.montant !== undefined && { montant: data.montant }),
        ...(data.dateEcheance && { dateEcheance: data.dateEcheance }),
        ...(data.statut && { statut: data.statut }),
        ...(data.payee !== undefined && { payee: data.payee }),
        modifieLe: new Date().toISOString(),
      };

      return updated;
    }

    return this.update<Facture, UpdateFactureDto>(id, data);
  }

  /**
   * Supprimer une facture
   */
  async deleteFacture(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteFacture", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    return this.delete(id);
  }

  /**
   * Changer le statut d'une facture
   */
  async changeStatut(id: string, statut: StatutFacture): Promise<Facture> {
    if (USE_MOCK) {
      console.log("[MOCK] changeStatut", id, statut);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const facture = MOCK_FACTURES.find((f) => f.id === id);
      if (!facture) {
        throw new Error("Facture non trouvée");
      }

      return { ...facture, statut, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { statut });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Marquer une facture comme payée
   */
  async marquerPayee(id: string): Promise<Facture> {
    if (USE_MOCK) {
      console.log("[MOCK] marquerPayee", id);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const facture = MOCK_FACTURES.find((f) => f.id === id);
      if (!facture) {
        throw new Error("Facture non trouvée");
      }

      return {
        ...facture,
        payee: true,
        statut: "PAYEE",
        modifieLe: new Date().toISOString(),
      };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/mark-paid`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Générer le PDF d'une facture
   */
  async genererPDF(id: string): Promise<Blob> {
    if (USE_MOCK) {
      console.log("[MOCK] genererPDF", id);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return new Blob(["Mock PDF content"], { type: "application/pdf" });
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/pdf`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Envoyer une facture par email au client
   */
  async envoyerParEmail(id: string, email?: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] envoyerParEmail", id, email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    try {
      await api.post(`${this.endpoint}/${id}/send-email`, { email });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Envoyer une relance de paiement
   */
  async envoyerRelance(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] envoyerRelance", id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    try {
      await api.post(`${this.endpoint}/${id}/send-reminder`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les statistiques financières
   */
  async getStatistiques(): Promise<{
    totalFacture: number;
    totalPaye: number;
    totalImpaye: number;
    totalEnRetard: number;
  }> {
    if (USE_MOCK) {
      console.log("[MOCK] getStatistiques");
      await new Promise((resolve) => setTimeout(resolve, 300));

      const totalFacture = MOCK_FACTURES.reduce((sum, f) => sum + f.montant, 0);
      const totalPaye = MOCK_FACTURES.filter((f) => f.payee).reduce(
        (sum, f) => sum + f.montant,
        0
      );
      const totalImpaye = totalFacture - totalPaye;

      return {
        totalFacture,
        totalPaye,
        totalImpaye,
        totalEnRetard: 850000,
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/stats`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les factures impayées
   */
  async getFacturesImpayees(): Promise<Facture[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getFacturesImpayees");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_FACTURES.filter((f) => !f.payee);
    }

    try {
      const response = await api.get(`${this.endpoint}/unpaid`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les factures en retard
   */
  async getFacturesEnRetard(): Promise<Facture[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getFacturesEnRetard");
      await new Promise((resolve) => setTimeout(resolve, 300));

      const now = new Date();
      return MOCK_FACTURES.filter(
        (f) => !f.payee && new Date(f.dateEcheance) < now
      );
    }

    try {
      const response = await api.get(`${this.endpoint}/overdue`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Exporter les factures (Excel)
   */
  async exportFactures(filters?: FactureFilters, format: "excel" | "pdf" = "excel"): Promise<Blob> {
    if (USE_MOCK) {
      console.log("[MOCK] exportFactures", filters, format);
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

  /**
   * Dupliquer une facture
   */
  async dupliquerFacture(id: string): Promise<Facture> {
    if (USE_MOCK) {
      console.log("[MOCK] dupliquerFacture", id);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const facture = MOCK_FACTURES.find((f) => f.id === id);
      if (!facture) {
        throw new Error("Facture non trouvée");
      }

      return {
        ...facture,
        id: `mock-facture-${Date.now()}`,
        statut: "BROUILLON",
        payee: false,
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };
    }

    try {
      const response = await api.post(`${this.endpoint}/${id}/duplicate`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Données mockées
const MOCK_FACTURES: Facture[] = [
  {
    id: "facture-1",
    dossierId: "1",
    clientId: "client-1",
    montant: 1500000,
    dateEcheance: "2024-02-15T23:59:59Z",
    payee: false,
    statut: "ENVOYEE",
    creeLe: "2024-01-20T10:00:00Z",
    modifieLe: "2024-01-20T10:00:00Z",
    client: {
      id: "client-1",
      prenom: "Jean",
      nom: "MBIDA",
      email: "jean.mbida@email.cm",
      telephone: "+237 677 123 456",
    },
    dossier: {
      id: "1",
      numeroUnique: "DOS-2024-001",
      titre: "Sinistre corporel - Accident route",
    },
  },
  {
    id: "facture-2",
    dossierId: "2",
    clientId: "client-2",
    montant: 2500000,
    dateEcheance: "2024-01-30T23:59:59Z",
    payee: true,
    statut: "PAYEE",
    creeLe: "2024-01-05T14:00:00Z",
    modifieLe: "2024-01-28T16:30:00Z",
    client: {
      id: "client-2",
      prenom: "Marie",
      nom: "NGONO",
      email: "marie.ngono@email.cm",
    },
  },
  {
    id: "facture-3",
    clientId: "client-3",
    montant: 3750000,
    dateEcheance: "2024-01-20T23:59:59Z",
    payee: false,
    statut: "EN_RETARD",
    creeLe: "2023-12-20T09:00:00Z",
    modifieLe: "2024-01-21T10:00:00Z",
    client: {
      id: "client-3",
      prenom: "",
      nom: "TEKAM",
      nomEntreprise: "SARL TEKAM Industries",
      email: "contact@tekam.cm",
    },
  },
];

export const facturesService = new FacturesService();