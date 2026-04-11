import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── Right-click / context menu protection ─────────────────────────────────────
document.addEventListener('contextmenu', (e) => e.preventDefault())

// Block common keyboard inspect shortcuts
document.addEventListener('keydown', (e) => {
  const key = e.key
  const ctrl = e.ctrlKey || e.metaKey

  // F12 — DevTools
  if (key === 'F12') { e.preventDefault(); return }

  // Ctrl+Shift+I / Cmd+Shift+I — DevTools
  if (ctrl && e.shiftKey && (key === 'I' || key === 'i')) { e.preventDefault(); return }

  // Ctrl+Shift+J / Cmd+Shift+J — Console
  if (ctrl && e.shiftKey && (key === 'J' || key === 'j')) { e.preventDefault(); return }

  // Ctrl+Shift+C / Cmd+Shift+C — Inspector
  if (ctrl && e.shiftKey && (key === 'C' || key === 'c')) { e.preventDefault(); return }

  // Ctrl+U / Cmd+U — View source
  if (ctrl && (key === 'U' || key === 'u')) { e.preventDefault(); return }

  // Ctrl+S / Cmd+S — Save page
  if (ctrl && (key === 'S' || key === 's')) { e.preventDefault(); return }

  // Ctrl+P / Cmd+P — Print
  if (ctrl && (key === 'P' || key === 'p')) { e.preventDefault(); return }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
