"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type User = { id: string; email: string; prenom?: string; nom?: string; role?: string };

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Login page complet 
  const login = async (email: string, motDePasse: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, motDePasse }),
    });
    if (!res.ok) {
      throw new Error("Email ou mot de passe incorrect");
    }
    const data = await res.json();
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  // Logout
  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAccessToken(null);
    setUser(null);
  };

  // Refresh token
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Impossible de rafraîchir le token");
      }
      const data = await res.json();
      setAccessToken(data.access_token);
    } catch {
      setAccessToken(null);
      setUser(null);
    }
  };

  // Auto refresh access token toutes les 14 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) {
        refreshAccessToken();
      }
    }, 14 * 60 * 1000); // 14 min
    return () => clearInterval(interval);
  }, [accessToken]);

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
