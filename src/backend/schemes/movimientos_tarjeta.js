import mongoose from 'mongoose';

const movimientoTarjetaSchema = new mongoose.Schema({
  tarjetaId: { type: mongoose.Schema.Types.ObjectId, ref: 'TarjetaCredito', required: true, index: true },
  monto: { type: Number, required: true, min: 0.01 },
  descripcion: { type: String, required: true, trim: true, maxlength: 500 },
  tipoMovimiento: {
    type: String,
    enum: ['cargo', 'pago', 'comision'],
    required: true
  }
}, { timestamps: true });

export default mongoose.models.MovimientoTarjeta
  || mongoose.model('MovimientoTarjeta', movimientoTarjetaSchema);
