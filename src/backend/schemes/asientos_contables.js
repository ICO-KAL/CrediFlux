import mongoose from 'mongoose';

const asientoContableSchema = new mongoose.Schema({
  descripcion: { type: String, required: true, trim: true, maxlength: 500 },
  fecha: { type: Date, default: Date.now, required: true },
  referencia: { type: String, trim: true, maxlength: 150 }
}, { timestamps: true });

export default mongoose.models.AsientoContable || mongoose.model('AsientoContable', asientoContableSchema);
