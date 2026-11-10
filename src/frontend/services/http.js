export async function sendJson(url, { method, body, token }, { ErrorType, networkMessage, unexpectedMessage, requireJsonBeforeStatus = false }) {
  const headers = new Headers()
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ErrorType(networkMessage, 0)
  }

  const isJson = (response.headers.get('content-type') || '').includes('application/json')
  if (!isJson && requireJsonBeforeStatus) throw new ErrorType(unexpectedMessage, response.status)

  const data = isJson ? await response.json() : null
  if (!response.ok) {
    throw new ErrorType(data?.message || 'La solicitud no pudo completarse.', response.status, data?.code)
  }
  if (!isJson) throw new ErrorType(unexpectedMessage, response.status)
  return data
}
