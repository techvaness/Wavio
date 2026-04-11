import jwt from 'jsonwebtoken'

// ── A07/A02: Warn loudly about the insecure default secret ───────────────────
const INSECURE_DEFAULT = 'wavio-dev-secret-2026'
export const JWT_SECRET = process.env.JWT_SECRET || INSECURE_DEFAULT

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set — using insecure default. Set JWT_SECRET env var before deploying.')
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = header.slice(7)
  // A07: reject obviously malformed tokens early (prevent ReDoS on regex-heavy jwt libs)
  if (token.length > 2048) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    next()
  } catch {
    // A09: don't leak which jwt validation step failed
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── A01: Admin-only guard ─────────────────────────────────────────────────────
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  next()
}
