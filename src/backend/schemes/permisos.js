import mongoose from 'mongoose';

const permisoSchema = new mongoose.Schema({
  nombreAccion: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
  modulo: { type: String, required: true, trim: true, maxlength: 100 }
}, { timestamps: true });

export default mongoose.models.Permiso || mongoose.model('Permiso', permisoSchema);
