import mongoose from 'mongoose';

const tarjetaCreditoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  numeroEnmascarado: { type: String, required: true, trim: true, maxlength: 25 },
  limiteCredito: { type: Number, required: true, min: 0 },
  saldoDisponible: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator(value) {
        return value <= this.limiteCredito;
      },
      message: 'El saldo disponible no puede superar el límite de crédito'
    }
  },
  fechaExpiracion: { type: String, required: true, trim: true, match: [/^\d{2}\/\d{2}$/, 'Usa el formato MM/AA'] },
  estado: {
    type: String,
    enum: ['activa', 'bloqueada', 'cancelada'],
    default: 'activa',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.TarjetaCredito
  || mongoose.model('TarjetaCredito', tarjetaCreditoSchema);
