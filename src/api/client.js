// A02: Use sessionStorage (cleared on tab close) rather than localStorage.
// The gold standard is HttpOnly cookies, achievable once the app is deployed
// same-origin — the Vite proxy already satisfies same-origin in development.
const TOKEN_KEY = 'wavio_token'
const USER_KEY  = 'wavio_user'

const store = sessionStorage   // swap to a cookie helper when deploying

export function getToken()         { return store.getItem(TOKEN_KEY) }
export function setToken(t)        { store.setItem(TOKEN_KEY, t) }
export function setStoredUser(u)   { store.setItem(USER_KEY, JSON.stringify(u)) }
export function getStoredUser()    { try { return JSON.parse(store.getItem(USER_KEY)) } catch { return null } }
export function clearAuthStorage() { store.removeItem(TOKEN_KEY); store.removeItem(USER_KEY) }

const BASE = '/api'

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearAuthStorage()
    window.location.href = '/login'
    return
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  get:    (path)       => request(path),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path, body) => request(path, { method: 'DELETE', ...(body ? { body: JSON.stringify(body) } : {}) }),
}

export const authApi = {
  login:    (email, password)              => api.post('/auth/login', { email, password }),
  register: (name, email, password, company) => api.post('/auth/register', { name, email, password, company }),
  logout:   ()                             => api.post('/auth/logout'),
  me:       ()                             => api.get('/auth/me'),
}

export const convApi = {
  list:        (params = {}) => api.get('/conversations?' + new URLSearchParams(params).toString()),
  get:         (id)          => api.get(`/conversations/${id}`),
  create:      (body)        => api.post('/conversations', body),
  update:      (id, body)    => api.patch(`/conversations/${id}`, body),
  messages:    (id)          => api.get(`/conversations/${id}/messages`),
  sendMessage: (id, text, type) => api.post(`/conversations/${id}/messages`, { text, type }),
}

export const contactApi = {
  list:   (params = {}) => api.get('/contacts?' + new URLSearchParams(params).toString()),
  get:    (id)          => api.get(`/contacts/${id}`),
  convos: (id)          => api.get(`/contacts/${id}/conversations`),
  create: (body)        => api.post('/contacts', body),
  update: (id, body)    => api.patch(`/contacts/${id}`, body),
  delete: (id)          => api.delete(`/contacts/${id}`),
}

export const teamApi = {
  list:      ()           => api.get('/team'),
  setStatus: (id, status) => api.patch(`/team/${id}/status`, { status }),
  invite:    (body)       => api.post('/team', body),
  remove:    (id)         => api.delete(`/team/${id}`),
}

export const dashboardApi = {
  stats:   () => api.get('/dashboard/stats'),
  reports: () => api.get('/dashboard/reports'),
}

export const cannedApi = {
  list:   ()           => api.get('/canned'),
  create: (body)       => api.post('/canned', body),
  update: (id, body)   => api.patch(`/canned/${id}`, body),
  delete: (id)         => api.delete(`/canned/${id}`),
}

export const profileApi = {
  update:            (body) => api.patch('/auth/profile', body),
  changePassword:    (body) => api.post('/auth/change-password', body),
  deleteAccount:     (body) => api.delete('/auth/account', body),
  getApiKey:         ()     => api.get('/auth/api-key'),
  regenerateApiKey:  ()     => api.post('/auth/api-key/regenerate'),
  getWebhook:        ()     => api.get('/auth/webhook'),
  saveWebhook:       (body) => api.patch('/auth/webhook', body),
  getWidget:         ()     => api.get('/auth/widget'),
  saveWidget:        (body) => api.patch('/auth/widget', body),
  getNotifications:  ()     => api.get('/auth/notifications'),
  saveNotifications: (body) => api.patch('/auth/notifications', body),
  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('avatar', file)
    const token = getToken()
    return fetch('/api/auth/avatar', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(async r => {
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Upload failed')
      return d
    })
  },
}

export const adminApi = {
  stats:              () => api.get('/admin/stats'),
  workspaces:         () => api.get('/admin/workspaces'),
  users:              () => api.get('/admin/users'),
  conversations:      () => api.get('/admin/conversations'),
  auditLog:           () => api.get('/admin/audit-log'),
  getGeneralSettings: () => api.get('/admin/general-settings'),
  saveGeneralSettings:(body) => api.patch('/admin/general-settings', body),
  getPlanConfig:      () => api.get('/admin/plan-config'),
  savePlanConfig:     (body) => api.patch('/admin/plan-config', body),
  getFeatureFlags:    () => api.get('/admin/feature-flags'),
  saveFeatureFlags:   (body) => api.patch('/admin/feature-flags', body),
  changePlan:         (id, plan) => api.patch(`/admin/workspaces/${id}/plan`, { plan }),
  suspendWorkspace:   (id) => api.patch(`/admin/workspaces/${id}/status`, { status: 'suspended' }),
  activateWorkspace:  (id) => api.patch(`/admin/workspaces/${id}/status`, { status: 'active' }),
}

export const analyticsApi = {
  workspace: () => api.get('/analytics'),
  platform:  () => api.get('/admin/stats'),
}

export const automationsApi = {
  list:    ()           => api.get('/automations'),
  create:  (body)       => api.post('/automations', body),
  update:  (id, body)   => api.patch(`/automations/${id}`, body),
  delete:  (id)         => api.delete(`/automations/${id}`),
}

export const integrationsApi = {
  list:       ()              => api.get('/integrations'),
  connect:    (ch, cfg)       => api.post(`/integrations/${ch}/connect`, cfg),
  disconnect: (ch)            => api.delete(`/integrations/${ch}`),
}

export const billingApi = {
  plan:          () => api.get('/billing/plan'),
  summary:       () => api.get('/billing/summary'),
  subscriptions: () => api.get('/billing/subscriptions'),
}

export async function uploadFile(convoId, file) {
  const token = getToken()
  const form  = new FormData()
  form.append('file', file)
  const res = await fetch(`/api/upload/${convoId}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}
