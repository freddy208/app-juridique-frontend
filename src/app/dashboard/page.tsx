/**
 * Page d'accueil du dashboard
 * Design harmonieux avec palette professionnelle
 */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context/AuthProvider";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Activity,
  FileText
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // ⚡ PROTECTION : Redirection si non connecté
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Afficher le loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Données mockées
  const stats = [
    { icon: FolderOpen, label: "Dossiers actifs", value: "24", change: "+3 ce mois", color: "amber" },
    { icon: Users, label: "Clients", value: "156", change: "+12 ce mois", color: "blue" },
    { icon: Calendar, label: "Audiences cette semaine", value: "8", change: "3 aujourd'hui", color: "purple" },
    { icon: DollarSign, label: "Revenus du mois", value: "4.2M", change: "+18% vs mois dernier", color: "green" },
  ];

  const recentActivities = [
    { id: 1, type: "dossier", title: "Nouveau dossier créé", description: "Sinistre corporel - Client MBIDA", time: "Il y a 10 min", user: "Maître Essomba" },
    { id: 2, type: "document", title: "Document signé", description: "Contrat_Location_Ngono.pdf", time: "Il y a 25 min", user: "Secrétariat" },
    { id: 3, type: "tache", title: "Tâche terminée", description: "Préparation conclusions dossier #2024-045", time: "Il y a 1h", user: "Maître Fouda" },
    { id: 4, type: "client", title: "Nouveau client enregistré", description: "SARL TEKAM Industries", time: "Il y a 2h", user: "Secrétariat" },
  ];

  const urgentTasks = [
    { id: 1, title: "Préparer mémoire en défense", dossier: "Dossier #2024-089", deadline: "Aujourd'hui 17h" },
    { id: 2, title: "Rendez-vous client NKOA", dossier: "Immobilier - Litige terrain", deadline: "Demain 10h" },
    { id: 3, title: "Dépôt conclusions au greffe", dossier: "Dossier #2024-034", deadline: "Dans 2 jours" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Audience TPI Douala", dossier: "Sinistre matériel - MBALLA", date: "Aujourd'hui", time: "14h30", location: "Salle 3" },
    { id: 2, title: "Plaidoirie Cour d'Appel", dossier: "Contentieux commercial", date: "Demain", time: "09h00", location: "Salle A" },
    { id: 3, title: "Médiation", dossier: "Litige foncier EKOTTO", date: "Vendredi", time: "15h00", location: "Cabinet" },
  ];

  const colorClasses = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          Tableau de bord
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 mt-2">
          Bienvenue {user.prenom || user.email} - Vue d&apos;ensemble de votre activité
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center space-x-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activité récente */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-amber-700" />
                  <h2 className="text-xl font-serif font-bold text-gray-900">Activité récente</h2>
                </div>
                <button className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors">Tout voir</button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h2 className="text-xl font-serif font-bold text-gray-900">Tâches urgentes</h2>
                </div>
                <button className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors">Voir toutes</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-amber-700 focus:ring-amber-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{task.dossier}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">{task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          {/* Prochaines audiences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-serif font-bold text-gray-900">Prochaines audiences</h2>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-lg bg-amber-50 border border-amber-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-1 rounded border border-amber-200">{event.date}</span>
                    <span className="text-sm font-bold text-amber-900">{event.time}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{event.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{event.dossier}</p>
                  <p className="text-xs text-gray-500">📍 {event.location}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center space-x-2 text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors">
                <span>Voir le calendrier complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-serif font-bold mb-4">Actions rapides</h3>
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