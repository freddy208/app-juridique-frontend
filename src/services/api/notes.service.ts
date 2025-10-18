// services/notes.service.ts

import { BaseService } from "./base.service";
import { Note, CreateNoteDto, UpdateNoteDto } from "@/types/note.types";
import api from "@/lib/api";
import { handleApiError } from "@/utils/error-handler";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class NotesService extends BaseService {
  constructor() {
    super("/notes");
  }

  // Récupérer toutes les notes pour un dossier ou client
  async getNotes(dossierId?: string, clientId?: string): Promise<Note[]> {
    if (USE_MOCK) {
      console.log("[MOCK] getNotes", dossierId, clientId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    try {
      const query = new URLSearchParams();
      if (dossierId) query.append("dossierId", dossierId);
      if (clientId) query.append("clientId", clientId);

      const response = await api.get(`${this.endpoint}?${query.toString()}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Créer une note
  async createNote(data: CreateNoteDto): Promise<Note> {
    if (USE_MOCK) {
      console.log("[MOCK] createNote", data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: `note-${Date.now()}`,
        ...data,
        statut: "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
        utilisateur: { id: data.utilisateurId, prenom: "Mock", nom: "User" },
      };
    }

    try {
      const response = await api.post(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Mettre à jour une note
  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    if (USE_MOCK) {
      console.log("[MOCK] updateNote", id, data);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id,
        contenu: data.contenu || "Updated note",
        statut: data.statut || "ACTIF",
        creeLe: new Date().toISOString(),
        modifieLe: new Date().toISOString(),
        utilisateurId: "user-1",
        utilisateur: { id: "user-1", prenom: "Mock", nom: "User" },
      };
    }

    try {
      const response = await api.patch(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Supprimer une note
  async deleteNote(id: string): Promise<void> {
    if (USE_MOCK) {
      console.log("[MOCK] deleteNote", id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const notesService = new NotesService();
