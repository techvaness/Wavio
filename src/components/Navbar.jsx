import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const navLinks = [
    { labelKey: 'nav.features', to: '/features' },
    { labelKey: 'nav.pricing', to: '/pricing' },
    { labelKey: 'nav.integrations', to: '/integrations' },
    { labelKey: 'nav.ai', to: '/ai' },
    { labelKey: 'nav.docs', to: '/docs' },
    { labelKey: 'nav.blog', to: '/blog' },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.08)' : '0 1px 0 #e4e7ed',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo height={44} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-[#1a3fbf] bg-blue-50 font-semibold'
                      : 'text-[#475569] hover:text-[#1a3fbf] hover:bg-blue-50'
                  }`
                }
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-[#1a3fbf] border border-[#1a3fbf] rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              {t('nav.signIn')}
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#4cc61e] rounded-full hover:bg-[#3aaa10] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t('nav.getStarted')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-[#e4e7ed] px-4 pb-6 pt-3"
          >
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#1a3fbf] bg-blue-50 font-semibold'
                        : 'text-[#475569] hover:text-[#1a3fbf] hover:bg-blue-50'
                    }`
                  }
                >
                  {t(link.labelKey)}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-[#1a3fbf] border border-[#1a3fbf] rounded-full hover:bg-blue-50 transition-all"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#4cc61e] rounded-full hover:bg-[#3aaa10] transition-all"
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
