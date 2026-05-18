/**
 * Express app factory — exported separately so tests can import without
 * binding a port. server.js imports this and calls httpServer.listen().
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes         from './routes/auth.js'
import oauthRoutes        from './routes/oauth.js'
import conversationRoutes from './routes/conversations.js'
import contactRoutes      from './routes/contacts.js'
import teamRoutes         from './routes/team.js'
import dashboardRoutes    from './routes/dashboard.js'
import cannedRoutes       from './routes/canned.js'
import adminRoutes        from './routes/admin.js'
import analyticsRoutes    from './routes/analytics.js'
import automationRoutes   from './routes/automations.js'
import uploadsRoutes      from './routes/uploads.js'
import integrationsRoutes from './routes/integrations.js'
import billingRoutes      from './routes/billing.js'
import systemRoutes       from './routes/system.js'
import webhookRoutes      from './routes/webhooks.js'

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173']

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:'],
      connectSrc: ["'self'", 'ws:', 'wss:'],
    },
  },
}))

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }))
app.use(express.json({ limit: '64kb' }))

app.use('/api/auth',          authRoutes)
app.use('/api/auth',          oauthRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/contacts',      contactRoutes)
app.use('/api/team',          teamRoutes)
app.use('/api/dashboard',     dashboardRoutes)
app.use('/api/canned',        cannedRoutes)
app.use('/api/admin',         adminRoutes)
app.use('/api/analytics',     analyticsRoutes)
app.use('/api/automations',   automationRoutes)
app.use('/api/upload',        uploadsRoutes)
app.use('/api/uploads',       uploadsRoutes)
app.use('/api/integrations',  integrationsRoutes)
app.use('/api/billing',       billingRoutes)
app.use('/api/system',        systemRoutes)
app.use('/api/webhooks',      webhookRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use((err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`)
  res.status(err.status || 500).json({ error: 'Internal server error' })
})

export default app
