/** @type {import('tailwindcss').Config} */
const config= {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs Principales
        primary: {
          50: '#f0f4ff',   // Bleu très clair
          100: '#dce4ff',
          200: '#c1d0ff',
          300: '#97b2ff',
          400: '#6688ff',
          500: '#4169e1',  // Bleu Royal (principal)
          600: '#2d4a9f',
          700: '#1e3a8a',  // Bleu Nuit
          800: '#1e2f6b',
          900: '#0f1e47',  // Bleu Nuit Profond
        },
        
        // Couleurs Secondaires (Or/Prestige)
        gold: {
          50: '#fffdf0',
          100: '#fffadc',
          200: '#fff4b8',
          300: '#ffed94',
          400: '#ffe570',
          500: '#d4af37',  // Or
          600: '#b8930d',
          700: '#8b6f0a',
          800: '#6b5507',
          900: '#4a3a05',
        },
        
        // Couleurs Accent (Bordeaux/Justice)
        bordeaux: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#8b0000',  // Bordeaux
          600: '#7f0000',
          700: '#6b0000',
          800: '#570000',
          900: '#3d0000',
        },
        
        // Couleurs Neutres Élégantes
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',  // Fond sombre élégant
          900: '#0f172a',
        },
        
        // Couleurs Sémantiques
        success: '#10b981',    // Vert juridique
        warning: '#f59e0b',    // Orange attention
        danger: '#ef4444',     // Rouge alerte
        info: '#3b82f6',       // Bleu information
      },
      
      fontFamily: {
        serif: ['Playfair Display', 'serif'],      // Titres élégants
        sans: ['Inter', 'system-ui', 'sans-serif'], // Corps de texte
        mono: ['JetBrains Mono', 'monospace'],      // Code/Numéros
      },
      
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.3' }],
        'h3': ['1.875rem', { lineHeight: '1.4' }],
        'h4': ['1.5rem', { lineHeight: '1.5' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
        'premium': '0 20px 25px -5px rgba(30, 58, 138, 0.1), 0 10px 10px -5px rgba(30, 58, 138, 0.04)',
        'luxe': '0 25px 50px -12px rgba(30, 58, 138, 0.25)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right bottom'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'left bottom'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
}

export default config