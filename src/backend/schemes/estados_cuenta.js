import mongoose from 'mongoose';

const estadoCuentaSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  periodo: { type: String, required: true, trim: true, maxlength: 20 },
  balanceAnterior: { type: Number, required: true },
  cargosTotales: { type: Number, required: true, min: 0 },
  pagosTotales: { type: Number, required: true, min: 0 },
  balanceActual: { type: Number, required: true }
}, { timestamps: true });

estadoCuentaSchema.index({ clienteId: 1, periodo: 1 }, { unique: true });

export default mongoose.models.EstadoCuenta || mongoose.model('EstadoCuenta', estadoCuentaSchema);
