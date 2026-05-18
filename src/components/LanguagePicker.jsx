import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage, languages } from '../context/LanguageContext'
import 'flag-icons/css/flag-icons.min.css'

export default function LanguagePicker({ placement = 'up' }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = languages.find(l => l.code === lang) || languages[0]

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dropdownClass = placement === 'up'
    ? 'bottom-full mb-2'
    : 'top-full mt-2'

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#e4e7ed] bg-white hover:border-[#1a3fbf] focus:outline-none focus:border-[#1a3fbf] transition-colors text-sm text-[#475569] shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={`fi fi-${current.flagCode}`}
          style={{ width: 20, height: 15, borderRadius: 2, display: 'inline-block', flexShrink: 0 }}
        />
        <span className="font-medium">{current.label}</span>
        <ChevronDown
          size={13}
          className={`text-[#94a3b8] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className={`absolute ${dropdownClass} left-0 z-50 min-w-[185px] bg-white border border-[#e4e7ed] rounded-xl shadow-lg overflow-hidden py-1`}
        >
          {languages.map(l => (
            <li
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
                ${l.code === lang
                  ? 'bg-[#eef2ff] text-[#1a3fbf] font-semibold'
                  : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                }`}
            >
              <span
                className={`fi fi-${l.flagCode}`}
                style={{ width: 22, height: 16, borderRadius: 2, display: 'inline-block', flexShrink: 0 }}
              />
              <span>{l.label}</span>
              {l.code === lang && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a3fbf]" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
