import mongoose from 'mongoose';

const sesionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  tokenRefresh: { type: String, required: true, unique: true },
  dispositivo: { type: String, trim: true, maxlength: 300 },
  ip: { type: String, trim: true, maxlength: 45 },
  expiraEn: { type: Date, required: true }
}, { timestamps: true });

sesionSchema.index({ expiraEn: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Sesion || mongoose.model('Sesion', sesionSchema);
