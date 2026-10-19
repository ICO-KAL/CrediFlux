import mongoose from 'mongoose';

const creadifluxSchema = new mongoose.Schema({
  nombreModulo: { type: String, required: true, trim: true, maxlength: 100 },
  version: { type: String, required: true, trim: true, maxlength: 50 },
  parametros: { type: mongoose.Schema.Types.Mixed, default: () => ({}) }
}, { timestamps: true });

creadifluxSchema.index({ nombreModulo: 1, version: 1 }, { unique: true });

export default mongoose.models.Creadiflux || mongoose.model('Creadiflux', creadifluxSchema);