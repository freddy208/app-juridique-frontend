/**
 * ============================================
 * CONSTANTES DASHBOARD JURIDIQUE
 * ============================================
 * Palette de couleurs, configuration UI et constantes
 */

// ============================================
// PALETTE DE COULEURS 2025
// ============================================

export const COLORS = {
  // Couleurs principales
  primary: {
    royalBlue: '#4169e1',
    gold: '#d4af37',
    burgundy: '#8b0000',
  },
  
  // Couleurs fonctionnelles
  functional: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Couleurs neutres
  neutral: {
    white: '#FFFFFF',
    lightBlue: '#f0f4ff',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },
} as const;

// ============================================
// CONFIGURATION SIDEBAR
// ============================================

export const SIDEBAR_CONFIG = {
  width: {
    expanded: 280,
    collapsed: 80,
  },
  backgroundColor: COLORS.primary.royalBlue,
  transitionDuration: 0.3,
} as const;

// ============================================
// CONFIGURATION TOPBAR
// ============================================

export const TOPBAR_CONFIG = {
  height: 80,
  backgroundColor: COLORS.neutral.white,
  logoSize: 48,
} as const;

// ============================================
// TYPOGRAPHIE
// ============================================

export const TYPOGRAPHY = {
  fonts: {
    display: 'Playfair Display',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
} as const;

// ============================================
// BREAKPOINTS RESPONSIVE
// ============================================

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  sidebar: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;