import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularPenalizacionMora } from './mora.js'

const fechaVencimiento = new Date('2026-01-01T00:00:00.000Z')
const prestamoBase = {
  tipoMora: 'fija',
  multaMoraFija: 25,
  multaMoraPorcentaje: 0,
  multaMoraTope: 0,
  diasGracia: 2,
}

test('mantiene el cargo fijo heredado luego de los días de gracia', () => {
  const cuota = { estado: 'vencida', montoTotal: 100, fechaVencimiento }
  const fechaReferencia = new Date('2026-01-04T00:00:00.000Z')

  assert.equal(calcularPenalizacionMora(cuota, prestamoBase, fechaReferencia), 25)
})

test('calcula el porcentaje sobre la cuota y aplica el tope por cuota', () => {
  const cuota = { estado: 'vencida', montoTotal: 2000, fechaVencimiento }
  const prestamo = {
    ...prestamoBase,
    tipoMora: 'porcentual',
    multaMoraPorcentaje: 10,
    multaMoraTope: 75,
  }
  const fechaReferencia = new Date('2026-01-04T00:00:00.000Z')

  assert.equal(calcularPenalizacionMora(cuota, prestamo, fechaReferencia), 75)
})

test('no cobra mora durante el período de gracia ni sobre cuotas pagadas', () => {
  const cuota = { estado: 'vencida', montoTotal: 100, fechaVencimiento }
  const prestamo = {
    ...prestamoBase,
    tipoMora: 'porcentual',
    multaMoraPorcentaje: 10,
    multaMoraTope: 30,
  }

  assert.equal(
    calcularPenalizacionMora(cuota, prestamo, new Date('2026-01-03T23:59:59.999Z')),
    0,
  )
  assert.equal(
    calcularPenalizacionMora({ ...cuota, estado: 'pagada' }, prestamo, new Date('2026-01-10T00:00:00.000Z')),
    0,
  )
})
