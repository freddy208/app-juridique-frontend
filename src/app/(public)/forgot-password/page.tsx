'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useAuth } from '@/lib/hooks/useAuth'
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { forgotPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
      toast.success('Email de réinitialisation envoyé')
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
              Mot de passe oublié ?
            </h2>
            <p className="text-slate-600">
              Nous allons vous envoyer un lien de réinitialisation
            </p>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Votre adresse email"
                  type="email"
                  placeholder="votre.email@cabinet.cm"
                  icon={<Mail className="h-5 w-5" />}
                  error={errors.email?.message}
                  {...register('email')}
                  autoFocus
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                >
                  Envoyer le lien
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-info-light rounded-lg">
                  <p className="text-sm text-slate-700">
                    Un email avec les instructions sera envoyé si cette adresse est enregistrée dans notre système.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
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