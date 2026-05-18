import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, (req, res) => {
  const agents = db.prepare(`
    SELECT id, name, email, role, status, avatar, created_at,
           (SELECT COUNT(*) FROM conversations c WHERE c.assigned_to = users.id AND c.status != 'resolved') AS open_convos,
           (SELECT COUNT(*) FROM conversations c WHERE c.assigned_to = users.id AND c.status = 'resolved') AS resolved_convos
    FROM users WHERE workspace_id = ?
    ORDER BY role DESC, name ASC
  `).all(req.user.workspace_id)
  res.json(agents)
})

// ── A01: Agents can only update their OWN status; admins can update any ───────
router.patch('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body
  const targetId = Number(req.params.id)

  if (!['online', 'busy', 'offline'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  // Non-admins can only change their own status
  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // Ensure target user is in the same workspace
  const target = db.prepare('SELECT id FROM users WHERE id = ? AND workspace_id = ?')
    .get(targetId, req.user.workspace_id)
  if (!target) return res.status(404).json({ error: 'User not found' })

  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, targetId)

  // Broadcast via socket if available
  const io = req.app.get('io')
  if (io) {
    io.to(`workspace:${req.user.workspace_id}`)
      .emit('agent:status', { userId: targetId, status })
  }

  res.json({ ok: true, status })
})

// ── POST /api/team — invite a new agent (admin only) ─────────────────────────
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { name, email, password, role = 'agent' } = req.body
  if (!name?.trim())  return res.status(400).json({ error: 'Name is required' })
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (!['agent', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' })

  const cleanEmail = String(email).toLowerCase().trim().slice(0, 254)
  const cleanName  = String(name).trim().slice(0, 100)

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail)
  if (existing) return res.status(409).json({ error: 'An account with that email already exists' })

  const result = db.prepare(
    'INSERT INTO users (workspace_id, email, password, name, role, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.workspace_id, cleanEmail, bcrypt.hashSync(password, 10), cleanName, role, 'offline', cleanName[0].toUpperCase())

  const user = db.prepare(
    'SELECT id, name, email, role, status, avatar, created_at FROM users WHERE id = ?'
  ).get(result.lastInsertRowid)

  res.status(201).json({ ...user, open_convos: 0, resolved_convos: 0 })
})

// ── DELETE /api/team/:id — remove a team member (admin only) ─────────────────
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const targetId = Number(req.params.id)
  if (targetId === req.user.id) return res.status(400).json({ error: 'Cannot remove yourself' })

  const target = db.prepare('SELECT id FROM users WHERE id = ? AND workspace_id = ?').get(targetId, req.user.workspace_id)
  if (!target) return res.status(404).json({ error: 'User not found' })

  db.prepare('UPDATE conversations SET assigned_to = NULL WHERE assigned_to = ?').run(targetId)
  db.prepare('DELETE FROM users WHERE id = ?').run(targetId)
  res.json({ ok: true })
})

export default router
