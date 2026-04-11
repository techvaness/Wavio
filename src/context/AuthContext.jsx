import { createContext, useContext, useState, useCallback } from 'react'
import { authApi, profileApi, setToken, setStoredUser, getStoredUser, clearAuthStorage } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await authApi.login(email, password)
    setToken(token)
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (name, email, password, company) => {
    const { token, user: u } = await authApi.register(name, email, password, company)
    setToken(token)
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignore network error on logout */ }
    clearAuthStorage()
    setUser(null)
  }, [])

  const updateStatus = useCallback((status) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, status }
      setStoredUser(updated)
      return updated
    })
  }, [])

  const updateProfile = useCallback(async (body) => {
    const updated = await profileApi.update(body)
    setStoredUser(updated)
    setUser(updated)
    return updated
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateStatus, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
