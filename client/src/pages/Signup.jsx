import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/auth/signup', { name, email, password })
      setToken(data.token)
      setUser(data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 chars)"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
        Have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  )
}
