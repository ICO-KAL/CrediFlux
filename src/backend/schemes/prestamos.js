import mongoose from 'mongoose';

const prestamoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  solicitudId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudCredito', required: true, unique: true },
  montoPrincipal: { type: Number, required: true, min: 0.01 },
  tasaInteres: { type: Number, required: true, min: 0 },
  plazoMeses: { type: Number, required: true, min: 1, validate: Number.isInteger },
  estado: {
    type: String,
    enum: ['activo', 'cancelado', 'en_mora', 'saldado'],
    default: 'activo',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Prestamo || mongoose.model('Prestamo', prestamoSchema);
