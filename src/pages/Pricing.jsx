import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const plans = [
  {
    name: 'Starter',
    price: { monthly: 'Free', annual: 'Free' },
    desc: 'For individuals and small teams getting started.',
    cta: 'Get started free',
    ctaTo: '/signup',
    ctaClass: 'bg-[#4cc61e] hover:bg-[#3aaa10] text-white',
    features: [
      '1 agent seat',
      '500 conversations / month',
      'Web live chat widget',
      'Basic analytics dashboard',
      'Email support',
      'Wavio branding on widget',
    ],
  },
  {
    name: 'Growth',
    price: { monthly: '$29', annual: '$23' },
    period: '/mo',
    desc: 'For growing support teams ready to level up.',
    cta: 'Start free trial',
    ctaTo: '/signup',
    ctaClass: 'bg-[#1a3fbf] hover:bg-[#2e5de6] text-white',
    badge: 'Most popular',
    highlight: true,
    features: [
      '3 agent seats',
      '5,000 conversations / month',
      'AI reply suggestions',
      '2 connected channels',
      'Remove Wavio branding',
      'Basic CRM',
      'Priority support',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: '$79', annual: '$63' },
    period: '/mo',
    desc: 'For scaling businesses that need the full stack.',
    cta: 'Start free trial',
    ctaTo: '/signup',
    ctaClass: 'bg-[#1a3fbf] hover:bg-[#2e5de6] text-white',
    features: [
      '10 agent seats',
      'Unlimited conversations',
      'All AI features',
      'All channels',
      'Full CRM + pipelines',
      'Advanced analytics',
      'Chatbot builder',
      'Dedicated onboarding',
    ],
  },
  {
    name: 'Business',
    price: { monthly: '$199', annual: '$159' },
    period: '/mo',
    desc: 'For enterprise teams with complex needs.',
    cta: 'Contact sales',
    ctaTo: '/contact',
    ctaClass: 'border-2 border-[#1a3fbf] text-[#1a3fbf] hover:bg-blue-50',
    features: [
      'Unlimited agents',
      'Voice & video calls',
      'White-label solution',
      'SLA guarantees',
      'Dedicated CSM',
      'Custom integrations',
      'SSO / SAML',
      '24/7 phone support',
    ],
  },
]

const addons = [
  { name: 'Extra channel', price: '$9/mo per channel' },
  { name: 'Extra workspace', price: '$19/mo per workspace' },
  { name: 'AI credits top-up', price: '$10 per 10,000 credits' },
  { name: 'SMS messages', price: '$0.02 per message' },
]

const faqs = [
  { q: 'Can I try Wavio for free?', a: 'Yes. Our Starter plan is free forever with 1 agent and 500 conversations per month. No credit card required.' },
  { q: 'What happens when I hit my conversation limit?', a: 'We\'ll notify you at 80% usage. You can upgrade anytime or purchase a top-up. We never drop conversations.' },
  { q: 'Is there a free trial for paid plans?', a: 'All paid plans come with a 14-day free trial. No credit card needed to start.' },
  { q: 'Can I change plans at any time?', a: 'Yes. Upgrade, downgrade, or cancel at any time. Prorated credits are applied automatically.' },
  { q: 'What counts as a "conversation"?', a: 'A conversation is a single thread with a customer, regardless of how many messages are exchanged within it.' },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes,save 20% when you switch to annual billing on any paid plan.' },
  { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted in transit and at rest. We\'re GDPR-compliant and SOC 2 certification is in progress.' },
  { q: 'Do you offer nonprofit or startup discounts?', a: 'Yes. Contact our sales team and we\'ll work something out for eligible organizations.' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-12 md:py-24 px-4 bg-white text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-xs font-bold tracking-widest uppercase text-[#4cc61e]">Pricing</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mt-4 mb-4 md:mb-5" style={{ letterSpacing: '-1px', fontFamily: "'DM Sans', sans-serif" }}>
            Simple pricing. Serious value.
          </h1>
          <p className="text-base md:text-xl text-[#475569] mb-8 md:mb-10">Start free. Scale when you're ready.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-[#f5f6f8] rounded-full p-1.5 border border-[#e4e7ed]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${!annual ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#94a3b8]'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${annual ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#94a3b8]'}`}
            >
              Annual
              <span className="text-[10px] font-bold bg-[#4cc61e] text-white px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="pb-12 md:pb-24 px-4 bg-white">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative bg-white rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'border-2 border-[#1a3fbf] shadow-xl shadow-blue-100'
                  : 'border border-[#e4e7ed] shadow-sm'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4cc61e] text-white text-xs font-bold px-3.5 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h2 className="text-base font-bold text-[#0f172a] mb-1">{plan.name}</h2>
                <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">{plan.desc}</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={annual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-baseline gap-1"
                  >
                    <span className="text-4xl font-bold text-[#0f172a]" style={{ letterSpacing: '-1px' }}>
                      {annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.period && <span className="text-sm text-[#94a3b8]">{plan.period}</span>}
                  </motion.div>
                </AnimatePresence>
                {annual && plan.period && (
                  <p className="text-xs text-[#4cc61e] font-medium mt-1">Billed annually</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#475569]">
                    <Check size={14} className="text-[#4cc61e] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaTo}
                className={`block text-center py-3 rounded-full font-semibold text-sm transition-all duration-200 ${plan.ctaClass}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Add-ons */}
      <section className="py-10 md:py-20 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Add-ons</h2>
            <p className="text-[#475569] mt-2">Extend any plan with what you need.</p>
          </motion.div>
          <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden shadow-sm">
            {addons.map((addon, i) => (
              <div key={addon.name} className={`flex items-center justify-between px-6 py-4 ${i < addons.length - 1 ? 'border-b border-[#f5f6f8]' : ''}`}>
                <span className="text-sm font-medium text-[#0f172a]">{addon.name}</span>
                <span className="text-sm font-semibold text-[#1a3fbf]">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.5px' }}>Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-[#0f172a] pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-[#94a3b8] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-[#94a3b8] flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-5 text-sm text-[#475569] leading-relaxed border-t border-[#f5f6f8] pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-6 md:p-10 text-center"
            style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.5px' }}>
              Need something bigger?
            </h2>
            <p className="text-white/80 mb-8">
              Custom contracts, dedicated infrastructure, and white-glove onboarding. Let's talk.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3.5 bg-white text-[#1a3fbf] font-semibold rounded-full hover:shadow-lg transition-all duration-200 text-sm"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
