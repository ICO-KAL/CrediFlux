const SESSION_KEY = 'crediflux.session'

function getStorage(remember) {
  return remember ? window.localStorage : window.sessionStorage
}

export function readStoredSession() {
  const localSession = window.localStorage.getItem(SESSION_KEY)
  const sessionOnly = window.sessionStorage.getItem(SESSION_KEY)
  const rawSession = localSession || sessionOnly

  if (!rawSession) return null

  let session
  try {
    session = JSON.parse(rawSession)
  } catch {
    clearStoredSession()
    throw new Error('No se pudo leer la sesión guardada. Inicia sesión nuevamente.')
  }

  if (
    typeof session.token !== 'string' ||
    typeof session.tokenRefresh !== 'string' ||
    typeof session.usuario?.email !== 'string'
  ) {
    clearStoredSession()
    throw new Error('La sesión guardada no es válida. Inicia sesión nuevamente.')
  }

  return { ...session, remember: Boolean(localSession) }
}

export function saveStoredSession(session, remember) {
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
  getStorage(remember).setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
}
