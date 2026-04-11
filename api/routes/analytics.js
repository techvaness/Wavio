import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── Generate last-N-days date array ──────────────────────────────────────────
function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}

router.get('/', requireAuth, (req, res) => {
  const wsId = req.user.workspace_id

  // Conversations per day (last 7 days) — zero-fill missing days
  const rawDaily = db.prepare(`
    SELECT date(created_at) AS day, COUNT(*) AS count
    FROM conversations
    WHERE workspace_id = ? AND date(created_at) >= date('now', '-6 days')
    GROUP BY date(created_at)
    ORDER BY day
  `).all(wsId)

  const dailyMap = Object.fromEntries(rawDaily.map(r => [r.day, r.count]))
  const daily = lastNDays(7).map(day => ({ day, count: dailyMap[day] ?? 0 }))

  // Status breakdown
  const statusBreakdown = db.prepare(`
    SELECT status, COUNT(*) AS count FROM conversations WHERE workspace_id = ?
    GROUP BY status
  `).all(wsId)

  // Channel breakdown
  const channelBreakdown = db.prepare(`
    SELECT channel, COUNT(*) AS count FROM conversations WHERE workspace_id = ?
    GROUP BY channel ORDER BY count DESC
  `).all(wsId)

  // Totals
  const totals = db.prepare(`
    SELECT
      COUNT(*)  AS total_convos,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved,
      SUM(CASE WHEN status = 'open'     THEN 1 ELSE 0 END) AS open
    FROM conversations WHERE workspace_id = ?
  `).get(wsId)

  const totalMsgs = db.prepare(`
    SELECT COUNT(*) AS count FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE c.workspace_id = ?
  `).get(wsId)

  // Agent leaderboard
  const agents = db.prepare(`
    SELECT u.name, u.avatar,
      COUNT(c.id) AS total,
      SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM conversations c
    JOIN users u ON u.id = c.assigned_to
    WHERE c.workspace_id = ?
    GROUP BY u.id ORDER BY resolved DESC LIMIT 5
  `).all(wsId)

  // Resolution rate
  const resolutionRate = totals.total_convos > 0
    ? Math.round((totals.resolved / totals.total_convos) * 100)
    : 0

  res.json({
    daily,
    statusBreakdown,
    channelBreakdown,
    totals: { ...totals, total_messages: totalMsgs.count, resolution_rate: resolutionRate },
    agents,
  })
})

export default router
