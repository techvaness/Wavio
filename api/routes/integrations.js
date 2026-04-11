import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const SUPPORTED_CHANNELS = ['whatsapp', 'email', 'sms', 'instagram', 'shopify', 'slack']

// GET  /api/integrations
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM integrations WHERE workspace_id = ?'
  ).all(req.user.workspace_id)
  res.json(rows.map(r => ({
    ...r,
    config: typeof r.config === 'string' ? JSON.parse(r.config) : r.config,
    connected: Boolean(r.connected),
  })))
})

// POST /api/integrations/:channel/connect
router.post('/:channel/connect', requireAuth, (req, res) => {
  const { channel } = req.params
  if (!SUPPORTED_CHANNELS.includes(channel)) {
    return res.status(400).json({ error: 'Unsupported channel' })
  }

  // Sanitise incoming config — only store non-sensitive keys
  const raw    = req.body || {}
  const config = {}
  if (raw.phone_number) config.phone_number = String(raw.phone_number).slice(0, 30)
  if (raw.email)        config.email        = String(raw.email).slice(0, 254)
  if (raw.webhook_url)  config.webhook_url  = String(raw.webhook_url).slice(0, 500)
  if (raw.shop_domain)  config.shop_domain  = String(raw.shop_domain).slice(0, 100)
  if (raw.channel_name) config.channel_name = String(raw.channel_name).slice(0, 100)
  if (raw.username)     config.username     = String(raw.username).slice(0, 100)

  db.prepare(`
    INSERT INTO integrations (workspace_id, channel, config, connected)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(workspace_id, channel) DO UPDATE SET config = excluded.config, connected = 1
  `).run(req.user.workspace_id, channel, JSON.stringify(config))

  const row = db.prepare('SELECT * FROM integrations WHERE workspace_id = ? AND channel = ?')
    .get(req.user.workspace_id, channel)
  res.json({ ...row, config: JSON.parse(row.config), connected: true })
})

// DELETE /api/integrations/:channel
router.delete('/:channel', requireAuth, (req, res) => {
  db.prepare('UPDATE integrations SET connected = 0, config = ? WHERE workspace_id = ? AND channel = ?')
    .run('{}', req.user.workspace_id, req.params.channel)
  res.json({ ok: true })
})

export default router
