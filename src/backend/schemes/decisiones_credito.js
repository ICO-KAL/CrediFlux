import mongoose from 'mongoose';

const decisionCreditoSchema = new mongoose.Schema({
  solicitudId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudCredito', required: true, index: true },
  evaluacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'EvaluacionCrediticia', required: true },
  aprobadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  montoAprobado: { type: Number, min: 0 },
  razonDecision: { type: String, trim: true, maxlength: 2000 }
}, { timestamps: true });

export default mongoose.models.DecisionCredito
  || mongoose.model('DecisionCredito', decisionCreditoSchema);
