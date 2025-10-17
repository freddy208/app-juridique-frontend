/**
 * Service API pour les Documents
 */

import { BaseService } from "./base.service";
import {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentFilters,
  UploadResponse,
} from "@/types/document.types";
import { PaginatedResponse, PaginationParams } from "@/types/api.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Type pour la création de document (après upload)
type CreateDocumentData = Omit<CreateDocumentDto, "file"> & { url: string };

class DocumentsService extends BaseService {
  constructor() {
    super("/documents");
  }

  /**
   * Récupérer tous les documents avec filtres
   */
  async getDocuments(
    filters?: DocumentFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Document>> {
    if (USE_MOCK) {
      console.log("[MOCK] getDocuments", filters, pagination);
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        data: MOCK_DOCUMENTS,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: MOCK_DOCUMENTS.length,
          totalPages: Math.ceil(MOCK_DOCUMENTS.length / (pagination?.limit || 10)),
        },
      };
    }

    return this.getAllPaginated<Document>({ ...filters, ...pagination });
  }

  /**
   * Récupérer un document par ID
   */
  async getDocumentById(id: string): Promise<Document> {
    if (USE_MOCK) {
      console.log("[MOCK] getDocumentById", id);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const document = MOCK_DOCUMENTS.find((d) => d.id === id);
      if (!document) {
        throw new Error("Document non trouvé");
      }
      return document;
    }

    return this.getById<Document>(id);
  }

  /**
   * Upload un fichier (retourne l'URL)
   */
  async uploadFile(file: File, dossierId?: string): Promise<UploadResponse> {
    if (USE_MOCK) {
      console.log("[MOCK] uploadFile", file.name, dossierId);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        url: `https://mock-storage.supabase.co/documents/${file.name}`,
        path: `/documents/${file.name}`,
        bucket: "documents",
        size: file.size,
        mimeType: file.type,
      };
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (dossierId) {
        formData.append("dossierId", dossierId);
      }

      const response = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Créer un document (après upload)
   */
  async createDocument(data: CreateDocumentData): Promise<Document> {
    if (USE_MOCK) {
      console.log("[MOCK] createDocument", data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newDocument: Document = {
        id: `mock-doc-${Date.now()}`,
        dossierId: data.dossierId,
        televersePar: "user-1",
        titre: data.titre,
        type: data.type,
        url: data.url,
        version: 1,
        statut: "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };

      return newDocument;
    }

    return this.create<Document, CreateDocumentData>(data);
  }

  /**
   * Upload + Créer document en une seule action
   */
  async uploadAndCreateDocument(data: CreateDocumentDto): Promise<Document> {
    // 1. Upload le fichier
    const uploadResult = await this.uploadFile(data.file, data.dossierId);

    // 2. Créer l'entrée document
    return this.createDocument({
      dossierId: data.dossierId,
      titre: data.titre,
      type: data.type,
      url: uploadResult.url,
    });
  }

  /**
   * Mettre à jour un document (métadonnées uniquement)
   */
  async updateDocument(id: string, data: UpdateDocumentDto): Promise<Document> {
    if (USE_MOCK) {
      console.log("[MOCK] updateDocument", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const document = MOCK_DOCUMENTS.find((d) => d.id === id);
      if (!document) {
        throw new Error("Document non trouvé");
      }

      const updated: Document = {
        ...document,
        ...(data.titre && { titre: data.titre }),
        ...(data.type && { type: data.type }),
        ...(data.statut && { statut: data.statut }),
        modifieLe: new Date().toISOString(),
      };

      return updated;
    }

    return this.update<Document, UpdateDocumentDto>(id, data);
  }

  /**
   * Supprimer un document
   */
  async deleteDocument(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteDocument", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    return this.delete(id);
  }

  /**
   * Archiver un document
   */
  async archiverDocument(id: string): Promise<Document> {
    if (USE_MOCK) {
      console.log("[MOCK] archiverDocument", id);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const document = MOCK_DOCUMENTS.find((d) => d.id === id);
      if (!document) {
        throw new Error("Document non trouvé");
      }

      return { ...document, statut: "ARCHIVE", modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { statut: "ARCHIVE" });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Télécharger un document
   */
  async downloadDocument(id: string): Promise<Blob> {
    if (USE_MOCK) {
      console.log("[MOCK] downloadDocument", id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return new Blob(["Mock file content"], { type: "application/pdf" });
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/download`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les versions d'un document
   */
  async getDocumentVersions(id: string): Promise<Document[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getDocumentVersions", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [];
    }

    try {
      const response = await api.get(`${this.endpoint}/${id}/versions`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Ajouter une nouvelle version d'un document
   */
  async addDocumentVersion(id: string, file: File): Promise<Document> {
    if (USE_MOCK) {
      console.log("[MOCK] addDocumentVersion", id, file.name);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const document = MOCK_DOCUMENTS.find((d) => d.id === id);
      if (!document) {
        throw new Error("Document non trouvé");
      }

      return {
        ...document,
        version: document.version + 1,
        modifieLe: new Date().toISOString(),
      };
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(`${this.endpoint}/${id}/versions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Télécharger plusieurs documents en ZIP
   */
  async downloadMultiple(ids: string[]): Promise<Blob> {
    if (USE_MOCK) {
      console.log("[MOCK] downloadMultiple", ids);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return new Blob(["Mock ZIP content"], { type: "application/zip" });
    }

    try {
      const response = await api.post(
        `${this.endpoint}/download-zip`,
        { ids },
        { responseType: "blob" }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Données mockées
const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    dossierId: "1",
    televersePar: "user-1",
    titre: "Contrat signé - MBIDA",
    type: "Contrat",
    url: "https://mock-storage.supabase.co/documents/contrat-mbida.pdf",
    version: 1,
    statut: "ACTIF",
    creeLe: "2024-01-16T11:00:00Z",
    modifieLe: "2024-01-16T11:00:00Z",
    taille: 245678,
    mimeType: "application/pdf",
  },
  {
    id: "doc-2",
    dossierId: "1",
    televersePar: "user-1",
    titre: "PV Police - Accident",
    type: "PV",
    url: "https://mock-storage.supabase.co/documents/pv-police.pdf",
    version: 1,
    statut: "ACTIF",
    creeLe: "2024-01-17T14:30:00Z",
    modifieLe: "2024-01-17T14:30:00Z",
    taille: 156789,
    mimeType: "application/pdf",
  },
];

export const documentsService = new DocumentsService();