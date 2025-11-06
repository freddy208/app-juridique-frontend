'use client'

import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from "next/image"
import { 
  Scale, 
  Gavel, 
  BookOpen, 
  Award, 
  ChevronRight,
  Library,
  Building,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  
  const legalQuotes = [
    {
      text: "La justice est la constante et perpétuelle volonté de donner à chacun son droit.",
      author: "Ulpian",
      origin: "Juriste romain"
    },
    {
      text: "Où il n'ya pas de justice, il n'y a pas de liberté.",
      author: "John Adams",
      origin: "Père fondateur des États-Unis"
    },
    {
      text: "La loi doit être comme la mort, qui n'épargne ni petit ni grand.",
      author: "Henri Estienne",
      origin: "Humaniste français"
    },
    {
      text: "Le droit est l'ensemble des règles qui régissent la conduite de l'homme en société.",
      author: "Jean Carbonnier",
      origin: "Juriste français"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % legalQuotes.length)
    }, 8000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section avec animation de fond */}
      <section className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground/>

        {/* Contenu principal */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo et titre */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
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
                </div>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Cabinet Juridique 237
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
            </motion.div>

            {/* Citation juridique animée */}
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-12 max-w-3xl mx-auto"
            >
              <blockquote className="text-xl md:text-2xl text-primary-100 italic font-light mb-4">
                &quot;{legalQuotes[currentQuote].text}&quot;
              </blockquote>
              <p className="text-gold-400">
                {legalQuotes[currentQuote].author}
                <span className="text-primary-300 text-sm ml-2">
                  — {legalQuotes[currentQuote].origin}
                </span>
              </p>
            </motion.div>

            {/* Bouton d'accès */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Link href="/login">
                <Button 
                  size="xl" 
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-slate-900 font-semibold shadow-premium text-lg px-8 py-4 rounded-full group"
                >
                  Accéder à votre espace
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <p className="mt-4 text-primary-300 text-sm">
                Portail sécurisé pour les professionnels du droit au Cameroun
              </p>
            </motion.div>
          </div>
        </div>

        {/* Indicateur de défilement */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="w-6 h-10 border-2 border-gold-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold-500 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Section Valeurs et Principes */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gold-500"
            >
              Les Valeurs de la Justice
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Scale className="h-10 w-10" />,
                title: "Équité",
                description: "Assurer un traitement juste et impartial pour toutes les parties impliquées dans chaque dossier."
              },
              {
                icon: <Gavel className="h-10 w-10" />,
                title: "Intégrité",
                description: "Maintenir les plus hauts standards d'éthique professionnelle dans toutes nos interventions."
              },
              {
                icon: <Scale className="h-10 w-10" />,
                title: "Excellence",
                description: "Fournir un service juridique de qualité supérieure adapté au contexte camerounais."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4 text-gold-500">
                  {value.icon}
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-primary-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Système Juridique Camerounais */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gold-500"
            >
              Au Service du Droit Camerounais
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-3xl font-semibold mb-6 text-white">
                Une Adaptation Parfaite au Contexte Juridique National
              </h3>
              <p className="text-primary-300 mb-6 leading-relaxed">
                Notre plateforme intègre profondément les spécificités du système juridique camerounais, 
                des juridictions de première instance à la Cour Suprême, en passant par les cours d&apos;appel 
                et les tribunaux spécialisés.
              </p>
              <p className="text-primary-300 mb-8 leading-relaxed">
                Respectueuse des traditions juridiques tout en intégrant les innovations technologiques, 
                notre solution facilite la gestion des dossiers conformément aux procédures établies 
                par l&apos;OHADA et le droit national camerounais.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gold-500 mr-2" />
                  <span className="text-white">Tribunaux camerounais</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gold-500 mr-2" />
                  <span className="text-white">Droit OHADA</span>
                </div>
                <div className="flex items-center">
                  <Library className="h-5 w-5 text-gold-500 mr-2" />
                  <span className="text-white">Jurisprudence nationale</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gold-500 mr-2" />
                  <span className="text-white">Spécificités locales</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 rounded-lg overflow-hidden shadow-premium">
                <Image
                  src="/images/background1.webp"
                  alt="Palais de justice du Cameroun"
                  fill
                  className="object-cover"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-gold-400 font-semibold text-lg">Palais de Justice, Yaoundé</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Distinctions */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gold-500"
            >
              L&apos;Excellence Juridique à Votre Portée
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                number: "15+",
                label: "Années d'expertise",
                description: "Au service des professionnels du droit camerounais"
              },
              {
                number: "500+",
                label: "Juristes accompagnés",
                description: "À travers tout le territoire national"
              },
              {
                number: "10K+",
                label: "Dossiers traités",
                description: "Avec une efficacité et une sécurité inégalées"
              },
              {
                number: "24/7",
                label: "Support dédié",
                description: "Une assistance technique permanente pour votre tranquillité d'esprit"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                <div className="text-primary-300 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Accès Direct */}
      <section className="py-24 bg-gradient-to-r from-primary-900 to-bordeaux-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Award className="h-16 w-16 text-gold-500 mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
              Accédez à Votre Espace Professionnel
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Rejoignez l&apos;élite des professionnels du droit camerounais qui font confiance à 
              Cabinet Juridique 237 pour une gestion optimale de leur pratique.
            </p>
            <Link href="/login">
              <Button 
                size="xl" 
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-slate-900 font-semibold shadow-premium text-lg px-10 py-4 rounded-full group"
              >
                Connexion Sécurisée
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="mt-6 text-primary-300 text-sm">
              Accès réservé aux avocats, juristes et professionnels du droit agréés
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Élégant */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Scale className="h-8 w-8 text-gold-500 mr-2" />
                <span className="font-serif text-xl font-bold text-white">Cabinet Juridique 237</span>
              </div>
              <p className="text-primary-400 text-sm mt-2">
                L&apos;excellence au service du droit camerounais
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-primary-400 hover:text-gold-500 transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-primary-400 hover:text-gold-500 transition-colors">
                Conditions d&apos;utilisation
              </a>
              <a href="#" className="text-primary-400 hover:text-gold-500 transition-colors">
                Support
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-primary-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Cabinet Juridique 237. Tous droits réservés.</p>
            <p className="mt-2">Conçu avec excellence pour les professionnels du droit au Cameroun</p>
          </div>
        </div>
      </footer>
    </div>
  )
}