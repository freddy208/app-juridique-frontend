// components/ui/user-avatar.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Crown } from 'lucide-react';
import { RoleUtilisateur } from '@/lib/types/user.types';

interface UserAvatarProps {
  user: {
    prenom: string;
    nom: string;
    email: string;
    role: RoleUtilisateur;
    photoUrl?: string | null;
  };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';  // ✅ Ajout de 2xl
  showCrown?: boolean;
  className?: string;  // ✅ Permet de surcharger les styles
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-32 h-32',  // ✅ AJOUTÉ (128px)
};

const sizePx = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 128,  // ✅ AJOUTÉ (128px)
};

const crownSizes = {
  xs: 'w-3 h-3',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
  '2xl': 'w-6 h-6',  // ✅ AJOUTÉ
};

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
  '2xl': 'text-4xl',  // ✅ AJOUTÉ - Texte plus grand pour les initiales
};

export function UserAvatar({ user, size = 'md', showCrown = true, className = '' }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Générer l'URL de l'avatar
  const avatarUrl = user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`;
  
  // Fallback : initiales
  const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() || '??';
  
  // Si l'image a échoué ou pas d'URL, afficher les initiales
  if (imageError || !avatarUrl) {
    return (
      <div className={`relative ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-bordeaux-500 to-gold-500 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 ${textSizes[size]}`}
        >
          {initials}
        </div>
        {showCrown && user.role === RoleUtilisateur.ADMIN && (
          <Crown className={`absolute -top-1 -right-1 ${crownSizes[size]} text-amber-500`} />
        )}
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={avatarUrl}
        alt={`${user.prenom} ${user.nom}`}
        width={sizePx[size]}
        height={sizePx[size]}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-gray-200`}
        unoptimized={avatarUrl.includes('dicebear.com')}
        onError={() => setImageError(true)}
        priority={false}
      />
      {showCrown && user.role === RoleUtilisateur.ADMIN && (
        <Crown className={`absolute -top-1 -right-1 ${crownSizes[size]} text-amber-500`} />
      )}
    </div>
  );
}

// ============================================
// Variante simple sans Image (si vous préférez)
// ============================================

export function UserAvatarSimple({ user, size = 'md', showCrown = true, className = '' }: UserAvatarProps) {
  const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() || '??';
  
  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-bordeaux-500 to-gold-500 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 ${textSizes[size]}`}
      >
        {initials}
      </div>
      {showCrown && user.role === RoleUtilisateur.ADMIN && (
        <Crown className={`absolute -top-1 -right-1 ${crownSizes[size]} text-amber-500`} />
      )}
    </div>
  );
}