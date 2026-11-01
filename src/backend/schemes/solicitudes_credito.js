import mongoose from 'mongoose';

const solicitudCreditoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  productoCreditoId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductoCredito', required: true },
  montoSolicitado: { type: Number, required: true, min: 0.01 },
  plazoSolicitadoMeses: { type: Number, required: true, min: 1, validate: Number.isInteger },
  estado: {
    type: String,
    enum: ['pendiente', 'en_revision', 'aprobada', 'rechazada', 'cancelada'],
    default: 'pendiente',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.SolicitudCredito
  || mongoose.model('SolicitudCredito', solicitudCreditoSchema);
