import { motion } from 'framer-motion'

const msgs = [
  { from: 'bot', text: 'Hi! How can I help you today?' },
  { from: 'user', text: 'I want to track my order.' },
  { from: 'bot', text: 'Sure! Enter your order number and I\'ll pull it up right away.' },
]

export default function ChatWidgetMockup() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative flex justify-end items-end"
      style={{ minHeight: 400 }}
    >
      {/* Browser frame background */}
      <div className="absolute inset-0 bg-[#f5f6f8] rounded-2xl border border-[#e4e7ed] overflow-hidden">
        <div className="h-8 bg-white border-b border-[#e4e7ed] flex items-center px-3 gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
          <div className="mx-auto bg-[#f5f6f8] rounded px-8 py-0.5 text-[9px] text-[#94a3b8]">yoursite.com</div>
        </div>
        <div className="p-4 space-y-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-3 bg-[#e4e7ed] rounded" style={{ width: `${60 + i * 8}%` }} />
          ))}
        </div>
      </div>

      {/* Widget popup */}
      <div
        className="relative z-10 w-72 rounded-2xl overflow-hidden border border-[#e4e7ed] mr-2 mb-12"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)' }}>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">W</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4cc61e] border-2 border-[#1a3fbf] rounded-full" />
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Wavio Support</div>
              <div className="text-white/70 text-[10px]">Typically replies in &lt; 2 min</div>
            </div>
          </div>
          <button className="text-white/60 hover:text-white text-lg leading-none">×</button>
        </div>

        {/* Messages */}
        <div className="bg-white p-3 space-y-2.5 min-h-40">
          {msgs.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-[#1a3fbf] text-white rounded-br-sm'
                    : 'bg-[#f5f6f8] text-[#0f172a] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <div className="bg-[#f5f6f8] rounded-xl rounded-bl-sm px-3 py-2">
              <div className="flex gap-1">
                {[0,0.15,0.3].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[#e4e7ed] bg-white px-3 py-2.5 flex items-center gap-2">
          <input
            readOnly
            placeholder="Write a message..."
            className="flex-1 text-xs text-[#94a3b8] outline-none bg-transparent"
          />
          <div className="w-7 h-7 rounded-full bg-[#1a3fbf] flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white text-center py-1.5 border-t border-[#e4e7ed]">
          <span className="text-[9px] text-[#94a3b8]">Powered by <span className="font-bold text-[#1a3fbf]">Wavio</span></span>
        </div>
      </div>

      {/* Floating bubble */}
      <div
        className="absolute bottom-0 right-0 w-12 h-12 rounded-full z-20 flex items-center justify-center cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #1a3fbf 0%, #2e5de6 100%)', boxShadow: '0 8px 24px rgba(26,63,191,0.4)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4cc61e] rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
      </div>
    </motion.div>
  )
}
