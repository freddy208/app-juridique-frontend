/**
 * Service API pour les Utilisateurs
 */

import { BaseService } from "./base.service";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  statut: string;
  creeLe: string;
  modifieLe: string;
}

export interface CreateUserDto {
  prenom: string;
  nom: string;
  email: string;
  role: string;
  motDePasse: string;
}

export interface UpdateUserDto {
  prenom?: string;
  nom?: string;
  email?: string;
  role?: string;
}

class UsersService extends BaseService {
  constructor() {
    super("/users");
  }

  /**
   * Récupérer tous les utilisateurs
   */
  async getUsers(filters?: { role?: string; statut?: string }): Promise<User[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getUsers", filters);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_USERS;
    }

    try {
      const response = await api.get(this.endpoint, { params: filters });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id: string): Promise<User> {
    if (USE_MOCK) {
      console.log("[MOCK] getUserById", id);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      return user;
    }

    return this.getById<User>(id);
  }

  /**
   * Créer un utilisateur (admin uniquement)
   */
  async createUser(data: CreateUserDto): Promise<User> {
    if (USE_MOCK) {
      console.log("[MOCK] createUser", data);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser: User = {
        id: `mock-user-${Date.now()}`,
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        role: data.role,
        statut: "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
      };

      return newUser;
    }

    return this.create<User, CreateUserDto>(data);
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    if (USE_MOCK) {
      console.log("[MOCK] updateUser", id, data);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      return { ...user, ...data, modifieLe: new Date().toISOString() };
    }

    return this.update<User, UpdateUserDto>(id, data);
  }

  /**
   * Changer le statut d'un utilisateur
   */
  async changeStatut(id: string, statut: "ACTIF" | "INACTIF" | "SUSPENDU"): Promise<User> {
    if (USE_MOCK) {
      console.log("[MOCK] changeStatut", id, statut);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      return { ...user, statut, modifieLe: new Date().toISOString() };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { statut });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Réinitialiser le mot de passe d'un utilisateur
   */
  async resetPassword(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] resetPassword", id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    try {
      await api.post(`${this.endpoint}/${id}/reset-password`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Récupérer les avocats (pour assignation)
   */
  async getAvocats(): Promise<User[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getAvocats");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_USERS.filter((u) => u.role === "AVOCAT");
    }

    try {
      const response = await api.get(this.endpoint, { params: { role: "AVOCAT" } });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Données mockées
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    prenom: "Maître",
    nom: "ESSOMBA",
    email: "essomba@cabinet.cm",
    role: "AVOCAT",
    statut: "ACTIF",
    creeLe: "2024-01-01T00:00:00Z",
    modifieLe: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    prenom: "Sophie",
    nom: "NKOA",
    email: "nkoa@cabinet.cm",
    role: "SECRETAIRE",
    statut: "ACTIF",
    creeLe: "2024-01-01T00:00:00Z",
    modifieLe: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-3",
    prenom: "Admin",
    nom: "CABINET",
    email: "admin@cabinet.cm",
    role: "ADMIN",
    statut: "ACTIF",
    creeLe: "2024-01-01T00:00:00Z",
    modifieLe: "2024-01-01T00:00:00Z",
  },
];

export const usersService = new UsersService();