/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useDepenseExport.ts

import { useState } from 'react';
import { QueryDepenseDto } from '@/lib/types/depenses.types';
import { depensesApi } from '@/lib/api/depenses.api';

export const useDepenseExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportToCSV = async (filters: QueryDepenseDto = {}) => {
    setIsExporting(true);
    try {
      // Récupérer toutes les dépenses sans pagination pour l'export
      const allDepenses = await depensesApi.getDepenses({ ...filters, limit: 1000 });
      
      // Préparer les données pour le CSV
      const csvData = allDepenses.data.map(depense => ({
        ID: depense.id,
        Dossier: depense.dossier?.numeroUnique || 'N/A',
        Catégorie: depense.categorie,
        Montant: depense.montant,
        Description: depense.description,
        Date: new Date(depense.dateDepense).toLocaleDateString('fr-FR'),
        Bénéficiaire: depense.beneficiaire || 'N/A',
        Référence: depense.referencePiece || 'N/A',
        Statut: depense.statut,
        'Date de création': new Date(depense.creeLe).toLocaleDateString('fr-FR'),
      }));
      
      // Convertir en CSV
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Échapper les virgules et les guillemets dans les valeurs
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `depenses_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export des dépenses:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToPDF = async (filters: QueryDepenseDto = {}) => {
    setIsExporting(true);
    try {
      // Cette fonction nécessiterait une bibliothèque comme jsPDF ou react-pdf
      // Pour l'instant, nous allons simplement simuler l'export
      console.log('Export PDF non implémenté');
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'export PDF des dépenses:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    exportToCSV,
    exportToPDF,
    isExporting,
  };
};