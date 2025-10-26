/**
 * ============================================
 * TYPES & INTERFACES - MODULE CLIENTS
 * ============================================
 */

// ============================================
// ENUMS (synchronisés avec Prisma)
// ============================================

export enum StatutClient {
  ACTIF = "ACTIF",
  INACTIF = "INACTIF",
  PROSPECT = "PROSPECT",
  ARCHIVE = "ARCHIVE",
}

export enum TypeClient {
  PARTICULIER = "PARTICULIER",
  ENTREPRISE = "ENTREPRISE",
  ASSOCIATION = "ASSOCIATION",
  ADMINISTRATION = "ADMINISTRATION",
}

export enum TypeDocument {
  CNI = "CNI",
  PASSEPORT = "PASSEPORT",
  PERMIS_CONDUIRE = "PERMIS_CONDUIRE",
  CARTE_SEJOUR = "CARTE_SEJOUR",
  EXTRAIT_NAISSANCE = "EXTRAIT_NAISSANCE",
  AUTRE = "AUTRE",
}

// ============================================
// INTERFACES CORE
// ============================================

export interface Client {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse?: string | null
  ville?: string | null
  codePostal?: string | null
  pays?: string | null
  typeClient: TypeClient
  statut: StatutClient
  estVip: boolean
  numeroClient?: string | null
  profession?: string | null
  entreprise?: string | null
  notes?: string | null
  derniereVisite?: string | null
  creeLe: string
  modifieLe: string
}

export interface DocumentIdentite {
  id: string
  clientId: string
  typeDocument: TypeDocument
  numeroDocument: string
  dateExpiration?: string | null
  urlDocument?: string | null
  cloudinaryPublicId?: string | null
  creeLe: string
  modifieLe: string
}

export interface NoteClient {
  id: string
  clientId: string
  contenu: string
  auteurId: string
  auteur?: {
    id: string
    prenom: string
    nom: string
  }
  creeLe: string
  modifieLe: string
}

// ============================================
// FORMS DTOs (pour création/modification)
// ============================================

export interface CreateClientForm {
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse?: string
  ville?: string
  codePostal?: string
  pays?: string
  typeClient: TypeClient
  statut?: StatutClient
  estVip?: boolean
  profession?: string
  entreprise?: string
  notes?: string
}

export interface UpdateClientForm {
  prenom?: string
  nom?: string
  email?: string
  telephone?: string
  adresse?: string
  ville?: string
  codePostal?: string
  pays?: string
  typeClient?: TypeClient
  statut?: StatutClient
  estVip?: boolean
  profession?: string
  entreprise?: string
  notes?: string
}

export interface ChangeClientStatusDto {
  statut: StatutClient
  raison?: string
}

export interface AddIdentityDocumentDto {
  typeDocument: TypeDocument
  numeroDocument: string
  dateExpiration?: string
}

export interface AddClientNoteDto {
  contenu: string
}

export interface BulkActionClientsDto {
  clientIds: string[]
  action: "changeStatus" | "delete" | "markVip" | "unmarkVip"
  statut?: StatutClient
  raison?: string
}

// ============================================
// FILTERS & PAGINATION
// ============================================

