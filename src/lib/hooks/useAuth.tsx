import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import apiClient from '@/lib/api/client'
import { authEndpoints } from '@/lib/api/endpoints'

interface User {
  id: string
  prenom: string
  nom: string
  email: string
  role: string
  statut: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          const response = await apiClient.get(authEndpoints.profile)
          setUser(response.data.utilisateur)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post(authEndpoints.login, { email, motDePasse: password })
      const { accessToken, refreshToken, utilisateur } = response.data

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      setUser(utilisateur)
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.post(authEndpoints.logout)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await apiClient.post(authEndpoints.forgotPassword, { email })
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error)
      throw error
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      await apiClient.post(authEndpoints.resetPassword, { token, motDePasse: password })
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error)
      throw error
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await apiClient.post(authEndpoints.changePassword, {
        ancienMotDePasse: oldPassword,
        nouveauMotDePasse: newPassword,
      })
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}