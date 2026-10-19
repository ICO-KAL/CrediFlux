import mongoose from 'mongoose';

const cuentaCreditoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  limiteCredito: { type: Number, required: true, min: 0 },
  balanceActual: { type: Number, default: 0, min: 0 },
  estado: {
    type: String,
    enum: ['activa', 'bloqueada', 'cerrada'],
    default: 'activa',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.CuentaCredito || mongoose.model('CuentaCredito', cuentaCreditoSchema);
