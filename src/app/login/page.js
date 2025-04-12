// src/app/login/page.js
// src/app/login/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!credentials.username || !credentials.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    const success = await login(credentials)
    if (success) {
      router.push('/products')
    } else {
      setError('Identifiants invalides. Veuillez réessayer.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Connexion</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Ex: Mohcene Amoura"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="login-button">Se connecter</button>
        </form>
      </div>
    </div>
  )
}