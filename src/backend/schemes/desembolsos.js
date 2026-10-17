import mongoose from 'mongoose';

const desembolsoSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo', required: true, index: true },
  montoDesembolsado: { type: Number, required: true, min: 0.01 },
  metodoPago: {
    type: String,
    enum: ['transferencia', 'cheque', 'efectivo'],
    required: true
  },
  referenciaBancaria: { type: String, trim: true, maxlength: 150 }
}, { timestamps: true });

export default mongoose.models.Desembolso || mongoose.model('Desembolso', desembolsoSchema);
