/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/clients/nouveau/page.tsx - VERSION PREMIUM
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Tag,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  Briefcase,
} from "lucide-react"
import { useClients } from "@/lib/hooks/useClients"
import { StatutClient, TypeClient, TYPE_CLIENT_LABELS, STATUT_LABELS } from "@/lib/types/client.types"
import type { CreateClientForm } from "@/lib/types/client.types"
import { toast } from "sonner"

interface FormErrors {
  [key: string]: string
}

// Composant Input personnalisé
const FormInput = ({
  label,
  icon: Icon,
  error,
  required = false,
  ...props
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
          error 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-slate-200 focus:border-primary-500'
        }`}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm flex items-center space-x-1"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

// Composant Textarea personnalisé
const FormTextarea = ({
  label,
  icon: Icon,
  error,
  required = false,
  ...props
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
      )}
      <textarea
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none ${
          error 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-slate-200 focus:border-primary-500'
        }`}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm flex items-center space-x-1"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

// Composant Select personnalisé
const FormSelect = ({
  label,
  icon: Icon,
  error,
  required = false,
  options,
  ...props
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
      )}
      <select
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none bg-white ${
          error 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-slate-200 focus:border-primary-500'
        }`}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm flex items-center space-x-1"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

// Composant Card de section
const SectionCard = ({ 
  title, 
  icon: Icon, 
  children, 
  delay = 0 
}: { 
  title: string
  icon: any
  children: React.ReactNode
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </motion.div>
)

export default function NewClientPage() {
  const router = useRouter()
  const { createClient, isLoading } = useClients({ autoFetch: false })

  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<CreateClientForm>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "Cameroun",
    typeClient: TypeClient.PARTICULIER,
    statut: StatutClient.PROSPECT,
    estVip: false,
    profession: "",
    entreprise: "",
    notes: "",
  })

  const typeClientOptions = [
    { value: TypeClient.PARTICULIER, label: TYPE_CLIENT_LABELS[TypeClient.PARTICULIER] },
    { value: TypeClient.ENTREPRISE, label: TYPE_CLIENT_LABELS[TypeClient.ENTREPRISE] },
  ]

  const statutOptions = [
    { value: StatutClient.PROSPECT, label: STATUT_LABELS[StatutClient.PROSPECT] },
    { value: StatutClient.ACTIF, label: STATUT_LABELS[StatutClient.ACTIF] },
    { value: StatutClient.INACTIF, label: STATUT_LABELS[StatutClient.INACTIF] },
  ]

  const handleChange = (field: keyof CreateClientForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis"
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Erreur de validation", {
        description: "Veuillez corriger les erreurs dans le formulaire",
      })
      return
    }

    try {
      await createClient(formData)
      toast.success("Client créé avec succès", {
        description: `${formData.prenom} ${formData.nom} a été ajouté à votre portefeuille`,
      })
      router.push("/clients")
    } catch {
      toast.error("Erreur lors de la création", {
        description: "Impossible de créer le client. Vérifiez les informations saisies.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Nouveau Client</h1>
              <p className="text-slate-600 text-lg">
                Ajoutez un nouveau client à votre portefeuille juridique
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations Personnelles */}
              <SectionCard title="Informations Personnelles" icon={User} delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Prénom"
                    icon={User}
                    required
                    type="text"
                    placeholder="Jean"
                    value={formData.prenom}
                    onChange={(e: any) => handleChange('prenom', e.target.value)}
                    error={errors.prenom}
                    disabled={isLoading}
                  />

                  <FormInput
                    label="Nom"
                    icon={User}
                    required
                    type="text"
                    placeholder="Dupont"
                    value={formData.nom}
                    onChange={(e: any) => handleChange('nom', e.target.value)}
                    error={errors.nom}
                    disabled={isLoading}
                  />

                  <FormInput
                    label="Email"
                    icon={Mail}
                    required
                    type="email"
                    placeholder="jean.dupont@example.com"
                    value={formData.email}
                    onChange={(e: any) => handleChange('email', e.target.value)}
                    error={errors.email}
                    disabled={isLoading}
                  />

                  <FormInput
                    label="Téléphone"
                    icon={Phone}
                    required
                    type="tel"
                    placeholder="+237 6XX XX XX XX"
                    value={formData.telephone}
                    onChange={(e: any) => handleChange('telephone', e.target.value)}
                    error={errors.telephone}
                    disabled={isLoading}
                  />

                  <FormInput
                    label="Profession"
                    icon={Briefcase}
                    type="text"
                    placeholder="Avocat, Médecin, etc."
                    value={formData.profession}
                    onChange={(e: any) => handleChange('profession', e.target.value)}
                    error={errors.profession}
                    disabled={isLoading}
                  />

                  <FormInput
                    label="Entreprise"
                    icon={Building2}
                    type="text"
                    placeholder="Nom de l'entreprise"
                    value={formData.entreprise}
                    onChange={(e: any) => handleChange('entreprise', e.target.value)}
                    error={errors.entreprise}
                    disabled={isLoading}
                  />
                </div>
              </SectionCard>

              {/* Localisation */}
              <SectionCard title="Localisation" icon={MapPin} delay={0.2}>
                <div className="space-y-6">
                  <FormInput
                    label="Adresse"
                    icon={MapPin}
                    type="text"
                    placeholder="123 Rue de la Paix"
                    value={formData.adresse}
                    onChange={(e: any) => handleChange('adresse', e.target.value)}
                    error={errors.adresse}
                    disabled={isLoading}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                      label="Ville"
                      type="text"
                      placeholder="Yaoundé"
                      value={formData.ville}
                      onChange={(e: any) => handleChange('ville', e.target.value)}
                      error={errors.ville}
                      disabled={isLoading}
                    />

                    <FormInput
                      label="Code Postal"
                      type="text"
                      placeholder="00237"
                      value={formData.codePostal}
                      onChange={(e: any) => handleChange('codePostal', e.target.value)}
                      error={errors.codePostal}
                      disabled={isLoading}
                    />

                    <FormInput
                      label="Pays"
                      type="text"
                      placeholder="Cameroun"
                      value={formData.pays}
                      onChange={(e: any) => handleChange('pays', e.target.value)}
                      error={errors.pays}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Notes */}
              <SectionCard title="Notes" icon={FileText} delay={0.3}>
                <FormTextarea
                  label="Informations complémentaires"
                  icon={FileText}
                  rows={4}
                  placeholder="Ajoutez des notes ou des informations complémentaires..."
                  value={formData.notes}
                  onChange={(e: any) => handleChange('notes', e.target.value)}
                  error={errors.notes}
                  disabled={isLoading}
                />
              </SectionCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Configuration */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6"
              >
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                  <FormSelect
                    label="Type de client"
                    icon={Tag}
                    required
                    value={formData.typeClient}
                    onChange={(e: any) => handleChange('typeClient', e.target.value)}
                    error={errors.typeClient}
                    disabled={isLoading}
                    options={typeClientOptions}
                  />

                  <FormSelect
                    label="Statut"
                    icon={CheckCircle2}
                    required
                    value={formData.statut}
                    onChange={(e: any) => handleChange('statut', e.target.value)}
                    error={errors.statut}
                    disabled={isLoading}
                    options={statutOptions}
                  />

                  {/* Client VIP */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.estVip}
                          onChange={(e) => handleChange('estVip', e.target.checked)}
                          disabled={isLoading}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className={`w-5 h-5 ${formData.estVip ? 'text-yellow-500' : 'text-slate-400'} transition-colors`} />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                          Client VIP
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">Création en cours...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span className="font-medium">Créer le client</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={isLoading}
                      className="w-full px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Conseils */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 rounded-xl border border-blue-200 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">Conseils</h3>
                </div>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Renseignez des informations complètes et exactes</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>L&apos;email doit être valide pour les notifications</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Indiquez le type de client approprié</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Les clients VIP bénéficient d&apos;avantages spéciaux</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}