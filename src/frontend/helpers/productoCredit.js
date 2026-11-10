import { createProducto } from '../services/dashboardApi.js'

export const createConfig = {
  label: 'Nuevo producto',
  title: 'Registrar producto de crédito',
  successMessage: 'Producto creado correctamente.',
  submit: createProducto,
  fields: [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'tasaInteresAnual', label: 'Tasa de interés anual (%)', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'plazoMaximosMeses', label: 'Plazo máximo (meses)', type: 'number', min: 1, step: '1', required: true },
    { name: 'montoMinimo', label: 'Monto mínimo', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'montoMaximo', label: 'Monto máximo', type: 'number', min: 0, step: '0.01', required: true },
  ],
}