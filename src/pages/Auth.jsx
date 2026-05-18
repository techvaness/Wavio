import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, MessageSquare, Zap, Shield, Star, Check, Bot, Globe, Users, Menu, X } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const GITHUB_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a" className="flex-shrink-0">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <a
        href="/api/auth/google"
        className="flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl border-2 border-[#e4e7ed] bg-white hover:border-[#4285F4] hover:shadow-sm transition-all text-sm font-medium text-[#0f172a]"
      >
        {GOOGLE_SVG}
        Google
      </a>
      <a
        href="/api/auth/github"
        className="flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl border-2 border-[#e4e7ed] bg-white hover:border-[#0f172a] hover:shadow-sm transition-all text-sm font-medium text-[#0f172a]"
      >
        {GITHUB_SVG}
        GitHub
      </a>
    </div>
  )
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-[#e4e7ed]" />
      <span className="text-xs text-[#94a3b8] font-medium whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-[#e4e7ed]" />
    </div>
  )
}

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 30)
}

const navLinks = [
  { label: 'Features',     to: '/features' },
  { label: 'Pricing',      to: '/pricing' },
  { label: 'Integrations', to: '/integrations' },
  { label: 'AI',           to: '/ai' },
  { label: 'Docs',         to: '/docs' },
  { label: 'Blog',         to: '/blog' },
]

const perks = [
  { icon: MessageSquare, text: 'Unified inbox for every channel' },
  { icon: Zap,           text: 'AI replies in under 300ms' },
  { icon: Shield,        text: 'GDPR-compliant & encrypted' },
  { icon: Star,          text: '4.9 / 5 from verified reviews' },
]

