import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, Users, Zap, BarChart2, Check, Globe, Headphones } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const features = [
  { icon: Shield, title: 'Enterprise-grade security', desc: 'SOC 2 Type II (in progress), GDPR, SSO/SAML, and role-based access controls across your entire organization.' },
  { icon: Users, title: 'Unlimited agents & workspaces', desc: 'No limits on agents, conversations, or workspaces. Scale to thousands of users across multiple teams and regions.' },
  { icon: Globe, title: 'Global infrastructure', desc: 'Data residency options in the US, EU, and APAC. 99.9% uptime SLA backed by a financial guarantee.' },
  { icon: Zap, title: 'Custom integrations', desc: 'Dedicated engineering support to connect Wavio to your existing stack,CRM, ERP, data warehouse, or custom tools.' },
  { icon: BarChart2, title: 'Advanced analytics & BI', desc: 'Custom dashboards, raw data export, and native connections to Looker, Tableau, and BigQuery.' },
  { icon: Headphones, title: 'Dedicated success team', desc: 'A named Customer Success Manager, priority SLAs, and 24/7 phone support included in every Enterprise contract.' },
]

const logos = ['Shopform', 'Launchkit', 'NomadStudio', 'Patchwork', 'Cresendo', 'Vaultex']

export default function Enterprise() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-14 md:py-28 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a3fbf 60%, #1e52d4 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, #4cc61e 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Shield size={12} /> Enterprise
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-5 leading-tight" style={{ letterSpacing: '-1px' }}>
              Built for teams<br />that can't afford downtime.
            </h1>
            <p className="text-xl text-white/70 max-w-xl mx-auto mb-10">
              Enterprise-grade security, unlimited scale, and a dedicated team,so your customer communication never misses a beat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 bg-white text-[#1a3fbf] font-bold rounded-full text-sm hover:shadow-xl transition-all">
                Talk to sales
              </Link>
              <Link to="/pricing" className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:border-white/60 transition-all text-sm">
                See all plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="py-14 px-4 bg-white border-b border-[#e4e7ed]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#94a3b8] mb-6">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center gap-8">
            {logos.map((l) => (
              <span key={l} className="text-lg font-bold text-[#cbd5e1]">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-[#f5f6f8]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Everything you need at scale.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-[#e4e7ed] rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl" style={{ background: 'linear-gradient(135deg, #1a3fbf, #2e5de6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SLA section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1a3fbf] rounded-3xl p-10 text-center">
            <div className="text-5xl font-bold text-white mb-2" style={{ letterSpacing: '-1px' }}>99.9%</div>
            <div className="text-white/80 text-lg mb-6">Guaranteed uptime SLA</div>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
              Every Enterprise contract includes a financially-backed uptime SLA. If we miss it, you get credits,automatically.
            </p>
            <Link to="/contact" className="inline-block px-8 py-3.5 bg-[#4cc61e] text-white font-bold rounded-full hover:bg-[#3aaa10] transition-all text-sm">
              Get a custom quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
