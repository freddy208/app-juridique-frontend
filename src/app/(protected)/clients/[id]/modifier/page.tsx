/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Briefcase,
  Building2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  ClipboardList,
  Users,
} from "lucide-react"
import { useClients } from "@/lib/hooks/useClients"
import { type UpdateClientForm, TypeClient, StatutClient } from "@/lib/types/client.types"
import { toast } from "sonner"

interface FormErrors {
  [key: string]: string;
}

// Form Input Component (aligné avec la page utilisateur)
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
);

// Form Select Component (aligné avec la page utilisateur)
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
);

// Form Textarea Component
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
);

// Section Card Component (aligné avec la page utilisateur)
const SectionCard = ({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  delay?: number;
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
);

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const { getClientById, updateClient } = useClients()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<UpdateClientForm>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    typeClient: TypeClient.PARTICULIER,
    statut: StatutClient.ACTIF,
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "Cameroun",
    entreprise: "",
    profession: "",
    notes: "",
  })

  useEffect(() => {
    const loadClient = async () => {
      try {
        const client = await getClientById(clientId)
        setFormData({
          prenom: client.prenom,
          nom: client.nom,
          email: client.email || "",
          telephone: client.telephone || "",
          typeClient: client.typeClient,
          statut: client.statut,
          adresse: client.adresse || "",
          ville: client.ville || "",
          codePostal: client.codePostal || "",
          pays: client.pays || "Cameroun",
          entreprise: client.entreprise || "",
          profession: client.profession || "",
          notes: client.notes || "",
        })
        setLoading(false)
      } catch (error) {
        toast.error("Erreur lors du chargement du client")
        router.push("/clients")
      }
    }

    loadClient()
  }, [clientId, getClientById, router])

  const handleChange = (field: keyof UpdateClientForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.prenom?.trim()) newErrors.prenom = 'Le prénom est obligatoire'
    if (!formData.nom?.trim()) newErrors.nom = 'Le nom est obligatoire'
    if (!formData.email?.trim()) {
      newErrors.email = "L'email est obligatoire"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }
    if (!formData.telephone?.trim()) {
      newErrors.telephone = 'Le téléphone est obligatoire'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Veuillez corriger les erreurs du formulaire')
      return
    }

    setSubmitting(true)

    try {
      await updateClient(clientId, formData)
      toast.success("Client modifié avec succès")
      router.push(`/clients/${clientId}`)
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification du client")
    } finally {
      setSubmitting(false)
    }
  }

  const typeClientOptions = [
    { value: TypeClient.PARTICULIER, label: 'Particulier' },
    { value: TypeClient.ENTREPRISE, label: 'Entreprise' },
    { value: TypeClient.ASSOCIATION, label: 'Association' },
    { value: TypeClient.ADMINISTRATION, label: 'Administration' },
  ]

  const statutOptions = [
    { value: StatutClient.ACTIF, label: 'Actif' },
    { value: StatutClient.INACTIF, label: 'Inactif' },
    { value: StatutClient.PROSPECT, label: 'Prospect' },
    { value: StatutClient.ARCHIVE, label: 'Archivé' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Modifier le client</h1>
              <p className="text-slate-600">Mettez à jour les informations du client</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Grid Layout Principal (2/3 - 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne Principale (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
              <SectionCard title="Informations personnelles" icon={User} delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Prénom"
                    icon={User}
                    required
                    value={formData.prenom}
                    onChange={(e: any) => handleChange('prenom', e.target.value)}
                    error={errors.prenom}
                    disabled={submitting}
                  />
                  <FormInput
                    label="Nom"
                    icon={User}
                    required
                    value={formData.nom}
                    onChange={(e: any) => handleChange('nom', e.target.value)}
                    error={errors.nom}
                    disabled={submitting}
                  />
                </div>
              </SectionCard>

              {/* Contact */}
              <SectionCard title="Informations de contact" icon={Phone} delay={0.2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Email"
                    icon={Mail}
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e: any) => handleChange('email', e.target.value)}
                    error={errors.email}
                    disabled={submitting}
                  />
                  <FormInput
                    label="Téléphone"
                    icon={Phone}
                    required
                    type="tel"
                    value={formData.telephone}
                    onChange={(e: any) => handleChange('telephone', e.target.value)}
                    error={errors.telephone}
                    disabled={submitting}
                  />
                </div>
              </SectionCard>

              {/* Adresse */}
              <SectionCard title="Adresse" icon={MapPin} delay={0.3}>
                <FormInput
                  label="Adresse complète"
                  icon={MapPin}
                  value={formData.adresse}
                  onChange={(e: any) => handleChange('adresse', e.target.value)}
                  error={errors.adresse}
                  disabled={submitting}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="Ville"
                    icon={Building2}
                    value={formData.ville}
                    onChange={(e: any) => handleChange('ville', e.target.value)}
                    error={errors.ville}
                    disabled={submitting}
                  />
                  <FormInput
                    label="Code postal"
                    value={formData.codePostal}
                    onChange={(e: any) => handleChange('codePostal', e.target.value)}
                    error={errors.codePostal}
                    disabled={submitting}
                  />
                  <FormInput
                    label="Pays"
                    value={formData.pays}
                    onChange={(e: any) => handleChange('pays', e.target.value)}
                    error={errors.pays}
                    disabled={submitting}
                  />
                </div>
              </SectionCard>

              {/* Informations professionnelles */}
              <SectionCard title="Informations professionnelles" icon={Briefcase} delay={0.4}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Entreprise"
                    icon={Building2}
                    value={formData.entreprise}
                    onChange={(e: any) => handleChange('entreprise', e.target.value)}
                    error={errors.entreprise}
                    disabled={submitting}
                  />
                  <FormInput
                    label="Profession"
                    icon={Briefcase}
                    value={formData.profession}
                    onChange={(e: any) => handleChange('profession', e.target.value)}
                    error={errors.profession}
                    disabled={submitting}
                  />
                </div>
              </SectionCard>

              {/* Notes */}
              <SectionCard title="Notes et commentaires" icon={FileText} delay={0.5}>
                <FormTextarea
                  label="Notes internes"
                  icon={FileText}
                  rows={4}
                  value={formData.notes}
                  onChange={(e: any) => handleChange('notes', e.target.value)}
                  error={errors.notes}
                  disabled={submitting}
                  placeholder="Ajoutez des notes sur ce client..."
                />
              </SectionCard>
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-6">
              {/* Configuration */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6"
              >
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                  <FormSelect
                    label="Type de client"
                    icon={Users}
                    required
                    value={formData.typeClient}
                    onChange={(e: any) => handleChange('typeClient', e.target.value)}
                    error={errors.typeClient}
                    disabled={submitting}
                    options={typeClientOptions}
                  />

                  <FormSelect
                    label="Statut"
                    icon={ClipboardList}
                    required
                    value={formData.statut}
                    onChange={(e: any) => handleChange('statut', e.target.value)}
                    error={errors.statut}
                    disabled={submitting}
                    options={statutOptions}
                  />

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">Enregistrement...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span className="font-medium">Enregistrer</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={submitting}
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
                transition={{ delay: 0.7 }}
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
                    <p>Vérifiez bien les informations avant de valider</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>L&apos;email et le téléphone sont obligatoires</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Les notes sont visibles uniquement en interne</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Le client sera notifié des changements importants</p>
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