"use client";
export const dynamic = "force-dynamic";


import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useAuth } from '@/lib/hooks/useAuth'
import { Lock, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token de réinitialisation requis'),
  motDePasse: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[@$!%*?&]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmerMotDePasse: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}).refine((data: { motDePasse: any; confirmerMotDePasse: any }) => data.motDePasse === data.confirmerMotDePasse, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmerMotDePasse'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
    },
  })

  const motDePasse = watch('motDePasse', '')

  // Vérifier la force du mot de passe
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++
    
    const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']
    const colors = ['', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success']
    
    return { strength, label: labels[strength], color: colors[strength] }
  }

  const passwordStrength = getPasswordStrength(motDePasse)

  useEffect(() => {
    if (!token) {
      toast.error('Token de réinitialisation manquant')
      router.push('/forgot-password')
    }
  }, [token, router])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    try {
      await resetPassword(data.token, data.motDePasse)
      setIsSuccess(true)
      toast.success('Mot de passe réinitialisé avec succès')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-slate-100">
      <div className="w-full max-w-md">
        <Card className="shadow-premium">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <RefreshCw className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-2">
              Créer un nouveau mot de passe
            </h2>
            <p className="text-slate-600">
              Choisissez un mot de passe sécurisé
            </p>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    label="Nouveau mot de passe"
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
                  
                  {/* Indicateur de force du mot de passe */}
                  {motDePasse && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-500">Force du mot de passe</span>
                        <span className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    label="Confirmer le mot de passe"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5" />}
                    iconPosition="left"
                    error={errors.confirmerMotDePasse?.message}
                    {...register('confirmerMotDePasse')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Critères de sécurité */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Critères de sécurité:</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      {motDePasse.length >= 8 ? (
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                      ) : (
                        <div className="h-4 w-4 border border-slate-300 rounded-full mr-2" />
                      )}
                      <span className={motDePasse.length >= 8 ? 'text-slate-700' : 'text-slate-500'}>
                        Au moins 8 caractères
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {/[A-Z]/.test(motDePasse) ? (
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                      ) : (
                        <div className="h-4 w-4 border border-slate-300 rounded-full mr-2" />
                      )}
                      <span className={/[A-Z]/.test(motDePasse) ? 'text-slate-700' : 'text-slate-500'}>
                        Une lettre majuscule
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {/[a-z]/.test(motDePasse) ? (
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                      ) : (
                        <div className="h-4 w-4 border border-slate-300 rounded-full mr-2" />
                      )}
                      <span className={/[a-z]/.test(motDePasse) ? 'text-slate-700' : 'text-slate-500'}>
                        Une lettre minuscule
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {/[0-9]/.test(motDePasse) ? (
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                      ) : (
                        <div className="h-4 w-4 border border-slate-300 rounded-full mr-2" />
                      )}
                      <span className={/[0-9]/.test(motDePasse) ? 'text-slate-700' : 'text-slate-500'}>
                        Un chiffre
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {/[@$!%*?&]/.test(motDePasse) ? (
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                      ) : (
                        <div className="h-4 w-4 border border-slate-300 rounded-full mr-2" />
                      )}
                      <span className={/[@$!%*?&]/.test(motDePasse) ? 'text-slate-700' : 'text-slate-500'}>
                        Un caractère spécial (@$!%*?&)
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  disabled={passwordStrength.strength < 3}
                >
                  Réinitialiser le mot de passe
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-success-light rounded-lg">
                  <p className="text-sm text-slate-700">
                    Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                  </p>
                </div>
                <Link href="/login">
                  <Button className="w-full">
                    Se connecter
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}