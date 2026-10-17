import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  montoTotal: { type: Number, required: true, min: 0.01 },
  metodoPago: { type: String, required: true, trim: true, maxlength: 50 },
  referenciaExterna: { type: String, trim: true, maxlength: 150 }
}, { timestamps: true });

export default mongoose.models.Pago || mongoose.model('Pago', pagoSchema);