export interface ClientFilters {
  statut?: StatutClient
  typeClient?: TypeClient
  search?: string
  vipOnly?: boolean
  hasActiveDossiers?: boolean
  hasUnpaidInvoices?: boolean
  ville?: string
  pays?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// STATISTICS & PERFORMANCE
// ============================================

export interface ClientStats {
  nombreDossiers: number
  dossiersActifs: number
  dossiersTermines: number
  dossiersArchives: number
  totalHonoraires: number
  totalPaiements: number
  soldeRestant: number
  tauxPaiement: number
  nombreDocuments: number
  nombreNotes: number
  anciennete: number
}

export interface ClientPerformance {
  clientId: string
  nomComplet: string
  typeClient: string
  nombreDossiers: number
  dossiersTermines: number
  tauxCompletion: number
  chiffreAffaires: number
  paiementsRecus: number
  tauxPaiement: number
  derniereActivite: string
}

export interface GlobalClientStats {
  total: number
  actifs: number
  inactifs: number
  prospects: number
  archives: number
  vip: number
  parType: Record<string, number>
  recentActivity: Array<{
    date: string
    count: number
  }>
}

export interface FinancialSummary {
  totalHonoraires: number
  totalPaiements: number
  soldeRestant: number
  tauxPaiement: number
  facturesImpayees: number
  montantImpaye: number
  derniereFacture?: {
    id: string
    numero: string
    montant: number
    date: string
  }
  dernierPaiement?: {
    id: string
    montant: number
    date: string
  }
}

export interface ClientActivity {
  id: string
  type: string
  description: string
  date: string
  auteur?: {
    id: string
    prenom: string
    nom: string
  }
}

export interface InactiveClient {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  derniereVisite?: string | null
  joursInactivite: number
  nombreDossiers: number
}

// ============================================
// API RESPONSES
// ============================================

export interface ClientResponse {
  data: Client
  message?: string
}

export interface ClientsResponse {
  data: Client[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ClientStatsResponse {
  data: ClientStats
}

export interface ClientPerformanceResponse {
  data: ClientPerformance
}

export interface GlobalClientStatsResponse {
  data: GlobalClientStats
}

export interface FinancialSummaryResponse {
  data: FinancialSummary
}

export interface ClientActivityResponse {
  data: ClientActivity[]
}

export interface InactiveClientsResponse {
  data: InactiveClient[]
}

export interface BulkActionResponse {
  message: string
  count: number
}

export interface DocumentIdentiteResponse {
  data: DocumentIdentite
  message?: string
}

export interface NoteClientResponse {
  data: NoteClient
  message?: string
}

// ============================================
// UTILITY TYPES
// ============================================

export type ClientFormMode = "create" | "edit" | "view"

export interface ClientTableColumn {
  key: keyof Client | "actions"
  label: string
  sortable?: boolean
  width?: string
}

export interface StatusOption {
  value: StatutClient
  label: string
}

export interface TypeClientOption {
  value: TypeClient
  label: string
}

export interface TypeDocumentOption {
  value: TypeDocument
  label: string
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

export interface ClientValidationRules {
  prenom: {
    minLength: number
    maxLength: number
  }
  nom: {
    minLength: number
    maxLength: number
  }
  email: {
    pattern: RegExp
  }
  telephone: {
    pattern: RegExp
    message: string
  }
  codePostal: {
    pattern: RegExp
    message: string
  }
}

export const CLIENT_VALIDATION_RULES: ClientValidationRules = {
  prenom: {
    minLength: 2,
    maxLength: 50,
  },
  nom: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  telephone: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: "Format de téléphone invalide (utilisez le format international: +237...)",
  },
  codePostal: {
    pattern: /^\d{4,10}$/,
    message: "Code postal invalide",
  },
}

// ============================================
// CONSTANTS
// ============================================

export const STATUT_LABELS: Record<StatutClient, string> = {
  [StatutClient.ACTIF]: "Actif",
  [StatutClient.INACTIF]: "Inactif",
  [StatutClient.PROSPECT]: "Prospect",
  [StatutClient.ARCHIVE]: "Archivé",
}

export const TYPE_CLIENT_LABELS: Record<TypeClient, string> = {
  [TypeClient.PARTICULIER]: "Particulier",
  [TypeClient.ENTREPRISE]: "Entreprise",
  [TypeClient.ASSOCIATION]: "Association",
  [TypeClient.ADMINISTRATION]: "Administration",
}

export const TYPE_DOCUMENT_LABELS: Record<TypeDocument, string> = {
  [TypeDocument.CNI]: "Carte Nationale d'Identité",
  [TypeDocument.PASSEPORT]: "Passeport",
  [TypeDocument.PERMIS_CONDUIRE]: "Permis de Conduire",
  [TypeDocument.CARTE_SEJOUR]: "Carte de Séjour",
  [TypeDocument.EXTRAIT_NAISSANCE]: "Extrait de Naissance",
  [TypeDocument.AUTRE]: "Autre",
}

export const STATUT_COLORS: Record<StatutClient, string> = {
  [StatutClient.ACTIF]: "green",
  [StatutClient.INACTIF]: "gray",
  [StatutClient.PROSPECT]: "blue",
  [StatutClient.ARCHIVE]: "red",
}

export const TYPE_CLIENT_COLORS: Record<TypeClient, string> = {
  [TypeClient.PARTICULIER]: "blue",
  [TypeClient.ENTREPRISE]: "purple",
  [TypeClient.ASSOCIATION]: "green",
  [TypeClient.ADMINISTRATION]: "orange",
}

export const statusBadges: Record<
  StatutClient,
  "default" | "destructive" | "success" | "warning" | "secondary" | "blue" | "purple" | "orange" | "teal" | "outline"
> = {
  [StatutClient.ACTIF]: "success",
  [StatutClient.INACTIF]: "secondary",
  [StatutClient.PROSPECT]: "blue",
  [StatutClient.ARCHIVE]: "destructive",
}

// ============================================
// ERROR TYPES
// ============================================

export interface ClientError {
  field?: keyof CreateClientForm | keyof UpdateClientForm
  message: string
  code?: string
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: ClientError[]
}

export interface UpdateClientFormWithId extends UpdateClientForm {
  id: string
}
