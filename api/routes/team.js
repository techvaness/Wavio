import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

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

export default router
