// src/lib/utils/clientUtils.ts

import { TypeClient, StatutClient, TypeDocumentIdentite } from '../../lib/types/client.types';

export const getTypeClientLabel = (type: TypeClient): string => {
  switch (type) {
    case TypeClient.PARTICULIER:
      return 'Particulier';
    case TypeClient.ENTREPRISE:
      return 'Entreprise';
    case TypeClient.ASSOCIATION:
      return 'Association';
    case TypeClient.ADMINISTRATION:
      return 'Administration';
    default:
      return type;
  }
};

export const getStatutClientLabel = (statut: StatutClient): string => {
  switch (statut) {
    case StatutClient.ACTIF:
      return 'Actif';
    case StatutClient.INACTIF:
      return 'Inactif';
    case StatutClient.ARCHIVE:
      return 'Archivé';
    default:
      return statut;
  }
};

export const getTypeDocumentLabel = (type: TypeDocumentIdentite): string => {
  switch (type) {
    case TypeDocumentIdentite.CNI:
      return 'Carte Nationale d\'Identité';
    case TypeDocumentIdentite.PASSEPORT:
      return 'Passeport';
    case TypeDocumentIdentite.PERMIS_CONDUIRE:
      return 'Permis de conduire';
    case TypeDocumentIdentite.ACTE_NAISSANCE:
      return 'Acte de naissance';
    case TypeDocumentIdentite.REGISTRE_COMMERCE:
      return 'Registre de commerce';
    case TypeDocumentIdentite.STATUTS_ENTREPRISE:
      return 'Statuts de l\'entreprise';
    case TypeDocumentIdentite.AUTRE:
      return 'Autre';
    default:
      return type;
  }
};

export const formatClientFullName = (client: { prenom: string; nom: string; entreprise?: string }): string => {
  const fullName = `${client.prenom} ${client.nom}`;
  return client.entreprise ? `${fullName} (${client.entreprise})` : fullName;
};

export const formatClientAddress = (client: {
  adresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
}): string => {
  const parts = [];
  
  if (client.adresse) parts.push(client.adresse);
  if (client.codePostal) parts.push(client.codePostal);
  if (client.ville) parts.push(client.ville);
  if (client.pays) parts.push(client.pays);
  
  return parts.join(', ');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{6,15}$/;
  return phoneRegex.test(phone);
};