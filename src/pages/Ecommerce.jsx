import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Package, CreditCard, TrendingUp, MessageSquare, Bot, Check, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const features = [
  { icon: ShoppingCart, title: 'Order data in every chat', desc: 'See the customer\'s full order history, cart, and shipping status right inside the conversation,without switching tabs.' },
  { icon: Package, title: 'Proactive shipping alerts', desc: 'Automatically message customers when orders ship, arrive, or face delays. Reduce WISMO tickets by 60%.' },
  { icon: CreditCard, title: 'Abandoned cart recovery', desc: 'Trigger automated chat messages when a cart is abandoned. Convert 15–30% of lost carts back to sales.' },
  { icon: TrendingUp, title: 'Revenue attribution', desc: 'See exactly how much revenue each conversation generated. Know your chat ROI down to the dollar.' },
  { icon: MessageSquare, title: 'Omnichannel support', desc: 'Customers reach you on WhatsApp, Instagram DMs, email, and live chat,all managed in one inbox.' },
  { icon: Bot, title: 'AI-powered 24/7', desc: 'Handle order status, returns, and FAQs automatically. Your best agents sleep,your AI assistant doesn\'t.' },
]

const metrics = [
  { value: '3.2x', label: 'More revenue from chat' },
  { value: '60%', label: 'Fewer WISMO tickets' },
  { value: '< 90s', label: 'Average response time' },
  { value: '4.9/5', label: 'Customer satisfaction' },
]

export default function Ecommerce() {
  const { t } = useLanguage()
  const hero = t('ecommerce.hero')
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-14 md:py-28 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(76,198,30,0.07) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-[#4cc61e] text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <ShoppingCart size={12} /> {hero.label}
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-[#0f172a] mb-5 leading-tight" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
              {hero.title}
            </h1>
            <p className="text-base md:text-xl text-[#475569] max-w-xl mx-auto mb-8 md:mb-10">
              {hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-[#4cc61e] hover:bg-[#3aaa10] text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg text-sm">
                Start for free
              </Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-[#e4e7ed] text-[#475569] font-semibold rounded-full hover:border-[#1a3fbf] hover:text-[#1a3fbf] transition-all text-sm">
                Book a demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {metrics.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="text-4xl font-bold text-[#1a3fbf] mb-1" style={{ letterSpacing: '-1px' }}>{value}</div>
              <div className="text-sm text-[#475569]">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Built for online stores.</h2>
            <p className="text-[#475569] mt-3 max-w-lg mx-auto">Every feature is designed around the realities of running an eCommerce business.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-[#e4e7ed] rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#4cc61e]" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4" style={{ letterSpacing: '-0.5px' }}>Plugs into your store in minutes.</h2>
            <p className="text-[#475569] mb-8">Native integrations with all major eCommerce platforms.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Shopify', 'WooCommerce', 'BigCommerce', 'Magento', 'Squarespace'].map((p) => (
                <div key={p} className="bg-white border border-[#e4e7ed] rounded-xl px-6 py-3 text-sm font-bold text-[#475569] hover:border-[#4cc61e] hover:text-[#4cc61e] transition-all cursor-pointer">
                  {p}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
