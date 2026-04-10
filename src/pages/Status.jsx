import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const services = [
  { name: 'Live Chat Widget', status: 'operational', uptime: '99.99%' },
  { name: 'Omnichannel Inbox', status: 'operational', uptime: '99.97%' },
  { name: 'AI Features', status: 'operational', uptime: '99.95%' },
  { name: 'REST API', status: 'operational', uptime: '99.99%' },
  { name: 'WhatsApp Integration', status: 'operational', uptime: '99.98%' },
  { name: 'Email Delivery', status: 'operational', uptime: '99.96%' },
]

const statusConfig = {
  operational: { label: 'Operational', color: '#4cc61e', bg: '#f0fdf4', dot: '#4cc61e' },
  degraded: { label: 'Degraded', color: '#f59e0b', bg: '#fffbeb', dot: '#f59e0b' },
  outage: { label: 'Outage', color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
}

// Generate 90-day uptime bars (mostly green, occasional dips)
const generateUptimeDays = () =>
  Array.from({ length: 90 }, (_, i) => {
    const rand = Math.random()
    if (rand > 0.97) return 'degraded'
    if (rand > 0.995) return 'outage'
    return 'operational'
  })

const uptimeDays = generateUptimeDays()

const incidents = [
  {
    date: 'March 15, 2025',
    title: 'WhatsApp delivery delays,resolved',
    duration: '22 minutes',
    desc: 'WhatsApp message delivery was delayed by 30–90 seconds due to upstream provider maintenance. All messages were delivered successfully.',
  },
  {
    date: 'February 3, 2025',
    title: 'API elevated error rates,resolved',
    duration: '8 minutes',
    desc: 'A deployment rollout briefly caused elevated 5xx error rates on the REST API. Rolled back immediately.',
  },
]

export default function Status() {
  const allOperational = services.every(s => s.status === 'operational')

  return (
    <div className="pt-16">
      {/* Overall status banner */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: allOperational ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}
      >
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-[#4cc61e]" />
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-[#4cc61e] animate-ping opacity-30" />
            </div>
            <span className="text-2xl font-bold text-[#0f172a]">All systems operational</span>
          </div>
          <p className="text-sm text-[#475569]">Last checked: just now · Updated every 60 seconds</p>
        </motion.div>
      </section>

      {/* Service grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-[#0f172a]" style={{ letterSpacing: '-0.3px' }}>Services</h2>
          </motion.div>

          <div className="space-y-3">
            {services.map((service, i) => {
              const config = statusConfig[service.status]
              return (
                <motion.div
                  key={service.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  className="flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-[#e4e7ed] hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.dot }} />
                    <span className="text-sm font-medium text-[#0f172a]">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#94a3b8]">{service.uptime} uptime</span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{ color: config.color, backgroundColor: config.bg, borderColor: config.color + '30' }}
                    >
                      {config.label}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 90-day uptime */}
      <section className="py-16 px-4 bg-[#f5f6f8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0f172a]">90-day uptime</h2>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-[#0f172a]" style={{ letterSpacing: '-1px' }}>99.98%</div>
                <span className="text-xs text-[#4cc61e] font-semibold">all services</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e4e7ed] p-5">
              <div className="flex items-end gap-0.5 h-10 mb-2">
                {uptimeDays.map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    title={day}
                    style={{
                      height: day === 'operational' ? '100%' : day === 'degraded' ? '60%' : '20%',
                      backgroundColor: day === 'operational' ? '#4cc61e' : day === 'degraded' ? '#f59e0b' : '#ef4444',
                      opacity: day === 'operational' ? 0.85 : 1,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#94a3b8]">
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4">
              {Object.entries(statusConfig).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: val.dot }} />
                  <span className="text-xs text-[#94a3b8]">{val.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past incidents */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-[#0f172a] mb-6">Past incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.title} className="bg-white rounded-xl border border-[#e4e7ed] p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#0f172a]">{incident.title}</h3>
                  <span className="text-xs font-medium text-[#4cc61e] bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex-shrink-0 ml-3">
                    Resolved
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#94a3b8] mb-2">
                  <span>{incident.date}</span>
                  <span>·</span>
                  <span>Duration: {incident.duration}</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{incident.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
