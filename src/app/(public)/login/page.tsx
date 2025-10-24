'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/hooks/useAuth'
import { Mail, Lock, Eye, EyeOff, Shield, Scale, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { InputEnhanced } from '@/components/ui/InputEnhanced'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  rememberMe: z.boolean().catch(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  // ✅ Redirection si déjà authentifié (au chargement de la page)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('👤 Utilisateur déjà authentifié, redirection...')
      router.replace('/parametres/utilisateurs')
    }
  }, [isAuthenticated, authLoading, router])

  // ✅ Fonction de soumission simplifiée
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      console.log('🔵 Tentative de connexion avec:', data.email)
      
      // Attendre que le login soit complètement terminé
      await login(data.email, data.motDePasse)
      
      console.log('✅ Connexion réussie')
      toast.success('Connexion réussie')
      
      // ✅ Redirection immédiate après succès
      router.push('/parametres/utilisateurs')
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error)
      toast.error(error.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Afficher un loader pendant la vérification initiale
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Vérification de votre session...</p>
        </div>
      </div>
    )
  }

  // ✅ Ne pas afficher le formulaire si déjà authentifié
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Redirection en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Section gauche - Image et citation */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/background1.webp')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 to-slate-900/95"></div>
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold-500 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-md text-center"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <Scale className="h-20 w-20 text-gold-500" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </div>
            
            <h1 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              Cabinet Juridique 237
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8"></div>
            
            <div className="mb-10">
              <p className="text-xl italic mb-4 text-primary-100">
                &quot;La justice est la constante et perpétuelle volonté de donner à chacun son droit.&quot;
              </p>
              <p className="text-gold-400">— Ulpian</p>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center space-x-3"
              >
                <Award className="h-6 w-6 text-gold-500" />
                <p className="text-lg">Excellence juridique au service du droit camerounais</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center space-x-3"
              >
                <Scale className="h-6 w-6 text-gold-500" />
                <p className="text-lg">Intégrité et éthique professionnelle</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center space-x-3"
              >
                <Shield className="h-6 w-6 text-gold-500" />
                <p className="text-lg">Sécurité et confidentialité des données</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-primary-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-bordeaux-600 to-bordeaux-600 rounded-full mb-4"
            >
              <Scale className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-2">
              Connexion à votre espace
            </h2>
            <p className="text-slate-600">
              Accédez à votre cabinet juridique en toute sécurité
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <InputEnhanced
                  {...register('email')}
                  type="email"
                  placeholder="exemple@cabinet237.com"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Mot de passe */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <InputEnhanced
                  {...register('motDePasse')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.motDePasse && (
                <p className="mt-1 text-sm text-red-600">{errors.motDePasse.message}</p>
              )}
            </motion.div>

            {/* Se souvenir de moi et Mot de passe oublié */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-bordeaux-600 focus:ring-bordeaux-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-slate-600">Se souvenir de moi</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-bordeaux-600 hover:text-bordeaux-700 font-medium transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </motion.div>

            {/* Bouton de connexion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="ml-2">Connexion en cours...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Se connecter
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Message de sécurité */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                Votre connexion est sécurisée et vos données sont protégées conformément 
                aux normes de confidentialité juridique.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}