import mongoose from 'mongoose';

const eventoOutboxSchema = new mongoose.Schema({
  aggregateId: { type: String, required: true, trim: true, maxlength: 150 },
  tipoEvento: { type: String, required: true, trim: true, maxlength: 150 },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  procesado: { type: Boolean, default: false, required: true }
}, { timestamps: true });

eventoOutboxSchema.index({ procesado: 1, createdAt: 1 });

export default mongoose.models.EventoOutbox || mongoose.model('EventoOutbox', eventoOutboxSchema);
