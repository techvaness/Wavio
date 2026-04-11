import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM canned_responses WHERE workspace_id = ? ORDER BY shortcut ASC').all(req.user.workspace_id))
})

router.post('/', requireAuth, (req, res) => {
  const { shortcut, text } = req.body
  if (!shortcut || !text) return res.status(400).json({ error: 'shortcut and text required' })
  const result = db.prepare('INSERT INTO canned_responses (workspace_id, shortcut, text) VALUES (?, ?, ?)').run(req.user.workspace_id, shortcut, text)
  res.status(201).json(db.prepare('SELECT * FROM canned_responses WHERE id = ?').get(result.lastInsertRowid))
})

router.patch('/:id', requireAuth, (req, res) => {
  const { shortcut, text } = req.body
  if (!shortcut || !text) return res.status(400).json({ error: 'shortcut and text required' })
  const existing = db.prepare('SELECT id FROM canned_responses WHERE id = ? AND workspace_id = ?').get(req.params.id, req.user.workspace_id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  db.prepare('UPDATE canned_responses SET shortcut = ?, text = ? WHERE id = ?').run(shortcut, text, req.params.id)
  res.json(db.prepare('SELECT * FROM canned_responses WHERE id = ?').get(req.params.id))
})

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM canned_responses WHERE id = ? AND workspace_id = ?').run(req.params.id, req.user.workspace_id)
  res.json({ ok: true })
})

export default router
