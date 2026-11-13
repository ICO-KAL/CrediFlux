import mongoose from 'mongoose';

const planAmortizacionSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo', required: true, unique: true },
  sistemaAmortizacion: { type: String, enum: ['frances', 'aleman'], default: 'frances', required: true },
  frecuenciaPago: { type: String, enum: ['mensual', 'quincenal', 'semanal'], default: 'mensual', required: true },
  cuotasIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cuota' }],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.PlanAmortizacion
  || mongoose.model('PlanAmortizacion', planAmortizacionSchema);
