/* eslint-disable @typescript-eslint/no-explicit-any */

//src/lib/api/client
import axios from "axios"
import { authEndpoints } from "./endpoints"
import { correspondancesApi } from './correspondances.api';
import { commentairesApi } from './commentaires.api';
import { documentsApi } from './documents.api';
import { provisionsApi } from "./provisions.api";
import { depensesApi } from './depenses.api';
import { jurisprudenceApi } from './jurisprudence.api';


const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const noRefreshRoutes = [
      authEndpoints.login,
      authEndpoints.refresh,
      authEndpoints.forgotPassword,
      authEndpoints.resetPassword,
    ]

    const isNoRefreshRoute = noRefreshRoutes.some((route) => originalRequest.url?.includes(route))

    if (isNoRefreshRoute && error.response?.status === 401) {
      return Promise.reject(error)
    }

    const isProfileRequest = originalRequest.url?.includes(authEndpoints.profile)
    const isOnLoginPage =
      typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname === "/")

    if (isProfileRequest && isOnLoginPage && error.response?.status === 401) {
      console.log("ℹ️ Utilisateur non connecté sur la page de login (comportement normal)")
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isNoRefreshRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log("🔄 Tentative de rafraîchissement du token...")
        await apiClient.post(authEndpoints.refresh)
        console.log("✅ Token rafraîchi avec succès")

        processQueue(null)
        return apiClient(originalRequest)
      } catch (err) {
        console.error("❌ Échec du rafraîchissement du token")
        processQueue(err)

        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          console.log("🔴 Session expirée, redirection vers login...")
          window.location.href = "/login"
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
// Ajout à la fin du fichier src/lib/api/client.ts

// Fonction utilitaire pour les requêtes liées aux notes
export const notesApi = {
  // Récupérer toutes les notes avec filtres
  getNotes: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/notes?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer une note par son ID
  getNote: async (id: string) => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },
  
  // Créer une nouvelle note
  createNote: async (noteData: any) => {
    const response = await apiClient.post('/notes', noteData);
    return response.data;
  },
  
  // Mettre à jour une note
  updateNote: async (id: string, noteData: any) => {
    const response = await apiClient.patch(`/notes/${id}`, noteData);
    return response.data;
  },
  
  // Supprimer une note
  deleteNote: async (id: string) => {
    await apiClient.delete(`/notes/${id}`);
    return id;
  },
  
  // Rechercher des notes
  searchNotes: async (searchTerm: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    params.append('q', searchTerm);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/notes/search?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les statistiques des notes
  getNotesStats: async (utilisateurId?: string) => {
    const endpoint = utilisateurId 
      ? `/notes/stats?utilisateurId=${utilisateurId}`
      : '/notes/stats';
    const response = await apiClient.get(endpoint);
    return response.data;
  },
  
  // Récupérer les notes d'un client
  getNotesByClient: async (clientId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/notes/client/${clientId}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les notes d'un dossier
  getNotesByDossier: async (dossierId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/notes/dossier/${dossierId}?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les notes de l'utilisateur connecté
  getMyNotes: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/notes/profile/me?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les statistiques des notes de l'utilisateur connecté
  getMyNotesStats: async () => {
    const response = await apiClient.get('/notes/profile/me/stats');
    return response.data;
  },
};
// Ajouter à la fin du fichier src/lib/api/client.ts

// Fonction utilitaire pour les requêtes liées à la messagerie
export const messagerieApi = {
  // Gestion des discussions
  getDiscussions: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/messagerie/discussions?${params.toString()}`);
    return response.data;
  },
  
  getDiscussion: async (id: string) => {
    const response = await apiClient.get(`/messagerie/discussions/${id}`);
    return response.data;
  },
  
  createDiscussion: async (discussionData: any) => {
    const response = await apiClient.post('/messagerie/discussions', discussionData);
    return response.data;
  },
  
  updateDiscussion: async (id: string, discussionData: any) => {
    const response = await apiClient.patch(`/messagerie/discussions/${id}`, discussionData);
    return response.data;
  },
  
  deleteDiscussion: async (id: string) => {
    await apiClient.delete(`/messagerie/discussions/${id}`);
    return id;
  },
  
  getDiscussionsByDossier: async (dossierId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/messagerie/discussions/dossier/${dossierId}?${params.toString()}`);
    return response.data;
  },
  
  // Gestion des messages
  getMessages: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/messagerie/messages?${params.toString()}`);
    return response.data;
  },
  
  getMessage: async (id: string) => {
    const response = await apiClient.get(`/messagerie/messages/${id}`);
    return response.data;
  },
  
  createMessage: async (messageData: any) => {
    const response = await apiClient.post('/messagerie/messages', messageData);
    return response.data;
  },
  
  updateMessage: async (id: string, messageData: any) => {
    const response = await apiClient.patch(`/messagerie/messages/${id}`, messageData);
    return response.data;
  },
  
  deleteMessage: async (id: string) => {
    await apiClient.delete(`/messagerie/messages/${id}`);
    return id;
  },
  
  getMessagesByDiscussion: async (discussionId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/messagerie/discussions/discussion/${discussionId}/messages?${params.toString()}`);
    return response.data;
  },
  
  // Gestion des réactions
  addReaction: async (messageId: string, reactionData: any) => {
    const response = await apiClient.post(`/messagerie/messages/${messageId}/reactions`, reactionData);
    return response.data;
  },
  
  removeReaction: async (messageId: string) => {
    const response = await apiClient.delete(`/messagerie/messages/${messageId}/reactions`);
    return response.data;
  },
  
  // Statistiques
  getStats: async (utilisateurId?: string) => {
    const endpoint = utilisateurId 
      ? `/messagerie/stats?utilisateurId=${utilisateurId}`
      : '/messagerie/stats';
    const response = await apiClient.get(endpoint);
    return response.data;
  },
};
export {
  correspondancesApi,
};

