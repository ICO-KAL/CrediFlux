import mongoose from 'mongoose';

const cuotaSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo', required: true },
  numeroCuota: { type: Number, required: true, min: 1, validate: Number.isInteger },
  montoCapital: { type: Number, required: true, min: 0 },
  montoInteres: { type: Number, required: true, min: 0 },
  montoTotal: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator() {
        return Math.abs(this.montoTotal - (this.montoCapital + this.montoInteres)) < 0.01;
      },
      message: 'El total de la cuota debe corresponder a capital más interés'
    }
  },
  fechaVencimiento: { type: Date, required: true },
  estado: {
    type: String,
    enum: ['pendiente', 'pagada', 'vencida'],
    default: 'pendiente',
    required: true
  }
}, { timestamps: true });

cuotaSchema.index({ prestamoId: 1, numeroCuota: 1 }, { unique: true });

export default mongoose.models.Cuota || mongoose.model('Cuota', cuotaSchema);
