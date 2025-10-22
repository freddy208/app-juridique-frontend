import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { 
  Scale, 
  Users, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Star,
  Quote
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-bordeaux-900/90 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1589829545826-d4d6a627895c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')"
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.h1 
              className="font-serif text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Cabinet Juridique 237
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              La solution de gestion juridique de pointe pour les cabinets d&apos;avocats au Cameroun
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/login">
                <Button size="xl" className="bg-gold-500 hover:bg-gold-600 text-white shadow-premium">
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-900">
                Demander une démo
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Animated elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-slate-50" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path fill="currentColor" d="M0,22L60,21.3C120,21,240,19,360,19.3C480,19,600,21,720,24.7C840,29,960,35,1080,35.3C1200,35,1320,29,1380,26L1440,22L1440,54L1380,54C1320,54,1200,54,1080,54C960,54,840,54,720,54C600,54,480,54,360,54C240,54,120,54,60,54L0,54Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Une solution complète pour votre cabinet
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Gérez efficacement vos dossiers, clients et documents avec notre plateforme tout-en-un
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8 text-primary-600" />,
                title: 'Gestion des dossiers',
                description: 'Suivez tous vos dossiers juridiques, des sinistres aux contentieux, avec une interface intuitive.'
              },
              {
                icon: <Users className="h-8 w-8 text-primary-600" />,
                title: 'Base de clients',
                description: 'Centralisez les informations de vos clients et accédez rapidement à leur historique.'
              },
              {
                icon: <Scale className="h-8 w-8 text-primary-600" />,
                title: 'Jurisprudence',
                description: 'Accédez à une base de données de jurisprudence camerounaise pour enrichir vos arguments.'
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary-600" />,
                title: 'Sécurité renforcée',
                description: 'Vos données sont protégées par un chiffrement de bout en bout et des sauvegardes régulières.'
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
                title: 'Tableaux de bord',
                description: 'Suivez les performances de votre cabinet avec des rapports détaillés et des indicateurs clés.'
              },
              {
                icon: <Clock className="h-8 w-8 text-primary-600" />,
                title: 'Gain de temps',
                description: 'Automatisez les tâches répétitives et concentrez-vous sur ce qui compte : vos clients.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-elegant hover:shadow-premium transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ce que nos clients en disent
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez les témoignages des cabinets qui nous font déjà confiance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Maître Jean-Pierre Tchamba',
                position: 'Fondateur, Cabinet Tchamba & Associés',
                content: 'Cabinet Juridique 237 a transformé notre façon de travailler. Plus de papier, tout est numérique et accessible en quelques clics.',
                rating: 5
              },
              {
                name: 'Maître Sophie Ngono',
                position: 'Associée, Cabinet Ngono Legal',
                content: 'La gestion des dossiers est devenue si simple. Je peux suivre toutes les procédures et ne rien n\'échappe aux échéances importantes.',
                rating: 5
              },
              {
                name: 'Maître Alain Fotsing',
                position: 'Directeur, Cabinet Fotsing Law',
                content: 'Les tableaux de bord me permettent d\'avoir une vue d\'ensemble de la performance du cabinet en temps réel. C\'est un outil indispensable.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-primary-200 mb-4" />
                    <p className="text-slate-700 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-600">{testimonial.position}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-bordeaux-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre cabinet ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les nombreux cabinets d&apos;avocats qui font confiance à Cabinet Juridique 237 pour leur gestion quotidienne.
          </p>
          <Link href="/login">
            <Button size="xl" className="bg-gold-500 hover:bg-gold-600 text-white shadow-premium">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4 text-gold-500">Cabinet Juridique 237</h3>
              <p className="text-slate-400">
                La solution de gestion juridique de pointe pour les cabinets d&apos;avocats au Cameroun.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Démo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>contact@cabinetjuridique237.cm</li>
                <li>+237 123 456 789</li>
                <li>Yaoundé, Cameroun</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Cabinet Juridique 237. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}