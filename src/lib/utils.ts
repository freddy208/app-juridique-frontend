/**
 * Utilitaires
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine les classes Tailwind intelligemment
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}