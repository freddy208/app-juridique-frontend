"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", motDePasse: "", role: "AVOCAT" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de l'inscription");
      }
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Prénom" value={form.prenom} onChange={e => setForm({...form, prenom:e.target.value})} required />
      <input placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom:e.target.value})} required />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
      <input type="password" placeholder="Mot de passe" value={form.motDePasse} onChange={e => setForm({...form, motDePasse:e.target.value})} required />
      <select value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
        <option value="ADMIN">ADMIN</option>
        <option value="DG">DG</option>
        <option value="AVOCAT">AVOCAT</option>
        <option value="SECRETAIRE">SECRETAIRE</option>
      </select>
      <button type="submit">Créer</button>
      {error && <p>{error}</p>}
    </form>
  );
}
