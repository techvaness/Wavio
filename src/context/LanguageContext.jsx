import { createContext, useContext, useState } from 'react'
import translations from '../translations'

const LanguageContext = createContext(null)

export const languages = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
]

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  function t(path) {
    const keys = path.split('.')
    let val = translations[lang]
    for (const k of keys) val = val?.[k]
    if (val === undefined) {
      let fallback = translations.en
      for (const k of keys) fallback = fallback?.[k]
      return fallback ?? path
    }
    return val
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
