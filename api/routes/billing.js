import { Router } from 'express'
import Stripe from 'stripe'
import db from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { audit } from '../audit.js'

const router = Router()

// ── Stripe client (lazy — only initialised when key is set) ──────────────────
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })
}

const PLAN_MRR = { starter: 0, free: 0, pro: 49, enterprise: 299 }

const PRICE_IDS = () => ({
  pro:        process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
})

// ── Admin-only routes ─────────────────────────────────────────────────────────

// GET /api/billing/summary — platform-wide MRR overview
router.get('/summary', requireAuth, requireAdmin, (req, res) => {
  const plans = db.prepare('SELECT plan, COUNT(*) AS count FROM workspaces GROUP BY plan').all()
  let mrr = 0
  const breakdown = plans.map(p => {
    const monthly = PLAN_MRR[p.plan] ?? 0
    mrr += monthly * p.count
    return { plan: p.plan, count: p.count, mrr: monthly * p.count, per_seat: monthly }
  })
  const totalWorkspaces = plans.reduce((s, p) => s + p.count, 0)
  res.json({ mrr, arr: mrr * 12, arpu: totalWorkspaces > 0 ? +(mrr / totalWorkspaces).toFixed(2) : 0, breakdown, workspace_count: totalWorkspaces })
})

// GET /api/billing/subscriptions — all workspaces with plan info
router.get('/subscriptions', requireAuth, requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT w.id, w.name, w.plan, w.status, w.created_at,
      (SELECT email FROM users u WHERE u.workspace_id = w.id ORDER BY u.id LIMIT 1) AS owner_email
    FROM workspaces w ORDER BY w.created_at DESC
  `).all()
  res.json(rows)
})

// ── Workspace-level billing routes ────────────────────────────────────────────

// GET /api/billing/plan — current workspace plan
router.get('/plan', requireAuth, (req, res) => {
  const ws = db.prepare('SELECT id, name, plan, status FROM workspaces WHERE id = ?').get(req.user.workspace_id)
  if (!ws) return res.status(404).json({ error: 'Workspace not found' })

  const PLAN_LIMITS = { starter: 100, free: 100, pro: 5000, enterprise: 50000 }
  const limit = PLAN_LIMITS[ws.plan] ?? 100

  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01 00:00:00`
  const { count: used } = db.prepare(
    'SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND created_at >= ?'
  ).get(req.user.workspace_id, monthStart)

  const agentCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE workspace_id = ?').get(req.user.workspace_id).count

  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY
  res.json({ ...ws, stripe_configured: stripeConfigured, plans: PLAN_MRR, used, limit, agent_count: agentCount })
})

// POST /api/billing/checkout — create Stripe Checkout session for plan upgrade
router.post('/checkout', requireAuth, async (req, res) => {
  const stripe = getStripe()
  if (!stripe) return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your .env' })

  const { plan } = req.body
  const prices = PRICE_IDS()
  const priceId = prices[plan]
  if (!priceId) return res.status(400).json({ error: `No Stripe price configured for plan: ${plan}` })

  const user = db.prepare('SELECT email, name FROM users WHERE id = ?').get(req.user.id)
  const ws   = db.prepare('SELECT name, stripe_customer_id FROM workspaces WHERE id = ?').get(req.user.workspace_id)

  // Create or reuse Stripe customer
  let customerId = ws?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: ws?.name, metadata: { workspace_id: String(req.user.workspace_id) } })
    customerId = customer.id
    db.prepare('UPDATE workspaces SET stripe_customer_id = ? WHERE id = ?').run(customerId, req.user.workspace_id)
  }

  const appUrl = process.env.APP_URL || 'http://localhost:5173'
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/portal/settings?billing=success`,
    cancel_url:  `${appUrl}/portal/settings?billing=cancelled`,
    metadata: { workspace_id: String(req.user.workspace_id), plan },
  })

  audit('billing.checkout.created', { userId: req.user.id, plan, sessionId: session.id })
  res.json({ url: session.url })
})

// POST /api/billing/portal — Stripe customer portal (manage/cancel)
router.post('/portal', requireAuth, async (req, res) => {
  const stripe = getStripe()
  if (!stripe) return res.status(503).json({ error: 'Stripe is not configured' })

  const ws = db.prepare('SELECT stripe_customer_id FROM workspaces WHERE id = ?').get(req.user.workspace_id)
  if (!ws?.stripe_customer_id) return res.status(400).json({ error: 'No active subscription found' })

  const appUrl = process.env.APP_URL || 'http://localhost:5173'
  const session = await stripe.billingPortal.sessions.create({
    customer: ws.stripe_customer_id,
    return_url: `${appUrl}/portal/settings`,
  })
  res.json({ url: session.url })
})

// POST /api/billing/webhook — Stripe webhook (raw body required)
router.post('/webhook', express_raw_middleware, async (req, res) => {
  const stripe = getStripe()
  if (!stripe) return res.status(503).send('Stripe not configured')

  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { workspace_id, plan } = session.metadata || {}
    if (workspace_id && plan) {
      db.prepare('UPDATE workspaces SET plan = ? WHERE id = ?').run(plan, Number(workspace_id))
      audit('billing.plan.upgraded', { workspaceId: workspace_id, plan, sessionId: session.id })
      console.log(`[stripe] workspace ${workspace_id} upgraded to ${plan}`)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    const ws = db.prepare('SELECT id FROM workspaces WHERE stripe_customer_id = ?').get(sub.customer)
    if (ws) {
      db.prepare('UPDATE workspaces SET plan = ? WHERE id = ?').run('starter', ws.id)
      audit('billing.plan.downgraded', { workspaceId: ws.id, reason: 'subscription_cancelled' })
    }
  }

  res.json({ received: true })
})

// Raw body parser needed only for Stripe webhook signature verification
function express_raw_middleware(req, res, next) {
  let data = ''
  req.setEncoding('latin1')
  req.on('data', chunk => { data += chunk })
  req.on('end', () => {
    req.body = Buffer.from(data, 'latin1')
    next()
  })
}

export default router
