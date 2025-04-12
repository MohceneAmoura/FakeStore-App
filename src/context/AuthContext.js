// src/context/AuthContext.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const token = await response.json()
      
      // Fetch user details
      const userResponse = await fetch('https://fakestoreapi.com/users')
      const users = await userResponse.json()
      const authenticatedUser = users.find(u => u.username === credentials.username)
      
      if (!authenticatedUser) throw new Error('User not found')
      
      const userWithToken = { ...authenticatedUser, token }
      setUser(userWithToken)
      localStorage.setItem('user', JSON.stringify(userWithToken))
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  const isAdmin = () => {
    return user?.username === 'johnd' // Simple admin check for demo
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}