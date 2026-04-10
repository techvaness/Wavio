import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Users, Sliders, Globe, BarChart2, Zap, Check } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const features = [
  { icon: Users, title: 'Multi-client workspaces', desc: 'Manage every client from one Wavio account. Separate inboxes, agents, and reporting per client,no overlap.' },
  { icon: Sliders, title: 'White-label ready', desc: 'Rebrand the widget with your client\'s logo and colors. Deliver a premium experience that looks 100% native.' },
  { icon: BarChart2, title: 'Client reporting dashboard', desc: 'Generate branded performance reports for each client. Response times, CSAT, volume,all in one click.' },
  { icon: Zap, title: 'Rapid deployment', desc: 'Onboard new clients in under 15 minutes. One script tag. No engineering required from your team or theirs.' },
  { icon: Globe, title: 'All channels, all clients', desc: 'WhatsApp, Instagram, Email, and SMS for every client workspace,managed centrally by your team.' },
  { icon: Briefcase, title: 'Agency billing', desc: 'Resell Wavio to your clients at a margin. Simple seat-based pricing you can mark up however you need.' },
]

const plans = [
  { name: 'Agency Starter', clients: '3 clients', price: '$79/mo', features: ['3 workspaces', '10 agents total', 'White-label widget', 'Client reporting'] },
  { name: 'Agency Pro', clients: '10 clients', price: '$199/mo', features: ['10 workspaces', '30 agents total', 'Full white-label', 'API access', 'Priority support'], highlight: true },
  { name: 'Agency Enterprise', clients: 'Unlimited', price: 'Custom', features: ['Unlimited workspaces', 'Unlimited agents', 'Custom contract', 'Dedicated CSM'] },
]

export default function Agencies() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-14 md:py-28 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(26,63,191,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#1a3fbf] text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Briefcase size={12} /> Agencies
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-[#0f172a] mb-5 leading-tight" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
              One platform.<br />Every client.
            </h1>
            <p className="text-xl text-[#475569] max-w-xl mx-auto mb-10">
              Manage chat support for all your clients from a single Wavio dashboard. White-label, multi-workspace, built for agencies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 bg-[#1a3fbf] hover:bg-[#2e5de6] text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg">Talk to sales</Link>
              <Link to="/signup" className="px-8 py-4 border-2 border-[#e4e7ed] text-[#475569] font-semibold rounded-full hover:border-[#1a3fbf] hover:text-[#1a3fbf] transition-all text-sm">Start free trial</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Everything agencies need.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-[#e4e7ed] rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#1a3fbf]" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agency plans */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Agency plans</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 ${plan.highlight ? 'border-2 border-[#1a3fbf] shadow-xl shadow-blue-100' : 'border border-[#e4e7ed]'} bg-white`}>
                <div className="mb-4">
                  <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">{plan.clients}</div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">{plan.name}</h3>
                  <div className="text-2xl font-bold text-[#1a3fbf]">{plan.price}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#475569]">
                      <Check size={13} className="text-[#4cc61e] flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`block text-center py-2.5 rounded-full font-semibold text-sm transition-all ${plan.highlight ? 'bg-[#1a3fbf] text-white hover:bg-[#2e5de6]' : 'border border-[#1a3fbf] text-[#1a3fbf] hover:bg-blue-50'}`}>
                  {plan.price === 'Custom' ? 'Contact sales' : 'Get started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
