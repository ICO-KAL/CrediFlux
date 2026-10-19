import mongoose from "mongoose";

const autorizacionTarjetaSchema = new mongoose.Schema({
  tarjetaId: { type: mongoose.Schema.Types.ObjectId, ref: 'TarjetaCredito', required: true, index: true },
  monto: { type: Number, required: true, min: 0.01 },
  comercio: { type: String, required: true, trim: true, maxlength: 200 },
  estadoAutorizacion: {
    type: String,
    enum: ['aprobada', 'rechazada'],
    required: true
  }
}, { timestamps: true });

export default mongoose.models.AutorizacionTarjeta
  || mongoose.model('AutorizacionTarjeta', autorizacionTarjetaSchema);
