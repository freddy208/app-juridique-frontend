import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { Providers } from './providers'; // ✅ ← ton fichier app/providers.tsx
import { Toaster } from '@/components/ui/toaster';;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Cabinet Juridique 237 - Solution de gestion pour cabinets d'avocats",
  description: "La solution de gestion juridique de pointe pour les cabinets d'avocats au Cameroun",
  keywords: "cabinet juridique, avocat, cameroun, gestion, dossiers, clients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {/* ✅ On englobe tout avec React Query */}
        <Providers>
          <AuthProvider>
            {children}
              <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
