import mongoose from 'mongoose';

const comisionSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo', required: true, index: true },
  tipoComision: { type: String, required: true, trim: true, maxlength: 100 },
  monto: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.models.Comision || mongoose.model('Comision', comisionSchema);