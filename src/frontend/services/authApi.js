import { sendJson } from './http.js'

const authApiUrl = (import.meta.env?.VITE_API_URL || '/auth').replace(/\/+$/, '')

export class AuthApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
    this.code = code
  }
}

function request(path, { method = 'GET', body, token } = {}) {
  return sendJson(`${authApiUrl}${path}`, { method, body, token }, {
    ErrorType: AuthApiError,
    networkMessage: 'No pudimos verificar tu sesión. Comprueba tu conexión e inténtalo nuevamente.',
    unexpectedMessage: 'Estamos experimentando dificultades técnicas. Inténtalo nuevamente en unos momentos.',
    requireJsonBeforeStatus: true,
  })
}

export function registerWithApi({ username, email, password }) {
  return request('/register', {
    method: 'POST',
    body: {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
    },
  })
}

export function loginWithApi({ email, password }) {
  return request('/login', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      passwordHash: password,
    },
  })
}

export function verifyWithApi(token) {
  return request('/verify', { token })
}

export function refreshWithApi(tokenRefresh, solicitudId) {
  return request('/sessions/refresh', {
    method: 'POST',
    body: { tokenRefresh, solicitudId },
  })
}

export function logoutWithApi(token) {
  return request('/sessions/logout', {
    method: 'POST',
    token,
  })
}
