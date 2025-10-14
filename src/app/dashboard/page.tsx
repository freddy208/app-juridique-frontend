// ============================================
// 2. app/(dashboard)/page.tsx
// Page d'accueil du dashboard (widgets KPIs)
// ============================================
"use client";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Users,
  FileText,
  CheckSquare,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  // Données mockées (à remplacer par vraies données API)
  const stats = [
    {
      icon: FolderOpen,
      label: "Dossiers actifs",
      value: "24",
      change: "+3 ce mois",
      color: "amber",
      trend: "up"
    },
    {
      icon: Users,
      label: "Clients",
      value: "156",
      change: "+12 ce mois",
      color: "blue",
      trend: "up"
    },
    {
      icon: Calendar,
      label: "Audiences cette semaine",
      value: "8",
      change: "3 aujourd'hui",
      color: "purple",
      trend: "neutral"
    },
    {
      icon: DollarSign,
      label: "Revenus du mois",
      value: "4.2M",
      change: "+18% vs mois dernier",
      color: "green",
      trend: "up"
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "dossier",
      title: "Nouveau dossier créé",
      description: "Sinistre corporel - Client MBIDA",
      time: "Il y a 10 min",
      user: "Maître Essomba"
    },
    {
      id: 2,
      type: "document",
      title: "Document signé",
      description: "Contrat_Location_Ngono.pdf",
      time: "Il y a 25 min",
      user: "Secrétariat"
    },
    {
      id: 3,
      type: "tache",
      title: "Tâche terminée",
      description: "Préparation conclusions dossier #2024-045",
      time: "Il y a 1h",
      user: "Maître Fouda"
    },
    {
      id: 4,
      type: "client",
      title: "Nouveau client enregistré",
      description: "SARL TEKAM Industries",
      time: "Il y a 2h",
      user: "Secrétariat"
    },
  ];

  const urgentTasks = [
    {
      id: 1,
      title: "Préparer mémoire en défense",
      dossier: "Dossier #2024-089",
      deadline: "Aujourd'hui 17h",
      priority: "urgent"
    },
    {
      id: 2,
      title: "Rendez-vous client NKOA",
      dossier: "Immobilier - Litige terrain",
      deadline: "Demain 10h",
      priority: "high"
    },
    {
      id: 3,
      title: "Dépôt conclusions au greffe",
      dossier: "Dossier #2024-034",
      deadline: "Dans 2 jours",
      priority: "medium"
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Audience TPI Douala",
      dossier: "Sinistre matériel - MBALLA",
      date: "Aujourd'hui",
      time: "14h30",
      location: "Salle 3"
    },
    {
      id: 2,
      title: "Plaidoirie Cour d'Appel",
      dossier: "Contentieux commercial",
      date: "Demain",
      time: "09h00",
      location: "Salle A"
    },
    {
      id: 3,
      title: "Médiation",
      dossier: "Litige foncier EKOTTO",
      date: "Vendredi",
      time: "15h00",
      location: "Cabinet"
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100"
        >
          Tableau de bord
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400 mt-2"
        >
          Vue d&apos;ensemble de votre activité
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-950/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-500`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid - 2 colonnes */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Colonne gauche (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-amber-700 dark:text-amber-600" />
                  <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
                    Activité récente
                  </h2>
                </div>
                <button className="text-sm text-amber-700 dark:text-amber-600 hover:text-amber-800 dark:hover:text-amber-500 font-medium">
                  Tout voir
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-amber-700 dark:text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tâches urgentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
                    Tâches urgentes
                  </h2>
                </div>
                <button className="text-sm text-amber-700 dark:text-amber-600 hover:text-amber-800 dark:hover:text-amber-500 font-medium">
                  Voir toutes
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-amber-700 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {task.dossier}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                        {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Colonne droite (1/3) */}
        <div className="space-y-6">
          
          {/* Prochaines audiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-700 dark:text-amber-600" />
                <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                  Prochaines audiences
                </h2>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-200 dark:bg-amber-900/50 px-2 py-1 rounded">
                      {event.date}
                    </span>
                    <span className="text-sm font-bold text-amber-900 dark:text-amber-100">
                      {event.time}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {event.dossier}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    📍 {event.location}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button className="w-full flex items-center justify-center space-x-2 text-sm text-amber-700 dark:text-amber-600 hover:text-amber-800 dark:hover:text-amber-500 font-medium">
                <span>Voir le calendrier complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-6 text-white"
          >
            <h3 className="text-lg font-serif font-bold mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left">
                ➕ Nouveau dossier
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left">
                👤 Ajouter client
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left">
                📄 Uploader document
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}