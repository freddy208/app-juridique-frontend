/**
 * ============================================
 * CLIENT TAB CONTENT
 * ============================================
 * Contenu de l'onglet Client
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building2, MapPin, User, ExternalLink, Calendar, Star, Briefcase, Tag, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Client, TypeClient, StatutClient } from '../../../lib/types/client.types';

interface ClientTabContentProps {
  client: Client;
}

const getTypeClientLabel = (type: TypeClient): string => {
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

const getStatutClientLabel = (statut: StatutClient): string => {
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

const getStatutClientColor = (statut: StatutClient): string => {
  switch (statut) {
    case StatutClient.ACTIF:
      return 'text-green-600 bg-green-100';
    case StatutClient.INACTIF:
      return 'text-yellow-600 bg-yellow-100';
    case StatutClient.ARCHIVE:
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const ClientTabContent: React.FC<ClientTabContentProps> = ({ client }) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Détails du client</CardTitle>
            <CardDescription>Informations complètes sur le client associé</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/clients/${client.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir la fiche
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Identité et Type */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-[#4169e1] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Identité</p>
              <p className="font-semibold text-gray-900">
                {client.prenom} {client.nom}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutClientColor(client.statut)}`}>
                  {getStatutClientLabel(client.statut)}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  {getTypeClientLabel(client.typeClient)}
                </span>
                {client.estVIP && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    VIP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Informations Professionnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.entreprise && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Building2 className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Entreprise</p>
                  <p className="font-semibold text-gray-900">{client.entreprise}</p>
                </div>
              </div>
            )}

            {client.profession && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Profession</p>
                  <p className="font-semibold text-gray-900">{client.profession}</p>
                </div>
              </div>
            )}
          </div>

          {/* Informations Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.numeroClient && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Tag className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Numéro client</p>
                  <p className="font-semibold text-gray-900">{client.numeroClient}</p>
                </div>
              </div>
            )}

            {client.chiffreAffaires !== undefined && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Chiffre d&apos;affaires</p>
                  <p className="font-semibold text-gray-900">
                    {client.chiffreAffaires.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                  <a
                    href={`mailto:${client.email}`}
                    className="text-[#4169e1] hover:underline break-all"
                  >
                    {client.email}
                  </a>
                </div>
              </div>
            )}

            {client.telephone && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Téléphone</p>
                  <a
                    href={`tel:${client.telephone}`}
                    className="text-[#4169e1] hover:underline"
                  >
                    {client.telephone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Adresse */}
          {client.adresse && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-[#4169e1] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Adresse</p>
                <p className="text-gray-900">{client.adresse}</p>
                {(client.codePostal || client.ville || client.pays) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {client.codePostal && `${client.codePostal} `}
                    {client.ville && `${client.ville}`}
                    {client.ville && client.pays && ', '}
                    {client.pays}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Dates importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-[#4169e1] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Date de création</p>
                <p className="text-gray-900">
                  {new Date(client.creeLe).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-[#4169e1] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Dernière modification</p>
                <p className="text-gray-900">
                  {new Date(client.modifieLe).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {client.derniereVisite && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-[#4169e1] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Dernière visite</p>
                  <p className="text-gray-900">
                    {new Date(client.derniereVisite).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};