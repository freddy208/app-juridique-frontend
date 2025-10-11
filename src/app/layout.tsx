// src/app/layout.tsx
import './globals.css';
//import type { ReactNode } from 'react';
//import { Geist, Geist_Mono } from 'next/font/google';
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from './auth/context/AuthProvider';

// Polices Google
//const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
//const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata = {
  title: 'Cabinet Juridique',
  description: 'Gestion digitale et sécurisée de votre cabinet juridique',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
      <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
