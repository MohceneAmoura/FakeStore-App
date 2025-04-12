// src/components/Navbar.js
// src/components/Navbar.js
'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMenuOpen(false)
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link href="/" className="logo">
          FakeStore
        </Link>

        {/* Menu desktop */}
        <nav className="desktop-nav">
          <Link href="/products" className="nav-link">
            Products
          </Link>
          
          {user && isAdmin() && (
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
          
          {user ? (
            <div className="user-menu">
              <span className="username">Hi, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="login-btn">
              Login
            </Link>
          )}
        </nav>

        {/* Menu mobile */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Menu mobile content */}
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link href="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          
          {user && isAdmin() && (
            <Link href="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          
          {user ? (
            <div className="mobile-user-menu">
              <span className="username">Logged in as {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}