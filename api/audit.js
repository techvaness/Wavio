import db from './db.js'

export function audit(event, detail = {}) {
  const ts = new Date().toISOString()
  console.log(JSON.stringify({ ts, event, ...detail }))
  try {
    db.prepare('INSERT INTO audit_log (ts, event, actor, detail) VALUES (?, ?, ?, ?)')
      .run(ts, event, String(detail.userId || detail.ip || 'system'), JSON.stringify(detail))
  } catch {
    // fail silently — never let audit logging break a request
  }
}
