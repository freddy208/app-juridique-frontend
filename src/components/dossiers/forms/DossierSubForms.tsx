/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================
 * DOSSIER SUB FORMS
 * ============================================
 * 8 formulaires spécifiques pour chaque type de dossier
 * Dynamiquement affichés selon le type sélectionné
 */

'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  GraviteBlessure,
  CategorieVehicule,
  RegimeFoncier,
  EtapeProcedures,
} from '@/lib/types/dossier';
import {
  GRAVITE_BLESSURE_CONFIG,
  CATEGORIE_VEHICULE_CONFIG,
  REGIME_FONCIER_CONFIG,
  ETAPE_PROCEDURES_CONFIG,
} from '@/lib/dossiers/constants';

// ============================================
// 1. SINISTRE CORPOREL
// ============================================

export const SinistreCorporelForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreCorporel.dateAccident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de l&apos;accident</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreCorporel.lieuAccident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de l&apos;accident</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Carrefour Bessengue, Douala" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreCorporel.numeroPvPolice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro PV de police</FormLabel>
              <FormControl>
                <Input placeholder="Ex: PV-2025-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreCorporel.hopital"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hôpital</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Hôpital Général de Douala" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="sinistreCorporel.rapportMedical"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rapport médical</FormLabel>
            <FormControl>
              <Textarea placeholder="Résumé du rapport médical..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="sinistreCorporel.graviteBlessure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gravité des blessures</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(GRAVITE_BLESSURE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreCorporel.assureur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assureur</FormLabel>
              <FormControl>
                <Input placeholder="Ex: ACTIVA Assurances" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreCorporel.numeroSinistre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° de sinistre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: SIN-2025-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="sinistreCorporel.prejudice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Préjudice estimé (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Montant en FCFA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// ============================================
// 2. SINISTRE MATÉRIEL
// ============================================

export const SinistreMaterielForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreMateriel.dateAccident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de l&apos;accident</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMateriel.lieuAccident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de l&apos;accident</FormLabel>
              <FormControl>
                <Input placeholder="Lieu précis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreMateriel.categorieVehicule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie de véhicule</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(CATEGORIE_VEHICULE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMateriel.marqueVehicule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque du véhicule</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="sinistreMateriel.modeleVehicule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corolla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMateriel.immatriculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immatriculation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: LT-1234-AB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMateriel.numeroChassis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° de châssis</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de châssis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreMateriel.assureur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assureur</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'assureur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMateriel.numeroSinistre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° de sinistre</FormLabel>
              <FormControl>
                <Input placeholder="Référence sinistre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="sinistreMateriel.estimationDegats"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimation des dégâts (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Montant en FCFA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// ============================================
// 3. SINISTRE MORTEL
// ============================================

export const SinistreMortelForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreMortel.dateDeces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date du décès</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMortel.lieuDeces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu du décès</FormLabel>
              <FormControl>
                <Input placeholder="Lieu précis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sinistreMortel.certificatDeces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificat de décès</FormLabel>
              <FormControl>
                <Input placeholder="Numéro du certificat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sinistreMortel.certificatMedicoLegal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificat médico-légal</FormLabel>
              <FormControl>
                <Input placeholder="Référence du certificat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="sinistreMortel.numeroPvPolice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro PV de police</FormLabel>
            <FormControl>
              <Input placeholder="Ex: PV-2025-001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sinistreMortel.causeDeces"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cause du décès</FormLabel>
            <FormControl>
              <Textarea placeholder="Description de la cause du décès..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sinistreMortel.indemniteReclamee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indemnité réclamée (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Montant en FCFA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// ============================================
// 4. IMMOBILIER
// ============================================

export const ImmobilierForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="immobilier.adresseBien"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse du bien</FormLabel>
            <FormControl>
              <Input placeholder="Adresse complète du bien immobilier" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="immobilier.numeroTitre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° de titre foncier</FormLabel>
              <FormControl>
                <Input placeholder="Ex: TF-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="immobilier.numeroCadastre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° cadastral</FormLabel>
              <FormControl>
                <Input placeholder="Numéro cadastral" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="immobilier.referenceNotaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence notaire</FormLabel>
              <FormControl>
                <Input placeholder="Référence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="immobilier.regimeFoncier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Régime foncier</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(REGIME_FONCIER_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="immobilier.surfaceM2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surface (m²)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Surface en m²" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="immobilier.typeLitige"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de litige</FormLabel>
            <FormControl>
              <Textarea placeholder="Nature du litige immobilier..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="immobilier.chefQuartier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chef de quartier</FormLabel>
            <FormControl>
              <Input placeholder="Nom du chef de quartier" {...field} />
            </FormControl>
            <FormDescription>Si applicable</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// ============================================
// 5. SPORT
// ============================================

export const SportForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sport.club"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club sportif</FormLabel>
              <FormControl>
                <Input placeholder="Nom du club" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport.competition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compétition</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la compétition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="sport.dateIncident"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de l&apos;incident</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sport.instanceSportive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instance sportive</FormLabel>
              <FormControl>
                <Input placeholder="Ex: FECAFOOT, CAF..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport.referenceContrat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence du contrat</FormLabel>
              <FormControl>
                <Input placeholder="Référence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// ============================================
// 6. CONTRAT
// ============================================

export const ContratForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contrat.partieA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partie A</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la partie A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contrat.partieB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partie B</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la partie B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contrat.dateEffet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d&apos;effet</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contrat.dateExpiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d&apos;expiration</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="contrat.valeurContrat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valeur du contrat (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Montant en FCFA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contrat.loiApplicable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loi applicable</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Droit camerounais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contrat.referenceNotaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence notaire</FormLabel>
              <FormControl>
                <Input placeholder="Référence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// ============================================
// 7. CONTENTIEUX
// ============================================

export const ContentieuxForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contentieux.numeroAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° d&apos;affaire</FormLabel>
              <FormControl>
                <Input placeholder="Ex: RG-2025/001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentieux.tribunal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tribunal</FormLabel>
              <FormControl>
                <Input placeholder="Ex: TGI de Douala" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="contentieux.juridiction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Juridiction</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Cour d'appel du Littoral" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contentieux.demandeur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demandeur</FormLabel>
              <FormControl>
                <Input placeholder="Nom du demandeur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentieux.defendeur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Défendeur</FormLabel>
              <FormControl>
                <Input placeholder="Nom du défendeur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contentieux.avocatPlaignant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avocat du plaignant</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'avocat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentieux.avocatDefenseur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avocat de la défense</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'avocat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="contentieux.etapeProcedure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Étape de la procédure</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(ETAPE_PROCEDURES_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contentieux.montantReclame"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Montant réclamé (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Montant en FCFA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contentieux.rapportHussier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rapport d&apos;huissier</FormLabel>
            <FormControl>
              <Textarea placeholder="Résumé du rapport d'huissier..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// ============================================
// 8. AUTRE
// ============================================

export const AutreForm: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="autre.champs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Informations complémentaires</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ajoutez toutes les informations pertinentes pour ce type de dossier..."
                className="min-h-[200px]"
                {...field}
                value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value || {}, null, 2)}
                onChange={(e: { target: { value: string; }; }) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    field.onChange(parsed);
                  } catch {
                    field.onChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Vous pouvez saisir du texte libre ou du JSON structuré
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};