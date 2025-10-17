"use client";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../app/auth/context/AuthProvider";

export default function TestPermissions() {
  const { user } = useAuth();
  const { canWrite, canDelete, isLoading } = usePermissions("dossiers");

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Permissions</h1>
      <p>Utilisateur : {user?.email}</p>
      <p>Rôle : {user?.role}</p>
      <hr className="my-4" />
      <p>Peut créer des dossiers : {canWrite ? "✅ OUI" : "❌ NON"}</p>
      <p>Peut supprimer des dossiers : {canDelete ? "✅ OUI" : "❌ NON"}</p>
    </div>
  );
}