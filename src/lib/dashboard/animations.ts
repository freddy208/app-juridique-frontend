/**
 * ============================================
 * ANIMATIONS FRAMER MOTION
 * ============================================
 * Variants réutilisables pour toutes les animations du dashboard
 */

import { Variants, type TargetAndTransition } from 'framer-motion';

// ============================================
// SIDEBAR ANIMATIONS
// ============================================

export const sidebarVariants: Variants = {
  expanded: {
    width: 280,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  collapsed: {
    width: 80,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    },
  },
};

export const sidebarMenuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// ============================================
// MOBILE SIDEBAR ANIMATIONS
// ============================================

export const mobileSidebarVariants: Variants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

export const overlayVariants: Variants = {
  open: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// ============================================
// DROPDOWN ANIMATIONS
// ============================================

export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

// ============================================
// KPI CARD ANIMATIONS
// ============================================

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const cardsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// ============================================
// HOVER ANIMATIONS
// ============================================

export const hoverScale: TargetAndTransition = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
};

export const hoverLift: TargetAndTransition = {
  y: -4,
  boxShadow: '0 12px 24px -4px rgba(65, 105, 225, 0.15)',
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
};

// ============================================
// LOADING ANIMATIONS
// ============================================

export const pulseVariants: Variants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

export const spinVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// TABLE ROW ANIMATIONS
// ============================================

export const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
    },
  }),
};

// ============================================
// FADE IN ANIMATIONS
// ============================================

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// ============================================
// SLIDE IN ANIMATIONS
// ============================================

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};