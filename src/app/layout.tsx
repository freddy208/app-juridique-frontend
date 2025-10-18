// src/app/layout.tsx
import './globals.css';
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from './auth/context/AuthProvider';
import { PermissionsProvider } from './auth/context/PermissionsProvider';
import { Providers } from "./providers";

// Polices Google
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Cabinet Juridique 237",
  description: "Système de gestion pour cabinets d'avocats - Cameroun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-400 antialiased">
        {/* ☝️ J'ai enlevé les classes dark: */}
        <Providers>
          <AuthProvider>
            <PermissionsProvider>
              {children}
            </PermissionsProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}