import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useLanguage, languages } from '../context/LanguageContext'

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
)
const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
)

const socials = [
  { icon: TwitterIcon, label: 'Twitter', href: '#' },
  { icon: GithubIcon, label: 'GitHub', href: '#' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#' },
]

export default function Footer() {
  const { t, lang, setLang } = useLanguage()

  const columns = [
    {
      titleKey: 'footer.cols.product',
      links: [
        { labelKey: 'footer.links.features', to: '/features' },
        { labelKey: 'footer.links.pricing', to: '/pricing' },
        { labelKey: 'footer.links.changelog', to: '/changelog' },
        { labelKey: 'footer.links.roadmap', to: '/roadmap' },
        { labelKey: 'footer.links.status', to: '/status' },
      ],
    },
    {
      titleKey: 'footer.cols.solutions',
      links: [
        { labelKey: 'footer.links.ecommerce', to: '/ecommerce' },
        { labelKey: 'footer.links.saas', to: '/saas' },
        { labelKey: 'footer.links.agencies', to: '/agencies' },
        { labelKey: 'footer.links.enterprise', to: '/enterprise' },
      ],
    },
    {
      titleKey: 'footer.cols.resources',
      links: [
        { labelKey: 'footer.links.docs', to: '/docs' },
        { labelKey: 'footer.links.blog', to: '/blog' },
        { labelKey: 'footer.links.apiRef', to: '/docs' },
        { labelKey: 'footer.links.community', to: '/community' },
      ],
    },
    {
      titleKey: 'footer.cols.company',
      links: [
        { labelKey: 'footer.links.about', to: '/about' },
        { labelKey: 'footer.links.contact', to: '/contact' },
        { labelKey: 'footer.links.careers', to: '/careers' },
        { labelKey: 'footer.links.privacy', to: '/privacy' },
        { labelKey: 'footer.links.terms', to: '/terms' },
      ],
    },
  ]

  return (
    <footer className="bg-white border-t border-[#e4e7ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo height={44} />
            <p className="mt-4 text-sm text-[#475569] leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-[#1a3fbf] hover:bg-[#1a3fbf] hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.titleKey}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-[#94a3b8] mb-4">
                {t(col.titleKey)}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#475569] hover:text-[#1a3fbf] transition-colors duration-150"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar / subfooter */}
        <div className="mt-12 pt-8 border-t border-[#e4e7ed]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright block — stacks to centre on mobile */}
            <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
              <p className="text-sm text-[#64748b] font-medium">
                © {new Date().getFullYear()} Wavio. All rights reserved.
              </p>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Built for teams that move fast · Powered by{' '}
                <a
                  href="mailto:hello@stackwavedigital.com"
                  className="font-semibold text-[#1a3fbf] hover:text-[#2e5de6] transition-colors"
                >
                  StackWave Digital
                </a>
              </p>
            </div>

            {/* Right side — legal links + language picker */}
            <div className="flex flex-col items-center sm:items-end gap-3">
              {/* Legal links */}
              <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
                <Link to="/privacy" className="text-xs text-[#94a3b8] hover:text-[#1a3fbf] transition-colors">
                  Privacy
                </Link>
                <span className="text-[#e4e7ed] text-xs select-none">|</span>
                <Link to="/terms" className="text-xs text-[#94a3b8] hover:text-[#1a3fbf] transition-colors">
                  Terms
                </Link>
                <span className="text-[#e4e7ed] text-xs select-none">|</span>
                <Link to="/contact" className="text-xs text-[#94a3b8] hover:text-[#1a3fbf] transition-colors">
                  Contact
                </Link>
              </div>

              {/* Language picker */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="text-xs text-[#64748b] border border-[#e4e7ed] rounded-lg px-3 py-1.5 bg-white cursor-pointer hover:border-[#1a3fbf] focus:outline-none focus:border-[#1a3fbf] transition-colors"
              >
                {languages.map(({ code, label }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}
