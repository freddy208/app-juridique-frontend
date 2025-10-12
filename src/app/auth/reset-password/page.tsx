"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nouveauMotDePasse: motDePasse }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      router.push("/auth/login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" placeholder="Nouveau mot de passe" value={motDePasse} onChange={e=>setMotDePasse(e.target.value)} required />
      <button type="submit">Réinitialiser</button>
      {message && <p>{message}</p>}
    </form>
  );
}
