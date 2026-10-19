import mongoose from 'mongoose';

const planAmortizacionSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo', required: true, unique: true },
  cuotasIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cuota' }],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.PlanAmortizacion
  || mongoose.model('PlanAmortizacion', planAmortizacionSchema);
