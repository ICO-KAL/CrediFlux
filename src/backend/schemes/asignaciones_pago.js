import mongoose from 'mongoose';

const asignacionPagoSchema = new mongoose.Schema({
  pagoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pago', required: true, index: true },
  cuotaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuota', required: true, index: true },
  montoAplicado: { type: Number, required: true, min: 0.01 }
}, { timestamps: true });

export default mongoose.models.AsignacionPago
  || mongoose.model('AsignacionPago', asignacionPagoSchema);