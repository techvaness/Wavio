/**
 * Social OAuth — Google & GitHub
 *
 * Flow:
 *  1. Frontend opens  GET /api/auth/google  (or /github)
 *  2. Browser redirects to provider consent screen
 *  3. Provider redirects back to /api/auth/google/callback (or /github/callback)
 *  4. We exchange the code for a profile, upsert the user, mint a JWT
 *  5. We redirect the browser to  APP_URL/auth/callback?token=<jwt>
 *  6. Frontend reads the token from the URL and logs the user in
 *
 * Setup:
 *  Google → https://console.cloud.google.com › APIs & Services › Credentials
 *    Redirect URI: http://localhost:3001/api/auth/google/callback
 *
 *  GitHub → https://github.com/settings/developers › New OAuth App
 *    Callback URL: http://localhost:3001/api/auth/github/callback
 */

import { Router } from 'express'
import jwt    from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db     from '../db.js'
import { JWT_SECRET } from '../middleware/auth.js'
import { audit }      from '../audit.js'

const router = Router()

const APP_URL     = () => process.env.APP_URL     || 'http://localhost:5173'
const API_URL     = () => process.env.API_URL      || 'http://localhost:3001'
const GOOGLE_ID   = () => process.env.GOOGLE_CLIENT_ID
const GOOGLE_SEC  = () => process.env.GOOGLE_CLIENT_SECRET
const GITHUB_ID   = () => process.env.GITHUB_CLIENT_ID
const GITHUB_SEC  = () => process.env.GITHUB_CLIENT_SECRET

// ── Helpers ───────────────────────────────────────────────────────────────────

function upsertOAuthUser({ email, name, provider }) {
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase())

  if (!user) {
    // Create a workspace + user for first-time OAuth sign-ups
    const company = name.split(' ')[0] + "'s workspace"
    const ws = db.prepare('INSERT INTO workspaces (name, plan) VALUES (?, ?)').run(company, 'starter')
    const randomPw = bcrypt.hashSync(Math.random().toString(36), 8)
    const res = db.prepare(
      'INSERT INTO users (workspace_id, email, password, name, role, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(ws.lastInsertRowid, email.toLowerCase(), randomPw, name, 'agent', 'online', name[0].toUpperCase())
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(res.lastInsertRowid)
    audit('auth.oauth.register', { provider, userId: user.id, email })
  } else {
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('online', user.id)
    audit('auth.oauth.login', { provider, userId: user.id })
  }

  return user
}

function mintJwt(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, workspace_id: user.workspace_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function redirectError(res, msg) {
  return res.redirect(`${APP_URL()}/auth?error=${encodeURIComponent(msg)}`)
}

// ── Google ────────────────────────────────────────────────────────────────────

router.get('/google', (req, res) => {
  if (!GOOGLE_ID()) return redirectError(res, 'Google OAuth is not configured')
  const params = new URLSearchParams({
    client_id:     GOOGLE_ID(),
    redirect_uri:  `${API_URL()}/api/auth/google/callback`,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'online',
    prompt:        'select_account',
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query
  if (error || !code) return redirectError(res, 'Google sign-in was cancelled')
  if (!GOOGLE_ID() || !GOOGLE_SEC()) return redirectError(res, 'Google OAuth is not configured')

  try {
    // Exchange code → tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     GOOGLE_ID(),
        client_secret: GOOGLE_SEC(),
        redirect_uri:  `${API_URL()}/api/auth/google/callback`,
        grant_type:    'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) return redirectError(res, 'Google token exchange failed')

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileRes.json()
    if (!profile.email) return redirectError(res, 'Could not retrieve Google email')

    const user  = upsertOAuthUser({ email: profile.email, name: profile.name || profile.email, provider: 'google' })
    const token = mintJwt(user)

    res.redirect(`${APP_URL()}/auth/callback?token=${encodeURIComponent(token)}`)
  } catch (err) {
    console.error('[oauth/google]', err)
    redirectError(res, 'Google sign-in failed')
  }
})

// ── GitHub ────────────────────────────────────────────────────────────────────

router.get('/github', (req, res) => {
  if (!GITHUB_ID()) return redirectError(res, 'GitHub OAuth is not configured')
  const params = new URLSearchParams({
    client_id:    GITHUB_ID(),
    redirect_uri: `${API_URL()}/api/auth/github/callback`,
    scope:        'user:email',
  })
  res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

router.get('/github/callback', async (req, res) => {
  const { code, error } = req.query
  if (error || !code) return redirectError(res, 'GitHub sign-in was cancelled')
  if (!GITHUB_ID() || !GITHUB_SEC()) return redirectError(res, 'GitHub OAuth is not configured')

  try {
    // Exchange code → access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: GITHUB_ID(), client_secret: GITHUB_SEC(), code }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) return redirectError(res, 'GitHub token exchange failed')

    // Fetch user profile
    const profileRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.access_token}`, 'User-Agent': 'Wavio-App' },
    })
    const profile = await profileRes.json()

    // GitHub may hide email — fetch from /user/emails
    let email = profile.email
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokens.access_token}`, 'User-Agent': 'Wavio-App' },
      })
      const emails = await emailsRes.json()
      const primary = Array.isArray(emails) && emails.find(e => e.primary && e.verified)
      email = primary?.email
    }
    if (!email) return redirectError(res, 'Could not retrieve GitHub email')

    const name  = profile.name || profile.login || email
    const user  = upsertOAuthUser({ email, name, provider: 'github' })
    const token = mintJwt(user)

    res.redirect(`${APP_URL()}/auth/callback?token=${encodeURIComponent(token)}`)
  } catch (err) {
    console.error('[oauth/github]', err)
    redirectError(res, 'GitHub sign-in failed')
  }
})

export default router
