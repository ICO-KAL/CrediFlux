const authApiUrl = (import.meta.env.VITE_API_URL || '/auth').replace(/\/+$/, '')

export class AuthApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = new Headers()

  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${authApiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error('No se pudo conectar con la API. Comprueba que el servidor esté iniciado.')
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('La API devolvió una respuesta inesperada. Comprueba la configuración del servidor.')
  }

  const data = await response.json()
  if (!response.ok) {
    throw new AuthApiError(data.message || 'La solicitud no pudo completarse.', response.status)
  }

  return data
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

export function refreshWithApi(tokenRefresh) {
  return request('/sessions/refresh', {
    method: 'POST',
    body: { tokenRefresh },
  })
}

export function logoutWithApi(token) {
  return request('/sessions/logout', {
    method: 'POST',
    token,
  })
}
