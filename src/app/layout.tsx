// src/app/layout.tsx
import './globals.css';
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from './auth/context/AuthProvider';
import { PermissionsProvider } from './auth/context/PermissionsProvider';
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";

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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"  // Définit le thème sombre par défaut
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <PermissionsProvider>
                {children}
              </PermissionsProvider>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}