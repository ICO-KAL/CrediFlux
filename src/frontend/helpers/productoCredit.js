import { createProducto, updateProducto } from '../services/dashboardApi.js'

export const createConfig = {
  label: 'Nuevo producto',
  title: 'Registrar producto de crédito',
  successMessage: 'Producto creado correctamente.',
  submit: createProducto,
  fields: [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'tasaInteresAnual', label: 'Tasa de interés anual (%)', type: 'number', min: 0, step: '0.01', required: true },
    {
      name: 'tipoTasa',
      label: 'Tipo de tasa',
      type: 'select',
      required: true,
      defaultValue: 'fija',
      options: [{ value: 'fija', label: 'Fija' }, { value: 'variable', label: 'Variable' }],
    },
    {
      name: 'sistemaAmortizacion',
      label: 'Sistema de amortización',
      type: 'select',
      required: true,
      defaultValue: 'frances',
      options: [{ value: 'frances', label: 'Francés (cuota fija)' }, { value: 'aleman', label: 'Alemán (capital fijo)' }],
    },
    {
      name: 'frecuenciaPago',
      label: 'Frecuencia de pago',
      type: 'select',
      required: true,
      defaultValue: 'mensual',
      options: [
        { value: 'mensual', label: 'Mensual' },
        { value: 'quincenal', label: 'Quincenal' },
        { value: 'semanal', label: 'Semanal' },
      ],
    },
    {
      name: 'tipoMora',
      label: 'Cálculo de mora',
      type: 'select',
      required: true,
      defaultValue: 'fija',
      options: [{ value: 'fija', label: 'Cargo fijo por cuota' }, { value: 'porcentual', label: 'Porcentaje con tope por cuota' }],
    },
    { name: 'plazoMaximosMeses', label: 'Plazo máximo (meses)', type: 'number', min: 1, step: '1', required: true },
    { name: 'montoMinimo', label: 'Monto mínimo', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'montoMaximo', label: 'Monto máximo', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'multaMoraFija', label: 'Mora fija por cuota (si aplica)', type: 'number', min: 0, step: '0.01', defaultValue: 0 },
    { name: 'multaMoraPorcentaje', label: 'Porcentaje sobre cuota vencida (si aplica)', type: 'number', min: 0, step: '0.01', defaultValue: 0 },
    { name: 'multaMoraTope', label: 'Tope de mora por cuota (si aplica)', type: 'number', min: 0, step: '0.01', defaultValue: 0 },
    { name: 'diasGracia', label: 'Días de gracia para mora', type: 'number', min: 0, step: '1', defaultValue: 0, required: true },
  ],
}

export const editConfig = {
  ...createConfig,
  actionLabel: 'Editar',
  eyebrow: 'EDITAR PRODUCTO',
  title: 'Actualizar producto de crédito',
  submitLabel: 'Guardar cambios',
  successMessage: 'Producto actualizado correctamente.',
  submit: (payload, producto) => updateProducto(producto._id, payload),
}