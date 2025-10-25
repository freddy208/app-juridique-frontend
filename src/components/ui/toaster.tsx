// components/ui/toaster.tsx
'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={(theme as 'light' | 'dark' | 'system') || 'system'}
      position="top-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
        },
        className: 'my-toast',
        duration: 4000,
      }}
      expand={true}
      richColors
      closeButton
    />
  );
}