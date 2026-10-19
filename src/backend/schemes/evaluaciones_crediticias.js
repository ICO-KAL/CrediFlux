import mongoose from 'mongoose';

const evaluacionCrediticiaSchema = new mongoose.Schema({
  solicitudId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudCredito', required: true, index: true },
  scoreBuro: { type: Number, required: true, min: 0 },
  relacionDeudaIngreso: { type: Number, required: true, min: 0 },
  comentariosRiesgo: { type: String, trim: true, maxlength: 3000 }
}, { timestamps: true });

export default mongoose.models.EvaluacionCrediticia
  || mongoose.model('EvaluacionCrediticia', evaluacionCrediticiaSchema);
