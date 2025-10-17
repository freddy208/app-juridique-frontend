/**
 * Service de base pour tous les services API
 * Fournit les méthodes CRUD communes avec support mock
 */

import api from "@/lib/api";
import { AxiosResponse } from "axios";
import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api.types";
import { handleApiError } from "@/utils/error-handler";

export class BaseService {
  constructor(protected endpoint: string) {}

  /**
   * GET - Récupérer tous les éléments
   */
  protected async getAll<T>(params?: PaginationParams): Promise<T[]> {
    try {
      const response: AxiosResponse<ApiResponse<T[]>> = await api.get(this.endpoint, {
        params,
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * GET - Récupérer tous les éléments (paginé)
   */
  protected async getAllPaginated<T>(
    params?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<PaginatedResponse<T>>> = await api.get(
        this.endpoint,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * GET - Récupérer un élément par ID
   */
  protected async getById<T>(id: string): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.get(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * POST - Créer un nouvel élément
   */
  protected async create<T, D = Partial<T>>(data: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.post(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * PUT - Mettre à jour un élément
   */
  protected async update<T, D = Partial<T>>(id: string, data: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.put(
        `${this.endpoint}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * PATCH - Mettre à jour partiellement un élément
   */
  protected async patch<T, D = Partial<T>>(id: string, data: D): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.patch(
        `${this.endpoint}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * DELETE - Supprimer un élément
   */
  protected async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * DELETE - Suppression en masse
   */
  protected async bulkDelete(ids: string[]): Promise<void> {
    try {
      await api.post(`${this.endpoint}/bulk-delete`, { ids });
    } catch (error) {
      throw handleApiError(error);
    }
  }
}