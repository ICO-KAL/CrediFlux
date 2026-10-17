import mongoose from 'mongoose';

const movimientoContableSchema = new mongoose.Schema({
  asientoId: { type: mongoose.Schema.Types.ObjectId, ref: 'AsientoContable', required: true, index: true },
  cuentaContableId: { type: mongoose.Schema.Types.ObjectId, ref: 'CuentaContable', required: true },
  debito: { type: Number, default: 0, min: 0, required: true },
  credito: { type: Number, default: 0, min: 0, required: true }
}, { timestamps: true });

movimientoContableSchema.path('credito').validate(function (credito) {
  return (this.debito > 0 && credito === 0) || (credito > 0 && this.debito === 0);
}, 'Un movimiento debe tener débito o crédito, pero no ambos');

export default mongoose.models.MovimientoContable
  || mongoose.model('MovimientoContable', movimientoContableSchema);
