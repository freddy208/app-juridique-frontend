/**
 * Page Dashboard Premium
 * Design sophistiqué pour cabinet d'avocats
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { icon: FolderOpen, label: "Dossiers actifs", value: "24", change: "+3 ce mois", color: "amber" },
    { icon: Users, label: "Clients", value: "156", change: "+12 ce mois", color: "blue" },
    { icon: Calendar, label: "Audiences cette semaine", value: "8", change: "3 aujourd'hui", color: "purple" },
    { icon: DollarSign, label: "Revenus du mois", value: "4.2M FCFA", change: "+18%", color: "green" },
  ];

  const recentActivities = [
    { id: 1, title: "Nouveau dossier créé", description: "Sinistre corporel - Client MBIDA", time: "Il y a 10 min", user: "Maître Essomba" },
    { id: 2, title: "Document signé", description: "Contrat_Location_Ngono.pdf", time: "Il y a 25 min", user: "Secrétariat" },
    { id: 3, title: "Tâche terminée", description: "Préparation conclusions dossier #2024-045", time: "Il y a 1h", user: "Maître Fouda" },
    { id: 4, title: "Nouveau client enregistré", description: "SARL TEKAM Industries", time: "Il y a 2h", user: "Secrétariat" },
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
    amber: "from-amber-500/10 to-amber-600/5 border-amber-200/50",
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200/50",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-200/50",
    green: "from-green-500/10 to-green-600/5 border-green-200/50"
  };

  const iconColors = {
    amber: "text-amber-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
    green: "text-green-700"
  };

  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight">
          Tableau de bord
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
          className="text-slate-600 mt-2 font-medium">
          Bienvenue {user.prenom || user.email} - Vue d&apos;ensemble de votre activité
        </motion.p>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-2xl p-6 border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden`}>
              {/* Effet de brillance */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-semibold mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                  <div className="flex items-center space-x-1 text-xs">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm`}>
                  <Icon className={`w-6 h-6 ${iconColors[stat.color as keyof typeof iconColors]}`} />
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
          {/* Activité récente Premium */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100/80">
                    <Activity className="w-5 h-5 text-amber-700" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Activité récente</h2>
                </div>
                <button className="text-sm text-amber-700 hover:text-amber-800 font-semibold transition-colors">Tout voir</button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 font-medium">
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

          {/* Tâches urgentes Premium */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-red-50/50 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-100/80">
                    <AlertCircle className="w-5 h-5 text-red-700" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Tâches urgentes</h2>
                </div>
                <button className="text-sm text-amber-700 hover:text-amber-800 font-semibold transition-colors">Voir toutes</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200/60 hover:border-amber-300/60 hover:bg-amber-50/30 transition-all cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-amber-700 focus:ring-amber-600" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 group-hover:text-amber-900">{task.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{task.dossier}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-semibold">{task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          {/* Prochaines audiences Premium */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-50/50 to-transparent">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100/80">
                  <Calendar className="w-5 h-5 text-purple-700" />
                </div>
                <h2 className="text-lg font-serif font-bold text-slate-900">Prochaines audiences</h2>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/30 border border-amber-200/50 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded-lg border border-amber-300/50">{event.date}</span>
                    <span className="text-sm font-bold text-amber-900">{event.time}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{event.title}</p>
                  <p className="text-xs text-slate-600 mb-2">{event.dossier}</p>
                  <p className="text-xs text-slate-500 font-medium">📍 {event.location}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200/60">
              <button className="w-full flex items-center justify-center space-x-2 text-sm text-amber-700 hover:text-amber-800 font-semibold transition-colors">
                <span>Voir le calendrier complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Quick actions Premium */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
            {/* Effet lumineux */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl"></div>
            
            <div className="relative">
              <h3 className="text-lg font-serif font-bold mb-4 flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                <span>Actions rapides</span>
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 text-left border border-white/10 hover:border-white/20 hover:scale-[1.02] flex items-center space-x-3">
                  <span className="text-xl">➕</span>
                  <span>Nouveau dossier</span>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 text-left border border-white/10 hover:border-white/20 hover:scale-[1.02] flex items-center space-x-3">
                  <span className="text-xl">👤</span>
                  <span>Ajouter client</span>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 text-left border border-white/10 hover:border-white/20 hover:scale-[1.02] flex items-center space-x-3">
                  <span className="text-xl">📄</span>
                  <span>Uploader document</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}