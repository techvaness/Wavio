import { Router } from 'express'
import db from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { audit } from '../audit.js'

const router = Router()
router.use(requireAuth, requireAdmin)

// ── Platform settings helpers ─────────────────────────────────────────────────
function getSetting(key, defaultVal) {
  const row = db.prepare('SELECT value FROM platform_settings WHERE key = ?').get(key)
  if (!row) return defaultVal
  try { return JSON.parse(row.value) } catch { return row.value }
}
function setSetting(key, value) {
  db.prepare('INSERT OR REPLACE INTO platform_settings (key, value) VALUES (?, ?)').run(key, JSON.stringify(value))
}

const DEFAULT_PLAN_CONFIG = {
  starter:    { name: 'Starter',    price: 0,   conversation_limit: 100,  seat_limit: 2  },
  pro:        { name: 'Pro',        price: 49,  conversation_limit: 5000, seat_limit: 10 },
  enterprise: { name: 'Enterprise', price: 299, conversation_limit: -1,   seat_limit: -1 },
}

const DEFAULT_FLAGS = {
  ai_suggestions:        true,
  omnichannel_whatsapp:  true,
  bot_builder:           false,
  live_translate:        false,
  custom_reports:        true,
  sso:                   false,
  api_v2:                true,
}

const DEFAULT_GENERAL = {
  platform_name:    'Wavio',
  support_email:    'support@wavio.com',
  platform_url:     'https://wavio.com',
  maintenance_mode: false,
}

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

// ── Change workspace plan ─────────────────────────────────────────────────────
router.patch('/workspaces/:id/plan', (req, res) => {
  const { plan } = req.body
  const valid = new Set(['starter', 'free', 'pro', 'enterprise'])
  if (!valid.has(plan)) return res.status(400).json({ error: 'Invalid plan' })
  db.prepare('UPDATE workspaces SET plan = ? WHERE id = ?').run(plan, Number(req.params.id))
  audit('workspace.plan.changed', { adminId: req.user.id, workspaceId: req.params.id, plan })
  res.json({ ok: true })
})

// ── General settings ──────────────────────────────────────────────────────────
router.get('/general-settings', (_req, res) => {
  res.json(getSetting('general_settings', DEFAULT_GENERAL))
})
router.patch('/general-settings', (req, res) => {
  const { platform_name, support_email, platform_url, maintenance_mode } = req.body
  setSetting('general_settings', { platform_name, support_email, platform_url, maintenance_mode: !!maintenance_mode })
  audit('admin.general_settings.updated', { adminId: req.user.id })
  res.json({ ok: true })
})

// ── Plan config ───────────────────────────────────────────────────────────────
router.get('/plan-config', (_req, res) => {
  res.json(getSetting('plan_config', DEFAULT_PLAN_CONFIG))
})
router.patch('/plan-config', (req, res) => {
  setSetting('plan_config', req.body)
  audit('admin.plan_config.updated', { adminId: req.user.id })
  res.json({ ok: true })
})

// ── Feature flags ─────────────────────────────────────────────────────────────
router.get('/feature-flags', (_req, res) => {
  res.json(getSetting('feature_flags', DEFAULT_FLAGS))
})
router.patch('/feature-flags', (req, res) => {
  setSetting('feature_flags', req.body)
  audit('admin.feature_flags.updated', { adminId: req.user.id })
  res.json({ ok: true })
})

export default router
