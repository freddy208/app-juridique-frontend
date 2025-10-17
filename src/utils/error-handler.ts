/**
 * Gestionnaire d'erreurs centralisé
 */

import axios from "axios";
import { ApiError } from "@/types/api.types";

export class AppError<T = unknown> extends Error {
  constructor(
    public message: string,
    public code: string = "UNKNOWN_ERROR",
    public statusCode: number = 500,
    public details?: T
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;

    // Typage exact du contenu de `details`
    type ApiErrorDetails = typeof apiError.error.details;

    return new AppError<ApiErrorDetails>(
      apiError?.error?.message || error.message || "Une erreur est survenue",
      apiError?.error?.code || "API_ERROR",
      error.response?.status || 500,
      apiError?.error?.details
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, "CLIENT_ERROR", 500);
  }

  return new AppError("Une erreur inconnue est survenue", "UNKNOWN_ERROR", 500);
};

export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  TOKEN_EXPIRED: "Votre session a expiré, veuillez vous reconnecter",
  UNAUTHORIZED: "Vous n'êtes pas autorisé à effectuer cette action",
  VALIDATION_ERROR: "Les données fournies sont invalides",
  MISSING_FIELD: "Un champ obligatoire est manquant",
  NOT_FOUND: "La ressource demandée n'existe pas",
  ALREADY_EXISTS: "Cette ressource existe déjà",
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires",
  SERVER_ERROR: "Une erreur serveur est survenue",
  NETWORK_ERROR: "Erreur de connexion au serveur",
};

export const getErrorMessage = (error: AppError | Error): string => {
  if (error instanceof AppError) {
    return ERROR_MESSAGES[error.code] || error.message;
  }
  return error.message || "Une erreur est survenue";
};
