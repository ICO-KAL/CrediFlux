import mongoose from 'mongoose';

const transaccionFinancieraSchema = new mongoose.Schema({
  referenciaId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  tipoTransaccion: { type: String, required: true, trim: true, maxlength: 100 },
  monto: { type: Number, required: true, min: 0.01 },
  moneda: { type: String, default: 'DOP', required: true, uppercase: true, trim: true, match: [/^[A-Z]{3}$/, 'La moneda debe usar un código ISO de tres letras'] }
}, { timestamps: true });

export default mongoose.models.TransaccionFinanciera
  || mongoose.model('TransaccionFinanciera', transaccionFinancieraSchema);
