import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/stats', requireAuth, (req, res) => {
  const wsId = req.user.workspace_id
  const userId = req.user.id

  const open      = db.prepare(`SELECT COUNT(*) AS c FROM conversations WHERE workspace_id = ? AND status = 'open'`).get(wsId).c
  const pending   = db.prepare(`SELECT COUNT(*) AS c FROM conversations WHERE workspace_id = ? AND status = 'pending'`).get(wsId).c
  const resolvedToday = db.prepare(`SELECT COUNT(*) AS c FROM conversations WHERE workspace_id = ? AND status = 'resolved' AND DATE(updated_at) = DATE('now')`).get(wsId).c
  const agentsOnline  = db.prepare(`SELECT COUNT(*) AS c FROM users WHERE workspace_id = ? AND status IN ('online','busy')`).get(wsId).c
  const totalAgents   = db.prepare(`SELECT COUNT(*) AS c FROM users WHERE workspace_id = ?`).get(wsId).c

  const myQueue = db.prepare(`
    SELECT c.id, c.subject, c.channel, c.priority, c.updated_at,
           ct.name AS contact_name
    FROM conversations c
    LEFT JOIN contacts ct ON ct.id = c.contact_id
    WHERE c.workspace_id = ? AND c.assigned_to = ? AND c.status != 'resolved'
    ORDER BY c.priority DESC, c.updated_at ASC
    LIMIT 10
  `).all(wsId, userId)

  const team = db.prepare(`
    SELECT id, name, status, avatar,
           (SELECT COUNT(*) FROM conversations WHERE assigned_to = users.id AND status != 'resolved') AS convos
    FROM users WHERE workspace_id = ? ORDER BY status ASC, name ASC
  `).all(wsId)

  const activity = db.prepare(`
    SELECT m.text, m.from_type, m.created_at, c.id AS convo_id,
           ct.name AS contact_name, u.name AS agent_name
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    LEFT JOIN contacts ct ON ct.id = c.contact_id
    LEFT JOIN users u ON u.id = m.from_id
    WHERE c.workspace_id = ?
    ORDER BY m.created_at DESC LIMIT 10
  `).all(wsId)

  res.json({ open, pending, resolvedToday, agentsOnline, totalAgents, myQueue, team, activity })
})

router.get('/reports', requireAuth, (req, res) => {
  const wsId = req.user.workspace_id

  const total    = db.prepare(`SELECT COUNT(*) AS c FROM conversations WHERE workspace_id = ?`).get(wsId).c
  const resolved = db.prepare(`SELECT COUNT(*) AS c FROM conversations WHERE workspace_id = ? AND status = 'resolved'`).get(wsId).c

  // Volume last 7 days
  const vol7 = db.prepare(`
    SELECT DATE(created_at) AS day, COUNT(*) AS total,
           SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM conversations WHERE workspace_id = ? AND created_at >= DATE('now', '-7 days')
    GROUP BY day ORDER BY day ASC
  `).all(wsId)

  // Channel breakdown
  const channels = db.prepare(`
    SELECT channel,
           COUNT(*) AS convos,
           SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM conversations WHERE workspace_id = ?
    GROUP BY channel ORDER BY convos DESC
  `).all(wsId)

  // Agent stats
  const agents = db.prepare(`
    SELECT u.name,
           COUNT(c.id) AS convos,
           SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM users u
    LEFT JOIN conversations c ON c.assigned_to = u.id AND c.workspace_id = ?
    WHERE u.workspace_id = ?
    GROUP BY u.id ORDER BY convos DESC
  `).all(wsId, wsId)

  res.json({ total, resolved, vol7, channels, agents })
})

export default router
