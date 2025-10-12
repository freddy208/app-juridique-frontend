"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield, Award, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, motDePasse);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      
      {/* Colonne gauche - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative  overflow-hidden">
        
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0 opacity-500">
        <Image
          src="/background1.webp"
          alt="Cabinet juridique"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        </div>

        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-amber-800/40"></div>

        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)'
          }}></div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a href="/landing" className="inline-flex items-center space-x-3 group">
              <Scale className="w-10 h-10 text-amber-200 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              <span className="text-2xl font-serif font-bold">
                Cabinet Juridique 237
              </span>
            </a>
          </motion.div>

          {/* Message principal */}
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
                Votre cabinet juridique, digitalisé avec excellence
              </h1>
              <p className="text-xl text-amber-100 leading-relaxed mb-10">
                Rejoignez les professionnels du droit qui ont choisi la modernité sans compromis sur la qualité.
              </p>
            </motion.div>

            {/* Points clés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              {[
                { icon: Shield, text: "Sécurité maximale de vos données" },
                { icon: CheckCircle, text: "Conforme aux normes camerounaises" },
                { icon: Award, text: "Solution certifiée professionnelle" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-700/30 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-amber-200" />
                  </div>
                  <span className="text-amber-50">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-amber-200 text-sm"
          >
            © {new Date().getFullYear()} KPF Services. Tous droits réservés.
          </motion.div>
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-amber-50/10 dark:bg-gray-900">
        <div className="w-full max-w-md">
          
          {/* Logo mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden text-center mb-8"
          >
            <a href="/landing" className="inline-flex items-center space-x-3 mb-4">
              <Scale className="w-8 h-8 text-amber-700" strokeWidth={2.5} />
              <span className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
                Cabinet Juridique 237
              </span>
            </a>
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
              Connexion
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Accédez à votre espace professionnel sécurisé
            </p>
          </motion.div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </motion.div>
          )}

          {/* Formulaire */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            
            {/* Champ Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Adresse e-mail professionnelle
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="avocat@cabinet237.cm"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 hover:text-amber-700 dark:hover:text-amber-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-700 focus:ring-amber-500 dark:focus:ring-amber-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              
              <a 
                href="/mot-de-passe-oublie" 
                className="text-sm font-medium text-amber-700 dark:text-amber-600 hover:text-amber-800 dark:hover:text-amber-500 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-gradient-to-r from-amber-700 to-amber-800 dark:from-amber-800 dark:to-amber-900 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </motion.form>

          {/* Séparateur */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-amber-50/10 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Nouveau sur la plateforme ?
              </span>
            </div>
          </div>

          {/* Lien inscription */}
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            href="/inscription"
            className="block w-full text-center py-3.5 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-amber-700 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all duration-300"
          >
            Créer un compte professionnel
          </motion.a>

          {/* Footer sécurité mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:hidden mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Connexion sécurisée et chiffrée</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}