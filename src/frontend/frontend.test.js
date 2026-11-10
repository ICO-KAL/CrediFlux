import test from 'node:test'
import assert from 'node:assert/strict'
import { ApiError, configureApi, request } from './services/apiClient.js'
import { AuthApiError, loginWithApi, refreshWithApi, registerWithApi, verifyWithApi } from './services/authApi.js'
import { createSingleFlight } from './services/singleFlight.js'

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

test('el frontend comparte el transporte sin cambiar autenticación, errores ni renovación', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  try {
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options })
      return json({ message: 'ok' })
    }

    await loginWithApi({ email: ' TEST@Example.com ', password: 'clave' })
    assert.equal(calls[0].url, '/auth/login')
    assert.equal(calls[0].options.method, 'POST')
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json')
    assert.deepEqual(JSON.parse(calls[0].options.body), {
      email: 'test@example.com', passwordHash: 'clave',
    })
    await verifyWithApi('token')
    assert.equal(calls[1].options.headers.get('Authorization'), 'Bearer token')
    await refreshWithApi('refresh', 'request-id')
    assert.deepEqual(JSON.parse(calls[2].options.body), { tokenRefresh: 'refresh', solicitudId: 'request-id' })

    globalThis.fetch = async (url, options) => {
      assert.equal(url, '/auth/register')
      assert.equal(options.method, 'POST')
      assert.deepEqual(JSON.parse(options.body), {
        username: 'test', email: 'test@example.com', passwordHash: 'clave',
      })
      return json({ message: 'El usuario o correo ya existe' }, 409)
    }
    await assert.rejects(registerWithApi({ username: ' test ', email: ' TEST@Example.com ', password: 'clave' }),
      (error) => error instanceof AuthApiError && error.status === 409 &&
        error.message === 'El usuario o correo ya existe')

    globalThis.fetch = async () => json({ message: 'Cuenta inactiva', code: 'ACCOUNT_INACTIVE' }, 401)
    await assert.rejects(refreshWithApi('refresh', 'request-id'), (error) =>
      error instanceof AuthApiError && error.status === 401 &&
      error.code === 'ACCOUNT_INACTIVE' && error.message === 'Cuenta inactiva')

    globalThis.fetch = async () => new Response('Error de proxy', { status: 502 })
    await assert.rejects(verifyWithApi('token'), (error) =>
      error instanceof AuthApiError && error.status === 502 &&
      error.message === 'Estamos experimentando dificultades técnicas. Inténtalo nuevamente en unos momentos.')

    globalThis.fetch = async () => { throw new TypeError('network') }
    await assert.rejects(refreshWithApi('refresh'), (error) =>
      error instanceof AuthApiError && error.status === 0 &&
      error.message === 'No pudimos verificar tu sesión. Comprueba tu conexión e inténtalo nuevamente.')
    await assert.rejects(request('/clientes'), (error) =>
      error instanceof ApiError && error.status === 0 &&
      error.message === 'No se pudo conectar con la API. Comprueba que el servidor esté iniciado.')

    let token = 'anterior'
    let renewals = 0
    const singleFlight = createSingleFlight()
    configureApi({
      getToken: () => token,
      onUnauthorized: () => singleFlight(async () => {
        renewals += 1
        await new Promise((resolve) => setTimeout(resolve, 10))
        token = 'nuevo'
        return token
      }),
    })
    calls.length = 0
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options })
      return options.headers.get('Authorization') === 'Bearer nuevo'
        ? json({ ok: true })
        : json({ message: 'Expirado' }, 401)
    }
    const results = await Promise.all(Array.from({ length: 5 }, () =>
      request('/clientes', { method: 'POST', query: { page: 2, empty: '' }, body: { nombre: 'Ana' } })))
    assert.deepEqual(results, Array.from({ length: 5 }, () => ({ ok: true })))
    assert.equal(renewals, 1)
    assert.equal(calls.length, 10)
    assert.ok(calls.every(({ url, options }) => url === '/clientes?page=2' &&
      options.method === 'POST' && options.body === '{"nombre":"Ana"}'))

    configureApi({ getToken: () => null, onUnauthorized: async () => null })
    globalThis.fetch = async () => new Response('Error', { status: 502 })
    await assert.rejects(request('/clientes'), (error) =>
      error instanceof ApiError && error.status === 502 && error.message === 'La solicitud no pudo completarse.')
    globalThis.fetch = async () => new Response('No es JSON', { status: 200 })
    await assert.rejects(request('/clientes'), (error) =>
      error instanceof ApiError && error.status === 200 && error.message === 'La API devolvió una respuesta inesperada.')
  } finally {
    configureApi({ getToken: () => null, onUnauthorized: async () => null })
    globalThis.fetch = originalFetch
  }
})
