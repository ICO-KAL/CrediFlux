import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  titulo: { type: String, required: true, trim: true, maxlength: 150 },
  mensaje: { type: String, required: true, trim: true, maxlength: 5000 },
  leida: { type: Boolean, default: false, required: true }
}, { timestamps: true });

notificacionSchema.index({ clienteId: 1, leida: 1, createdAt: -1 });

export default mongoose.models.Notificacion || mongoose.model('Notificacion', notificacionSchema);
