"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type User = { id: string; email: string; prenom?: string; nom?: string; role?: string };

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, motDePasse: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Login
  const login = async (email: string, motDePasse: string, rememberMe: boolean) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse, rememberMe }),
    });

    if (!res.ok) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const data = await res.json();

    setAccessToken(data.access_token);
    setUser(data.user);

    // Stockage du refresh token côté client
    localStorage.setItem("refresh_token", data.refresh_token);
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
    } catch {
      // ignore errors
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refresh_token");
  };

  // Refresh token
  const refreshAccessToken = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        throw new Error("Refresh token manquant");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      });

      if (!res.ok) {
        throw new Error("Impossible de rafraîchir le token");
      }

      const data = await res.json();
      setAccessToken(data.access_token);
    } catch {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("refresh_token");
    }
  };

  // Auto refresh toutes les 14 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) {
        refreshAccessToken();
      }
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // Tenter de récupérer un token au chargement
  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
