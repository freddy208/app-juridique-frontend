/**
 * ============================================
 * CALENDAR WIDGET
 * ============================================
 * Widget calendrier avec événements à venir
 * Mini calendrier + liste des prochains événements
 * Design moderne avec animations
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { fadeInUpVariants } from '@/lib/dashboard/animations';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// ============================================
// CONFIGURATION STATUTS
// ============================================

const statusConfig = {
  PLANIFIE: {
    label: 'Planifié',
    className: 'bg-blue-100 text-blue-700',
  },
  CONFIRME: {
    label: 'Confirmé',
    className: 'bg-green-100 text-green-700',
  },
  EN_ATTENTE: {
    label: 'En attente',
    className: 'bg-orange-100 text-orange-700',
  },
  ANNULE: {
    label: 'Annulé',
    className: 'bg-red-100 text-red-700',
  },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const CalendarWidget: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();
  const [currentDate, setCurrentDate] = useState(new Date());

  const evenements = stats?.evenementsAvenir || [];

  // Obtenir les jours du mois
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation mois
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Vérifier si un jour a des événements
  const hasEvents = (day: Date) => {
    return evenements.some(event => 
      isSameDay(new Date(event.debut), day)
    );
  };

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.8 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">
              Calendrier
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Événements à venir
          </p>
        </div>
      </div>

      {/* Mini calendrier */}
      <div className="mb-6">
        {/* Navigation mois */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-sm font-semibold text-gray-900 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* Jours de la semaine */}
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          
          {/* Jours du mois */}
          {daysInMonth.map((day: Date, index: React.Key | null | undefined) => (
            <div
              key={index}
              className={cn(
                'aspect-square flex items-center justify-center text-sm rounded-lg relative cursor-pointer transition-all',
                isToday(day) && 'bg-[#4169e1] text-white font-bold',
                !isToday(day) && 'hover:bg-gray-100',
                hasEvents(day) && !isToday(day) && 'font-semibold'
              )}
            >
              {format(day, 'd')}
              {hasEvents(day) && (
                <div className={cn(
                  'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                  isToday(day) ? 'bg-white' : 'bg-[#4169e1]'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Liste des événements */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-[#3b82f6] border-r-transparent" />
          </div>
        ) : evenements.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            Aucun événement à venir
          </div>
        ) : (
          evenements.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-[#4169e1] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {event.titre}
                </h4>
                <Badge
                  className={cn(
                    'font-medium text-xs flex-shrink-0',
                    statusConfig[event.statut as keyof typeof statusConfig]?.className ||
                      'bg-gray-100 text-gray-700'
                  )}
                >
                  {statusConfig[event.statut as keyof typeof statusConfig]?.label ||
                    event.statut}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(new Date(event.debut), 'dd MMM yyyy', { locale: fr })}</span>
                <Clock className="h-3.5 w-3.5 ml-1" />
                <span>{format(new Date(event.debut), 'HH:mm')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {evenements.length > 5 && (
        <button className="w-full mt-4 text-sm font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors">
          Voir tous les événements →
        </button>
      )}
    </motion.div>
  );
};