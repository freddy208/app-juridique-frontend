/**
 * Service API pour les Clients
 */

import { BaseService } from "./base.service";
import {
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientFilters,
  StatutClient,
  ClientDossier,
  ClientFacture,
  ClientNote,
  ClientCorrespondance,
  ClientDocument,
  ClientAudit,
  BackendPaginatedResponse,
  ClientExportData,
} from "@/types/client.types";
import { PaginationParams } from "@/types/api.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class ClientsService extends BaseService {
  constructor() {
    super("/clients");
  }

  /**
   * Récupérer tous les clients avec filtres
   * ✅ CORRIGÉ : Gère la structure de réponse backend
   */
  async getClients(
    filters?: ClientFilters,
    pagination?: PaginationParams
  ): Promise<BackendPaginatedResponse<Client>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClients", filters, pagination);
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        totalCount: MOCK_CLIENTS.length,
        skip: pagination?.skip || 0,
        take: pagination?.take || 10,
        data: MOCK_CLIENTS,
      };
    }

    try {
      const params = { 
        ...filters, 
        skip: pagination?.skip || 0,
        take: pagination?.take || 10,
      };
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer un client par ID
   */
  async getClientById(id: string): Promise<Client> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientById", id);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const client = MOCK_CLIENTS.find((c) => c.id === id);
      if (!client) {
        throw new Error("Client non trouvé");
      }
      return client;
    }

    return this.getById<Client>(id);
  }

  /**
   * Créer un nouveau client
   */
  async createClient(data: CreateClientDto): Promise<Client> {
    if (USE_MOCK) {
      console.log("[MOCK] createClient", data);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newClient: Client = {
        id: `mock-client-${Date.now()}`,
        prenom: data.prenom,
        nom: data.nom,
        nomEntreprise: data.nomEntreprise,
        telephone: data.telephone,
        email: data.email,
        adresse: data.adresse,
        statut: "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };

      return newClient;
    }

    return this.create<Client, CreateClientDto>(data);
  }

  /**
   * Mettre à jour un client
   */
  async updateClient(id: string, data: UpdateClientDto): Promise<Client> {
    if (USE_MOCK) {
      console.log("[MOCK] updateClient", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const client = MOCK_CLIENTS.find((c) => c.id === id);
      if (!client) {
        throw new Error("Client non trouvé");
      }

      const updated: Client = {
        ...client,
        ...(data.prenom && { prenom: data.prenom }),
        ...(data.nom && { nom: data.nom }),
        ...(data.nomEntreprise !== undefined && { nomEntreprise: data.nomEntreprise }),
        ...(data.telephone !== undefined && { telephone: data.telephone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.adresse !== undefined && { adresse: data.adresse }),
        ...(data.statut && { statut: data.statut }),
        modifieLe: new Date().toISOString(),
      };

      return updated;
    }

    return this.update<Client, UpdateClientDto>(id, data);
  }

  /**
   * Supprimer un client
   */
  async deleteClient(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteClient", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    return this.delete(id);
  }

  /**
   * ✅ NOUVEAU : Suppression en masse
   */
  async bulkDeleteClients(ids: string[]): Promise<{ success: boolean; message: string; deletedCount: number }> {
    if (USE_MOCK) {
      console.log("[MOCK] bulkDeleteClients", ids);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: `${ids.length} client(s) supprimé(s) avec succès`,
        deletedCount: ids.length,
      };
    }

    try {
      const response = await api.delete(this.endpoint, { data: { ids } });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Changer le statut d'un client
   */
  async changeStatut(id: string, statut: StatutClient): Promise<Client> {
    if (USE_MOCK) {
      console.log("[MOCK] changeStatut", id, statut);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const client = MOCK_CLIENTS.find((c) => c.id === id);
      if (!client) {
        throw new Error("Client non trouvé");
      }

      return { ...client, statut, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { statut });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les dossiers d'un client
   * ✅ CORRIGÉ : Gère la pagination backend
   */
  async getClientDossiers(
    id: string, 
    skip = 0, 
    take = 10
  ): Promise<BackendPaginatedResponse<ClientDossier>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientDossiers", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalCount: 0,
        skip,
        take,
        data: [],
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/dossiers`, {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * ✅ NOUVEAU : Récupérer les documents d'un client
   */
  async getClientDocuments(
    id: string,
    skip = 0,
    take = 10
  ): Promise<BackendPaginatedResponse<ClientDocument>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientDocuments", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalCount: 0,
        skip,
        take,
        data: [],
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/documents`, {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les factures d'un client
   * ✅ CORRIGÉ : Gère la pagination backend
   */
  async getClientFactures(
    id: string,
    skip = 0,
    take = 10
  ): Promise<BackendPaginatedResponse<ClientFacture>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientFactures", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalCount: 0,
        skip,
        take,
        data: [],
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/factures`, {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les notes d'un client
   * ✅ CORRIGÉ : Gère la pagination backend
   */
  async getClientNotes(
    id: string,
    skip = 0,
    take = 10
  ): Promise<BackendPaginatedResponse<ClientNote>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientNotes", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalCount: 0,
        skip,
        take,
        data: [],
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/notes`, {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Ajouter une note à un client
   */
  async addClientNote(id: string, contenu: string, dossierId?: string): Promise<ClientNote> {
    if (USE_MOCK) {
      console.log("[MOCK] addClientNote", id, contenu);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: `note-${Date.now()}`,
        contenu,
        clientId: id,
        dossierId: dossierId || null,
        utilisateurId: "user-1",
        statut: "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };
    }

    try {
      const response = await api.post(`${this.endpoint}/${id}/notes`, { 
        contenu,
        dossierId,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * ✅ NOUVEAU : Récupérer les correspondances d'un client
   */
  async getClientCorrespondances(
    id: string,
    skip = 0,
    take = 10
  ): Promise<BackendPaginatedResponse<ClientCorrespondance>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientCorrespondances", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalCount: 0,
        skip,
        take,
        data: [],
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/correspondances`, {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * ✅ NOUVEAU : Ajouter une correspondance
   */
  async addClientCorrespondance(
    id: string,
    data: { type: "APPEL" | "EMAIL" | "RENDEZ_VOUS" | "AUTRE"; contenu?: string }
  ): Promise<ClientCorrespondance> {
    if (USE_MOCK) {
      console.log("[MOCK] addClientCorrespondance", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: `corresp-${Date.now()}`,
        clientId: id,
        utilisateurId: "user-1",
        type: data.type,
        contenu: data.contenu || null,
        statut: "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };
    }

    try {
      const response = await api.post(`${this.endpoint}/${id}/correspondances`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * ✅ NOUVEAU : Récupérer l'historique d'audit
   */
  async getClientAudit(
    id: string,
    skip = 0,
    take = 20
  ): Promise<BackendPaginatedResponse<ClientAudit>> {
    if (USE_MOCK) {
      console.log("[MOCK] getClientAudit", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalCount: 0,
        skip,
        take,
        data: [],
      };
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/audit`, {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Exporter les clients (Excel/PDF)
   * ✅ CORRIGÉ : Utilise le bon endpoint
   */
  async exportClients(filters?: ClientFilters): Promise<ClientExportData[]> {
    if (USE_MOCK) {
      console.log("[MOCK] exportClients", filters);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_CLIENTS.map(c => ({
        Prénom: c.prenom,
        Nom: c.nom,
        Entreprise: c.nomEntreprise || 'N/A',
        Email: c.email || 'N/A',
        Téléphone: c.telephone || 'N/A',
        Adresse: c.adresse || 'N/A',
        Statut: c.statut,
        "Nb Dossiers": c._count?.dossiers || 0,
        "CA Total": 0,
        "Créé le": c.creeLe,
      }));
    }

    try {
      const response = await api.get(`${this.endpoint}/export`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Données mockées
const MOCK_CLIENTS: Client[] = [
  {
    id: "client-1",
    prenom: "Jean",
    nom: "MBIDA",
    email: "jean.mbida@email.cm",
    telephone: "+237 677 123 456",
    adresse: "Douala, Akwa",
    statut: "ACTIF",
    creeLe: "2024-01-10T08:00:00Z",
    modifieLe: "2024-01-10T08:00:00Z",
    _count: {
      dossiers: 3,
      factures: 5,
    },
  },
  {
    id: "client-2",
    prenom: "Marie",
    nom: "NGONO",
    email: "marie.ngono@email.cm",
    telephone: "+237 699 987 654",
    adresse: "Yaoundé, Bastos",
    statut: "ACTIF",
    creeLe: "2024-02-01T09:00:00Z",
    modifieLe: "2024-02-01T09:00:00Z",
    _count: {
      dossiers: 1,
      factures: 2,
    },
  },
  {
    id: "client-3",
    prenom: "",
    nom: "TEKAM",
    nomEntreprise: "SARL TEKAM Industries",
    email: "contact@tekam.cm",
    telephone: "+237 233 456 789",
    adresse: "Douala, Bonabéri Zone Industrielle",
    statut: "ACTIF",
    creeLe: "2024-03-15T10:30:00Z",
    modifieLe: "2024-03-15T10:30:00Z",
    _count: {
      dossiers: 2,
      factures: 8,
    },
  },
];

export const clientsService = new ClientsService();