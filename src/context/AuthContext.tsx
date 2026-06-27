import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  // Inicialización lazy — si no hay token arranca en false sin tocar el efecto
  const [loading, setLoading] = useState<boolean>(
    () => !!localStorage.getItem('trackon_token')
  )

  useEffect(() => {
    const token = localStorage.getItem('trackon_token')
    if (!token) return

    authService.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('trackon_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login({ email, password })
    localStorage.setItem('trackon_token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('trackon_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}