const testimonial = {
  quote: 'Wavio cut our response time from 8 minutes to under 90 seconds. Game-changer.',
  name: 'Priya N.',
  role: 'Head of Support, Shopform',
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const from = location.state?.from?.pathname
      if (user.role === 'admin' && from?.startsWith('/control')) {
        navigate(from, { replace: true })
      } else if (user.role !== 'admin' && from?.startsWith('/portal')) {
        navigate(from, { replace: true })
      } else {
        navigate(user.role === 'admin' ? '/control' : '/portal', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
    >
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#0f172a] mb-1.5" style={{ letterSpacing: '-0.5px' }}>
          Welcome back
        </h1>
        <p className="text-[#94a3b8] text-sm">Sign in to your Wavio workspace.</p>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      <Divider label="or sign in with email" />

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Email address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#e4e7ed] bg-white focus:border-[#1a3fbf] focus:outline-none focus:ring-4 focus:ring-[#1a3fbf]/8 text-sm transition-all placeholder:text-[#cbd5e1]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#475569] uppercase tracking-wide">Password</label>
            <a href="#" className="text-xs text-[#1a3fbf] hover:underline font-semibold">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-[#e4e7ed] bg-white focus:border-[#1a3fbf] focus:outline-none focus:ring-4 focus:ring-[#1a3fbf]/8 text-sm transition-all pr-12 placeholder:text-[#cbd5e1]"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-[#1a3fbf] hover:bg-[#2e5de6] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 mt-2">
          {loading ? 'Signing in…' : 'Sign in to Wavio →'}
        </button>
      </form>

      <p className="text-center text-sm text-[#94a3b8] mt-6">
        No account yet?{' '}
        <button onClick={onSwitch} className="text-[#1a3fbf] font-bold hover:underline">
          Create one free
        </button>
      </p>
      <p className="text-center text-xs text-[#cbd5e1] mt-3">Protected by 256-bit SSL encryption</p>
    </motion.div>
  )
}

// ── Signup form ───────────────────────────────────────────────────────────────
function SignupForm({ onSwitch }) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })
  const [terms, setTerms] = useState(false)
  const [created, setCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const slug = toSlug(form.company)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!terms) return
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.company)
      setCreated(true)
      setTimeout(() => navigate('/portal'), 2000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (created) {
    return (
      <motion.div
        key="created"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4cc61e] to-[#3aaa10] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
          <Check size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">You're in!</h2>
        <p className="text-[#475569] mb-4">Welcome to Wavio, <strong>{form.name.split(' ')[0]}</strong>.</p>
        <div className="bg-white border-2 border-[#4cc61e] rounded-xl px-4 py-3 inline-block mb-6">
          <span className="text-xs text-[#94a3b8] block mb-0.5">Your workspace</span>
          <code className="text-sm font-mono font-bold text-[#1a3fbf]">
            app.wavio.io/{slug || 'your-workspace'}
          </code>
        </div>
        <div className="text-xs text-[#94a3b8]">Redirecting to your dashboard…</div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.22 }}
    >
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#0f172a] mb-1.5" style={{ letterSpacing: '-0.5px' }}>
          Start for free
        </h1>
        <p className="text-[#94a3b8] text-sm">No credit card. No setup fees. Cancel anytime.</p>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      <Divider label="or sign up with email" />

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Full name *</label>
            <input required type="text" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Sarah Kim"
              className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e4e7ed] bg-white focus:border-[#4cc61e] focus:outline-none focus:ring-4 focus:ring-[#4cc61e]/8 text-sm transition-all placeholder:text-[#cbd5e1]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Company *</label>
            <input required type="text" value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              placeholder="Acme Inc."
              className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e4e7ed] bg-white focus:border-[#4cc61e] focus:outline-none focus:ring-4 focus:ring-[#4cc61e]/8 text-sm transition-all placeholder:text-[#cbd5e1]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Work email *</label>
          <input required type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="sarah@company.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#e4e7ed] bg-white focus:border-[#4cc61e] focus:outline-none focus:ring-4 focus:ring-[#4cc61e]/8 text-sm transition-all placeholder:text-[#cbd5e1]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Password *</label>
          <div className="relative">
            <input required type={showPass ? 'text' : 'password'} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e4e7ed] bg-white focus:border-[#4cc61e] focus:outline-none focus:ring-4 focus:ring-[#4cc61e]/8 text-sm transition-all pr-12 placeholder:text-[#cbd5e1]"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Workspace URL preview */}
        <div>
          <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Workspace URL</label>
          <div className="flex items-center rounded-xl border-2 border-[#e4e7ed] bg-white overflow-hidden focus-within:border-[#4cc61e] transition-all">
            <span className="px-3 py-3 text-xs text-[#94a3b8] border-r border-[#e4e7ed] font-mono whitespace-nowrap bg-[#f8fafc]">app.wavio.io/</span>
            <span className="px-3 py-3 text-sm font-mono text-[#1a3fbf] min-h-[3rem] flex items-center flex-1">
              {slug || <span className="text-[#cbd5e1]">your-company</span>}
            </span>
            {slug && <span className="pr-3"><Check size={15} className="text-[#4cc61e]" /></span>}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-1">
          <button type="button" onClick={() => setTerms(!terms)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${terms ? 'bg-[#4cc61e] border-[#4cc61e]' : 'border-[#e4e7ed] bg-white'}`}>
            {terms && <Check size={11} className="text-white" strokeWidth={3} />}
          </button>
          <label className="text-xs text-[#475569] leading-relaxed cursor-pointer" onClick={() => setTerms(!terms)}>
            I agree to Wavio's{' '}
            <Link to="/terms" className="text-[#1a3fbf] hover:underline font-semibold">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[#1a3fbf] hover:underline font-semibold">Privacy Policy</Link>.
          </label>
        </div>

        <button type="submit" disabled={!terms || loading}
          className="w-full py-3.5 bg-[#4cc61e] hover:bg-[#3aaa10] disabled:bg-[#e4e7ed] disabled:text-[#94a3b8] text-white font-bold text-sm rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200 disabled:cursor-not-allowed mt-1">
          {loading ? 'Creating workspace…' : 'Create my workspace →'}
        </button>
      </form>

      <p className="text-center text-sm text-[#94a3b8] mt-6">
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-[#1a3fbf] font-bold hover:underline">
          Sign in
        </button>
      </p>
      <p className="text-center text-xs text-[#cbd5e1] mt-3">No credit card required · Free forever on Starter</p>
    </motion.div>
  )
}

// ── Main Auth page ────────────────────────────────────────────────────────────
export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)

  // mode=signup shows signup by default; anything else shows login
  const isSignup = searchParams.get('mode') === 'signup'

  function switchTo(mode) {
    setSearchParams(mode === 'signup' ? { mode: 'signup' } : {})
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Nav */}
      <nav className="border-b border-[#e4e7ed] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo height={40} />
          </Link>

          {/* Centre — nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-[#1a3fbf] bg-blue-50 font-semibold' : 'text-[#475569] hover:text-[#1a3fbf] hover:bg-blue-50'}`
                }>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right — home link + hamburger */}
          <div className="flex items-center gap-3 ml-auto">
            <Link to="/" className="hidden sm:block text-sm text-[#475569] hover:text-[#1a3fbf] transition-colors font-medium">
              ← Home
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-[#e4e7ed] px-4 pb-4 pt-2">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-[#1a3fbf] bg-blue-50' : 'text-[#475569] hover:text-[#1a3fbf] hover:bg-blue-50'}`
                  }>
                  {link.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="flex flex-1">

        {/* ── Left panel — brand ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-between w-[50%] p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f2a8a 0%, #1a3fbf 50%, #2e5de6 100%)' }}>

          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4cc61e, transparent)' }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)' }} />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-1px' }}>
              Every conversation,<br />
              <span style={{ color: '#4cc61e' }}>one place.</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              The AI-powered platform that puts live chat, omnichannel inbox, and CRM in one beautiful workspace.
            </p>
          </div>

          {/* Perks */}
          <div className="relative z-10 space-y-3 my-10">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#4cc61e]" />
                </div>
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-4 italic">"{testimonial.quote}"</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4cc61e] to-[#2e5de6] flex items-center justify-center text-white text-xs font-bold">P</div>
              <div>
                <div className="text-white text-xs font-semibold">{testimonial.name}</div>
                <div className="text-white/60 text-[10px]">{testimonial.role}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right panel — form ────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 bg-[#f8fafc]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="flex justify-center mb-8 lg:hidden">
              <Logo height={48} />
            </div>

            {/* Toggle tabs */}
            <div className="flex bg-[#f1f5f9] rounded-xl p-1 mb-8">
              <button
                onClick={() => switchTo('login')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  !isSignup
                    ? 'bg-white text-[#0f172a] shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#475569]'
                }`}>
                Sign in
              </button>
              <button
                onClick={() => switchTo('signup')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isSignup
                    ? 'bg-white text-[#0f172a] shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#475569]'
                }`}>
                Create account
              </button>
            </div>

            {/* Animated form swap */}
            <AnimatePresence mode="wait">
              {!isSignup
                ? <LoginForm  key="login"  onSwitch={() => switchTo('signup')} />
                : <SignupForm key="signup" onSwitch={() => switchTo('login')}  />
              }
            </AnimatePresence>

          </motion.div>
        </div>

      </div>
    </div>
  )
}
