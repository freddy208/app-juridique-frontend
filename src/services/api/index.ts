/**
 * Export centralisé de tous les services API
 * Utilisation: import { dossiersService, clientsService } from '@/services/api';
 */

export { dossiersService } from "./dossiers.service";
export { clientsService } from "./clients.service";
export { documentsService } from "./documents.service";
export { tachesService } from "./taches.service";
export { facturesService } from "./factures.service";

// Re-export du BaseService pour extension personnalisée si nécessaire
export { BaseService } from "./base.service";