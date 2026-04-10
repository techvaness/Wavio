import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function CTABanner() {
  const { t } = useLanguage()

  return (
    <section
      className="py-12 md:py-24 px-4"
      style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.5px' }}
          >
            {t('cta.headline')}
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            {t('cta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-[#1a3fbf] font-semibold rounded-full hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-200 text-sm"
            >
              {t('cta.primary')}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white/40 hover:border-white/80 hover:bg-white/10 transition-all duration-200 text-sm"
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
