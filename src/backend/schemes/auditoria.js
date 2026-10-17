import mongoose from "mongoose";

const auditoriaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', index: true },
  accion: { type: String, required: true, trim: true, maxlength: 150 },
  detalles: { type: String, trim: true, maxlength: 5000 },
  ip: { type: String, trim: true, maxlength: 45 }
}, { timestamps: true });

auditoriaSchema.index({ createdAt: -1 });

export default mongoose.models.Auditoria
  || mongoose.model('Auditoria', auditoriaSchema);