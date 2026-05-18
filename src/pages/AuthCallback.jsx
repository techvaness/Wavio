/**
 * Landing page for the OAuth redirect — /auth/callback?token=<jwt>
 * Reads the token from the URL, stores it, fetches the user profile,
 * then sends the user to their dashboard.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setToken, setStoredUser } from '../api/client'
import Logo from '../components/Logo'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const err   = searchParams.get('error')

    if (err) {
      setError(decodeURIComponent(err))
      return
    }

    if (!token) {
      setError('No token received from provider.')
      return
    }

    // Fetch user profile with the new token
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(user => {
        if (user.error) throw new Error(user.error)
        setToken(token)
        setStoredUser(user)
        navigate(user.role === 'admin' ? '/control' : '/portal', { replace: true })
      })
      .catch(e => setError(e.message || 'Sign-in failed'))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="text-center max-w-sm px-4">
          <Logo height={44} className="mx-auto mb-6" />
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-[#1a3fbf] font-semibold hover:underline"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="text-center">
        <Logo height={44} className="mx-auto mb-6" />
        <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
          <svg className="animate-spin h-4 w-4 text-[#1a3fbf]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          Signing you in…
        </div>
      </div>
    </div>
  )
}
