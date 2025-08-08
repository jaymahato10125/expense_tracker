import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { isAuthed, setToken, setUser, user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const logout = () => {
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const NavLink = ({ to, children, activeClass = '', inactiveClass = '' }) => {
    const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    const isActive = pathname === to;
    return (
      <Link to={to} className={`${base} ${isActive ? activeClass : inactiveClass}`}>
        {children}
      </Link>
    )
  }

  return (
    <header className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container py-3 flex items-center justify-between"
      >
        <Link to="/" className="font-semibold text-lg text-white tracking-tight">
          ExpenseTracker
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthed && (
            <>
              <NavLink
                to="/dashboard"
                activeClass="text-emerald-200 underline decoration-emerald-300 underline-offset-4"
                inactiveClass="text-emerald-100/90 hover:text-emerald-50"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/transactions"
                activeClass="text-amber-200 underline decoration-amber-300 underline-offset-4"
                inactiveClass="text-amber-100/90 hover:text-amber-50"
              >
                Transactions
              </NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="btn btn-ghost text-white/90 border border-white/20"
            aria-label="Toggle theme"
          >
            {dark ? '🌙' : '☀️'}
          </button>
          {isAuthed ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/90 hidden sm:inline">
                {user?.name || user?.email}
              </span>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost text-white/90 border border-white/20">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary shadow">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </header>
  )
}
