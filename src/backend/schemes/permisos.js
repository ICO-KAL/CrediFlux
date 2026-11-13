import mongoose from 'mongoose';

const permisoSchema = new mongoose.Schema({
  nombreAccion: { type: String, required: true, trim: true, maxlength: 100 },
  modulo: { type: String, required: true, trim: true, maxlength: 100 }
}, { timestamps: true });

permisoSchema.index({ modulo: 1, nombreAccion: 1 }, { unique: true });

export default mongoose.models.Permiso || mongoose.model('Permiso', permisoSchema);
