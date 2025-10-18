// services/messages.service.ts

import { BaseService } from "./base.service";
import {
  MessageChat,
  CreateMessageDto,
  UpdateMessageDto,
  MessageReaction,
} from "@/types/message.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class MessagesService extends BaseService {
  constructor() {
    super("/messages");
  }

  async getMessages(dossierId: string): Promise<MessageChat[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getMessages", dossierId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    try {
      const response = await api.get(`${this.endpoint}?dossierId=${dossierId}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createMessage(data: CreateMessageDto): Promise<MessageChat> {
    if (USE_MOCK) {
      console.log("[MOCK] createMessage", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: `msg-${Date.now()}`,
        dossierId: data.dossierId,
        expediteurId: data.expediteurId, // <- ajouté explicitement
        contenu: data.contenu,
        statut: "ENVOYE",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
        expediteur: { id: data.expediteurId, prenom: "Mock", nom: "User" },
      };
    }

    try {
      const response = await api.post(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateMessage(id: string, data: UpdateMessageDto): Promise<MessageChat> {
    if (USE_MOCK) {
      console.log("[MOCK] updateMessage", id, data);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id,
        contenu: data.contenu || "Updated",
        statut: data.statut || "ENVOYE",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
        expediteurId: "user-1", // <- ajouté explicitement
        expediteur: { id: "user-1", prenom: "Mock", nom: "User" },
      };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteMessage(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteMessage", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addReaction(
    messageId: string,
    utilisateurId: string,
    type: string
  ): Promise<MessageReaction> {
    if (USE_MOCK) {
      console.log("[MOCK] addReaction", messageId, utilisateurId, type);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id: `react-${Date.now()}`,
        messageId,
        utilisateurId,
        type,
        creeLe: new Date().toISOString(),
      };
    }

    try {
      const response = await api.post(`${this.endpoint}/${messageId}/reactions`, { utilisateurId, type });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const messagesService = new MessagesService();
