import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('rbj_token')
    if (!token) { setLoading(false); return }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch {
      localStorage.removeItem('rbj_token')
      localStorage.removeItem('rbj_user')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('rbj_token', data.token)
      localStorage.setItem('rbj_user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    localStorage.removeItem('rbj_token')
    localStorage.removeItem('rbj_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
