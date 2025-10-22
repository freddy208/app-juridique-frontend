'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useAuth } from '@/lib/hooks/useAuth'
import { Mail, Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  rememberMe: z.boolean().catch(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.motDePasse)
      toast.success('Connexion réussie')
      router.push('/dashboard')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Partie Gauche */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('../../../../public/background2.webp')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-bordeaux-900/90"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="font-serif text-4xl font-bold mb-6 text-gold-500">
              Cabinet Juridique 237
            </h1>
            <div className="mb-8">
              <p className="text-xl italic mb-4">
                &quot;La justice est la constante et perpétuelle volonté de donner à chacun son droit.&quot;
              </p>
              <p className="text-sm">- Ulpian</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-gold-500" />
                <p>Gestion complète des dossiers juridiques</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-gold-500" />
                <p>Suivi des procédures et échéances</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-gold-500" />
                <p>Base de données de jurisprudence camerounaise</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partie Droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Card className="shadow-premium">
            <CardHeader className="text-center pb-6">
              <h2 className="font-serif text-3xl font-bold text-primary-900 mb-2">
                Connexion à votre espace
              </h2>
              <p className="text-slate-600">
                Accédez à votre cabinet en quelques secondes
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="votre.email@cabinet.cm"
                  icon={<Mail className="h-5 w-5" />}
                  error={errors.email?.message}
                  {...register('email')}
                  autoFocus
                />

                <div>
                  <Input
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5" />}
                    iconPosition="left"
                    error={errors.motDePasse?.message}
                    {...register('motDePasse')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                      {...register('rememberMe')}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                      Rester connecté sur cet appareil
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                >
                  Se connecter
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">OU</span>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-slate-600">
                  <p>Vous n&apos;avez pas encore de compte ?</p>
                  <p>Contactez votre administrateur pour obtenir un accès.</p>
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-success mr-2" />
                  <span className="text-xs text-slate-500">Connexion sécurisée SSL</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}