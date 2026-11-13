import mongoose from 'mongoose';

const productoCreditoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 150 },
  tasaInteresAnual: { type: Number, required: true, min: 0 },
  tipoTasa: { type: String, enum: ['fija', 'variable'], default: 'fija', required: true },
  sistemaAmortizacion: { type: String, enum: ['frances', 'aleman'], default: 'frances', required: true },
  frecuenciaPago: { type: String, enum: ['mensual', 'quincenal', 'semanal'], default: 'mensual', required: true },
  tipoMora: { type: String, enum: ['fija', 'porcentual'], default: 'fija', required: true },
  multaMoraFija: { type: Number, min: 0, default: 0, required: true },
  multaMoraPorcentaje: { type: Number, min: 0, default: 0, required: true },
  multaMoraTope: { type: Number, min: 0, default: 0, required: true },
  diasGracia: { type: Number, min: 0, default: 0, validate: Number.isInteger, required: true },
  plazoMaximosMeses: { type: Number, required: true, min: 1, validate: Number.isInteger },
  montoMinimo: { type: Number, required: true, min: 0 },
  montoMaximo: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator(value) {
        return value >= this.montoMinimo;
      },
      message: 'El monto máximo debe ser igual o mayor que el mínimo'
    }
  }
}, { timestamps: true });

export default mongoose.models.ProductoCredito
  || mongoose.model('ProductoCredito', productoCreditoSchema);

  