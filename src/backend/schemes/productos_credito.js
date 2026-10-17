import mongoose from 'mongoose';

const productoCreditoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 150 },
  tasaInteresAnual: { type: Number, required: true, min: 0 },
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
