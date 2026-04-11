import { Router } from 'express'
import db from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireAdmin)

// Platform billing summary derived from real workspace data
router.get('/summary', (req, res) => {
  const plans = db.prepare(`
    SELECT plan, COUNT(*) AS count FROM workspaces GROUP BY plan
  `).all()

  // Plan MRR: starter=$0, pro=$49, enterprise=$299 (illustrative rates)
  const PLAN_MRR = { starter: 0, free: 0, pro: 49, enterprise: 299 }
  let mrr = 0
  const breakdown = plans.map(p => {
    const monthly = PLAN_MRR[p.plan] ?? 0
    mrr += monthly * p.count
    return { plan: p.plan, count: p.count, mrr: monthly * p.count, per_seat: monthly }
  })

  const totalWorkspaces = plans.reduce((s, p) => s + p.count, 0)

  res.json({
    mrr,
    arr: mrr * 12,
    arpu: totalWorkspaces > 0 ? +(mrr / totalWorkspaces).toFixed(2) : 0,
    breakdown,
    workspace_count: totalWorkspaces,
  })
})

// All workspaces with plan info (subscriptions view)
router.get('/subscriptions', (req, res) => {
  const rows = db.prepare(`
    SELECT w.id, w.name, w.plan, w.created_at,
      (SELECT email FROM users u WHERE u.workspace_id = w.id ORDER BY u.id LIMIT 1) AS owner_email
    FROM workspaces w ORDER BY w.created_at DESC
  `).all()
  res.json(rows)
})

export default router