export {
  commentairesApi,
};

export {
  documentsApi,
};

// Fonction utilitaire pour les requêtes liées aux paiements
export const paiementsApi = {
  // Récupérer tous les paiements avec filtres
  getPaiements: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/paiements?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer un paiement par son ID
  getPaiement: async (id: string) => {
    const response = await apiClient.get(`/paiements/${id}`);
    return response.data;
  },
  
  // Créer un nouveau paiement
  createPaiement: async (paiementData: any) => {
    const response = await apiClient.post('/paiements', paiementData);
    return response.data;
  },
  
  // Mettre à jour un paiement
  updatePaiement: async (id: string, paiementData: any) => {
    const response = await apiClient.patch(`/paiements/${id}`, paiementData);
    return response.data;
  },
  
  // Supprimer un paiement
  deletePaiement: async (id: string) => {
    await apiClient.delete(`/paiements/${id}`);
    return id;
  },
  
  // Valider un paiement
  validerPaiement: async (id: string) => {
    const response = await apiClient.patch(`/paiements/${id}/valider`);
    return response.data;
  },
  
  // Rejeter un paiement
  rejeterPaiement: async (id: string, motif: string) => {
    const response = await apiClient.patch(`/paiements/${id}/rejeter`, { motif });
    return response.data;
  },
  
  // Récupérer les statistiques des paiements
  getPaiementStats: async () => {
    const response = await apiClient.get('/paiements/stats');
    return response.data;
  },
  
  // Récupérer les paiements d'un client
  getPaiementsByClient: async (clientId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    params.append('clientId', clientId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/paiements?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les paiements d'une facture
  getPaiementsByFacture: async (factureId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    params.append('factureId', factureId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/paiements?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les paiements d'un honoraire
  getPaiementsByHonoraire: async (honoraireId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    params.append('honoraireId', honoraireId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/paiements?${params.toString()}`);
    return response.data;
  },
};
// src/lib/api/client.ts (ajout à la fin du fichier)

// Fonction utilitaire pour les requêtes liées aux factures
export const facturesApi = {
  // Récupérer toutes les factures avec filtres
  getFactures: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/factures?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer une facture par son ID
  getFacture: async (id: string) => {
    const response = await apiClient.get(`/factures/${id}`);
    return response.data;
  },
  
  // Créer une nouvelle facture
  createFacture: async (factureData: any) => {
    const response = await apiClient.post('/factures', factureData);
    return response.data;
  },
  
  // Mettre à jour une facture
  updateFacture: async (id: string, factureData: any) => {
    const response = await apiClient.patch(`/factures/${id}`, factureData);
    return response.data;
  },
  
  // Supprimer une facture
  deleteFacture: async (id: string) => {
    await apiClient.delete(`/factures/${id}`);
    return id;
  },
  
  // Marquer une facture comme envoyée
  envoyerFacture: async (id: string) => {
    const response = await apiClient.patch(`/factures/${id}/envoyer`);
    return response.data;
  },
  
  // Récupérer les statistiques des factures
  getFactureStats: async () => {
    const response = await apiClient.get('/factures/stats');
    return response.data;
  },
  
  // Récupérer les factures en retard
  getFacturesEnRetard: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/factures/en-retard?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les factures d'un client
  getFacturesByClient: async (clientId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    params.append('clientId', clientId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/factures?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer les factures d'un dossier
  getFacturesByDossier: async (dossierId: string, query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    params.append('dossierId', dossierId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/factures?${params.toString()}`);
    return response.data;
  },
};
// Ajouter à la fin du fichier src/lib/api/client.ts

// Fonction utilitaire pour les requêtes liées aux honoraires
export const honorairesApi = {
  // Récupérer tous les honoraires avec filtres
  getHonoraires: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/honoraires?${params.toString()}`);
    return response.data;
  },
  
  // Récupérer un honoraire par son ID
  getHonoraire: async (id: string) => {
    const response = await apiClient.get(`/honoraires/${id}`);
    return response.data;
  },
  
  // Créer un nouvel honoraire
  createHonoraire: async (honoraireData: any) => {
    const response = await apiClient.post('/honoraires', honoraireData);
    return response.data;
  },
  
  // Mettre à jour un honoraire
  updateHonoraire: async (id: string, honoraireData: any) => {
    const response = await apiClient.patch(`/honoraires/${id}`, honoraireData);
    return response.data;
  },
  
  // Mettre à jour le statut d'un honoraire
  updateStatutHonoraire: async (id: string, statut: string) => {
    const response = await apiClient.patch(`/honoraires/${id}/statut`, { statut });
    return response.data;
  },
  
  // Supprimer un honoraire
  deleteHonoraire: async (id: string) => {
    await apiClient.delete(`/honoraires/${id}`);
    return id;
  },
  
  // Récupérer les statistiques des honoraires
  getHonorairesStats: async () => {
    const response = await apiClient.get('/honoraires/stats');
    return response.data;
  },
  
  // Récupérer les barèmes OHADA
  getBaremesOHADA: async () => {
    const response = await apiClient.get('/honoraires/baremes-ohada');
    return response.data;
  },
  
  // Calculer un honoraire selon un barème OHADA
  calculerBaremeOHADA: async (baremeId: string, montantBase: number) => {
    const response = await apiClient.get('/honoraires/calculer-bareme', {
      params: { baremeId, montantBase },
    });
    return response.data;
  },
  
  // Récupérer les honoraires en retard
  getHonorairesEnRetard: async (query: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/honoraires/en-retard?${params.toString()}`);
    return response.data;
  },
};
export { provisionsApi };

export {
  depensesApi,
};
export {
  jurisprudenceApi,
};
export default apiClient
