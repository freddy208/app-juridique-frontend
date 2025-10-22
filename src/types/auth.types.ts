export type RoleUtilisateur = 
  | "ADMIN" | "DG" | "AVOCAT" | "SECRETAIRE" | "ASSISTANT" | "JURISTE" | "STAGIAIRE";

export type StatutUtilisateur = "ACTIF" | "INACTIF" | "SUSPENDU";

export interface Utilisateur {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
  creeLe: string;
  modifieLe: string;
}
