import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import db from '../db.js'

const router = Router()
router.use(requireAuth, requireAdmin)

router.get('/health', (_req, res) => {
  const mem = process.memoryUsage()
  const uptime = process.uptime()

  // DB responsiveness
  let dbOk = false, dbMs = 0
  try {
    const t0 = Date.now()
    db.prepare('SELECT 1').get()
    dbMs  = Date.now() - t0
    dbOk  = true
  } catch { /* db down */ }

  // Count recent errors from audit log
  const recentErrors = db.prepare(
    "SELECT COUNT(*) AS c FROM audit_log WHERE event LIKE 'auth.login.failed%' AND ts > datetime('now', '-1 hour')"
  ).get()

  const heapUsedMb  = Math.round(mem.heapUsed  / 1024 / 1024)
  const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024)
  const heapPct     = Math.round((mem.heapUsed / mem.heapTotal) * 100)

  res.json({
    uptime_seconds: Math.round(uptime),
    memory: { heap_used_mb: heapUsedMb, heap_total_mb: heapTotalMb, heap_pct: heapPct, rss_mb: Math.round(mem.rss / 1024 / 1024) },
    db:     { ok: dbOk, response_ms: dbMs },
    recent_failed_logins: recentErrors?.c ?? 0,
    node_version: process.version,
    platform: process.platform,
  })
})

router.get('/logs', (_req, res) => {
  // Return last 50 audit log entries as the "system log"
  const rows = db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT 50').all()
  res.json(rows)
})

export default router
