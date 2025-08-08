import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

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

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 ${
        pathname === to ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
      }`}
    >
      {children}
    </Link>
  )

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          ExpenseTracker
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthed && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/transactions">Transactions</NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {dark ? '🌙' : '☀️'}
          </button>
          {isAuthed ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                Login
              </Link>
              <Link to="/signup" className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
