import mongoose from 'mongoose';

const claveIdempotenciaSchema = new mongoose.Schema({
  clave: { type: String, required: true, trim: true, unique: true },
  resultado: { type: mongoose.Schema.Types.Mixed },
  expiraEn: { type: Date, required: true }
}, { timestamps: true });

claveIdempotenciaSchema.index({ expiraEn: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.ClaveIdempotencia
  || mongoose.model('ClaveIdempotencia', claveIdempotenciaSchema);