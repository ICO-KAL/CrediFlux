export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let authHandlers = { getToken: () => null, onUnauthorized: async () => null }

// La app registra aquí cómo obtener el token y cómo renovarlo cuando la API responde 401.
export function configureApi(handlers) {
  authHandlers = { ...authHandlers, ...handlers }
}

function buildUrl(path, query) {
  const params = new URLSearchParams()
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  })
  const search = params.toString()
  return search ? `${path}?${search}` : path
}

async function send(path, { method, body, query }, token) {
  const headers = new Headers()
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('No se pudo conectar con la API. Comprueba que el servidor esté iniciado.', 0)
  }

  const isJson = (response.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(data?.message || 'La solicitud no pudo completarse.', response.status)
  }
  if (!isJson) throw new ApiError('La API devolvió una respuesta inesperada.', response.status)

  return data
}

export async function request(path, options = {}) {
  const { method = 'GET', body, query } = options
  const settings = { method, body, query }

  try {
    return await send(path, settings, authHandlers.getToken())
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error

    const newToken = await authHandlers.onUnauthorized()
    if (!newToken) throw error
    return send(path, settings, newToken)
  }
}

// Las listas llegan como { clave: [...], paginacion } o directamente como arreglo.
export function pickList(data, key) {
  if (Array.isArray(data)) return { items: data, total: data.length }
  const items = Array.isArray(data?.[key])
    ? data[key]
    : Object.values(data || {}).find(Array.isArray) || []
  return { items, total: data?.paginacion?.total ?? items.length }
}
