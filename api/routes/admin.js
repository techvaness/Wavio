import { Router } from 'express'
import db from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { audit } from '../audit.js'

const router = Router()
router.use(requireAuth, requireAdmin)

// ── Platform-wide stats ───────────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const stats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM workspaces)                          AS workspace_count,
      (SELECT COUNT(*) FROM users)                               AS user_count,
      (SELECT COUNT(*) FROM conversations WHERE status = 'open') AS open_convos,
      (SELECT COUNT(*) FROM conversations)                       AS total_convos,
      (SELECT COUNT(*) FROM messages)                            AS total_messages,
      (SELECT COUNT(*) FROM contacts)                            AS contact_count
  `).get()
  res.json(stats)
})

// ── All workspaces ────────────────────────────────────────────────────────────
router.get('/workspaces', (req, res) => {
  const rows = db.prepare(`
    SELECT
      w.id, w.name, w.plan, w.created_at,
      (SELECT COUNT(*) FROM users      u WHERE u.workspace_id = w.id) AS agent_count,
      (SELECT COUNT(*) FROM conversations c WHERE c.workspace_id = w.id) AS convo_count,
      (SELECT email FROM users u WHERE u.workspace_id = w.id ORDER BY u.id ASC LIMIT 1) AS owner_email,
      (SELECT name  FROM users u WHERE u.workspace_id = w.id ORDER BY u.id ASC LIMIT 1) AS owner_name
    FROM workspaces w
    ORDER BY w.created_at DESC
  `).all()
  res.json(rows)
})

// ── All users ─────────────────────────────────────────────────────────────────
router.get('/users', (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
           w.name AS workspace_name, w.plan
    FROM users u
    LEFT JOIN workspaces w ON w.id = u.workspace_id
    ORDER BY u.created_at DESC
  `).all()
  res.json(rows)
})

// ── All conversations ─────────────────────────────────────────────────────────
router.get('/conversations', (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.subject, c.channel, c.status, c.priority, c.updated_at, c.created_at,
           w.name  AS workspace_name,
           ct.name AS contact_name,
           u.name  AS agent_name
    FROM conversations c
    LEFT JOIN workspaces w  ON w.id  = c.workspace_id
    LEFT JOIN contacts   ct ON ct.id = c.contact_id
    LEFT JOIN users      u  ON u.id  = c.assigned_to
    ORDER BY c.updated_at DESC
    LIMIT 200
  `).all()
  res.json(rows)
})

// ── Audit log ─────────────────────────────────────────────────────────────────
router.get('/audit-log', (req, res) => {
  const rows = db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT 200').all()
  res.json(rows)
})

// ── Suspend / reactivate a workspace ─────────────────────────────────────────
router.patch('/workspaces/:id/status', (req, res) => {
  const VALID = new Set(['active', 'suspended'])
  const { status } = req.body
  if (!VALID.has(status)) return res.status(400).json({ error: 'Invalid status' })
  db.prepare('UPDATE workspaces SET status = ? WHERE id = ?').run(status, req.params.id)
  audit('workspace.' + status, { adminId: req.user.id, workspaceId: req.params.id })
  res.json({ ok: true })
})

export default router
