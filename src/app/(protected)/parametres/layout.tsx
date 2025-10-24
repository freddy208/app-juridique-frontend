'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}