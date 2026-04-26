import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (emailOrPayload, passwordArg) => {
    const payload =
      typeof emailOrPayload === 'object' && emailOrPayload !== null
        ? emailOrPayload
        : { email: emailOrPayload, password: passwordArg }

    try {
      const response = await api.post('/auth/login', payload)
      const { token, ...userData } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      toast.success('Logged in successfully!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (nameOrPayload, emailArg, passwordArg) => {
    const payload =
      typeof nameOrPayload === 'object' && nameOrPayload !== null
        ? nameOrPayload
        : { name: nameOrPayload, email: emailArg, password: passwordArg }

    try {
      const response = await api.post('/auth/register', payload)
      const { token, ...userData } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      toast.success('Registered successfully!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (nextUser) => {
    setUser(nextUser)
    localStorage.setItem('user', JSON.stringify(nextUser))
  }

  const isAuthenticated = Boolean(user)

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}