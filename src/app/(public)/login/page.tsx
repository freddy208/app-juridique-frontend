// src/app/(public)/login/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
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
  const hasRedirected = useRef(false) // ✅ Pour éviter les boucles

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

  // ✅ Rediriger uniquement au chargement initial si déjà authentifié
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/parametres/utilisateurs') // ✅ replace au lieu de push
    }
  }, [isAuthenticated, authLoading, router])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.motDePasse)
      toast.success('Connexion réussie')
      hasRedirected.current = true // ✅ Marquer comme redirigé
      router.replace('/parametres/utilisateurs') // ✅ replace au lieu de push
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Afficher un loader pendant la vérification de l'auth
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

  // ✅ Ne rien afficher si déjà authentifié
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* ... Le reste de votre code JSX reste identique ... */}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InputEnhanced
                label="Adresse email"
                type="email"
                placeholder="votre.email@cabinet.cm"
                icon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
                autoFocus
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >  
            <InputEnhanced
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                actionIcon={showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                onActionClick={() => setShowPassword(!showPassword)}
                error={errors.motDePasse?.message}
                {...register('motDePasse')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Rester connecté
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                Mot de passe oublié ?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-bordeaux-600 to-bordeaux-600 hover:from-bordeaux-700 hover:to-bordeaux-700 text-white font-semibold shadow-premium py-3 rounded-lg group"
                loading={isLoading}
              >
                Se connecter
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-slate-50 to-primary-50 text-slate-500">OU</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-600">
              <p>Vous n&apos;avez pas encore de compte ?</p>
              <p className="font-medium">Contactez votre administrateur pour obtenir un accès.</p>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <Shield className="h-4 w-4 text-success mr-2" />
              <span className="text-xs text-slate-500">Connexion sécurisée avec chiffrement SSL</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}