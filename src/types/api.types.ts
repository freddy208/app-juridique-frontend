/**
 * Types communs pour les réponses API
 */

// Réponse API générique avec données
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Réponse API avec erreur
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

// Réponse paginée
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Paramètres de pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Paramètres de recherche
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
}

// Statuts communs
export type StatutGeneral = "ACTIF" | "INACTIF" | "ARCHIVE" | "SUPPRIME";

// Options de requête
export interface RequestOptions {
  useMock?: boolean;
  skipAuth?: boolean;
  timeout?: number;
}
