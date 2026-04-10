import { motion } from 'framer-motion'

const threads = [
  { channel: 'WhatsApp', color: '#25D366', bg: '#dcfce7', name: 'Maria G.', msg: 'Is this product available in blue?', time: '1m', unread: 2 },
  { channel: 'Instagram', color: '#E1306C', bg: '#fce7f3', name: 'Jake R.', msg: 'Loved your last post! Quick question...', time: '5m', unread: 1 },
  { channel: 'Email', color: '#1a3fbf', bg: '#eff6ff', name: 'Acme Corp', msg: 'Re: Enterprise plan inquiry', time: '12m', unread: 0 },
  { channel: 'Facebook', color: '#1877F2', bg: '#eff6ff', name: 'Tom S.', msg: 'When does my order arrive?', time: '1h', unread: 0 },
  { channel: 'SMS', color: '#64748b', bg: '#f1f5f9', name: '+1 555 0192', msg: 'Thanks for the quick reply!', time: '2h', unread: 0 },
]

const channelIcon = (ch) => {
  if (ch === 'WhatsApp') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.054 23.447a.5.5 0 0 0 .617.617l5.532-1.483A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
  )
  if (ch === 'Instagram') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/><circle cx="18" cy="6" r="1.5" fill="white"/></svg>
  )
  if (ch === 'Facebook') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  )
  if (ch === 'Email') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  )
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}

export default function OmnichannelMockup() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-md mx-auto"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(26,63,191,0.15))' }}
    >
      <div className="bg-white rounded-2xl border border-[#e4e7ed] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#e4e7ed] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">All Conversations</h3>
            <p className="text-xs text-[#94a3b8]">5 open · 2 unread</p>
          </div>
          <div className="flex items-center gap-1.5">
            {['#25D366','#E1306C','#1a3fbf','#1877F2','#64748b'].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: c }}>
                <div className="w-2 h-2 bg-white rounded-full opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* Thread list */}
        <div>
          {threads.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-3 px-4 py-3 border-b border-[#f5f6f8] hover:bg-[#f9fafb] cursor-pointer transition-colors ${i === 0 ? 'bg-blue-50/40' : ''}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a3fbf] to-[#4cc61e] flex items-center justify-center text-white text-xs font-bold">
                  {t.name[0]}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: t.color }}
                >
                  {channelIcon(t.channel)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-[#0f172a] truncate">{t.name}</span>
                  <span className="text-[10px] text-[#94a3b8] ml-2 flex-shrink-0">{t.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[#94a3b8] truncate">{t.msg}</p>
                  {t.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 w-4 h-4 bg-[#1a3fbf] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                      {t.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Channel filter pills */}
        <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {['All', 'WhatsApp', 'Instagram', 'Email', 'SMS'].map((ch, i) => (
            <span
              key={ch}
              className={`flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full border ${i === 0 ? 'bg-[#1a3fbf] text-white border-[#1a3fbf]' : 'bg-white text-[#475569] border-[#e4e7ed]'}`}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
