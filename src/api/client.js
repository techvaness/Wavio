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
  delete: (path)       => request(path, { method: 'DELETE' }),
}

export const authApi = {
  login:  (email, password) => api.post('/auth/login', { email, password }),
  logout: ()                => api.post('/auth/logout'),
  me:     ()                => api.get('/auth/me'),
}

export const convApi = {
  list:        (params = {}) => api.get('/conversations?' + new URLSearchParams(params).toString()),
  get:         (id)          => api.get(`/conversations/${id}`),
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
}

export const dashboardApi = {
  stats:   () => api.get('/dashboard/stats'),
  reports: () => api.get('/dashboard/reports'),
}

export const cannedApi = {
  list:   ()     => api.get('/canned'),
  create: (body) => api.post('/canned', body),
  delete: (id)   => api.delete(`/canned/${id}`),
}
