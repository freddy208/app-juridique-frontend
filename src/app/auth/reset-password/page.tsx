"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  // 🧩 Si aucun token n’est fourni dans l’URL
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Lien invalide ou expiré
        </h2>
        <p className="text-gray-600">
          Veuillez recommencer la procédure de réinitialisation du mot de passe.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            nouveauMotDePasse: motDePasse,
          }),
        }
      );

      const data = await res.json();
      setMessage(data.message || "Une erreur est survenue");

      if (res.ok) {
        // ✅ Rediriger vers la page de connexion après 2s
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("Erreur de connexion au serveur. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Réinitialiser le mot de passe
        </h2>

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white p-3 rounded-lg font-medium transition ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          }`}
        >
          {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.toLowerCase().includes("succès") ||
              message.toLowerCase().includes("réussi")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
