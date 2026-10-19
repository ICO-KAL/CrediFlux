import mongoose from 'mongoose';

const consentimientoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  tipoConsentimiento: { type: String, required: true, trim: true, maxlength: 100 },
  aceptado: { type: Boolean, required: true }
}, { timestamps: true });

export default mongoose.models.Consentimiento
  || mongoose.model('Consentimiento', consentimientoSchema);