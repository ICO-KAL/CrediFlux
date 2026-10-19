import mongoose from 'mongoose';

const documentoClienteSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  tipoDocumento: {
    type: String,
    enum: ['cedula', 'pasaporte', 'licencia'],
    required: true
  },
  numeroDocumento: { type: String, required: true, trim: true, maxlength: 50 },
  urlArchivo: { type: String, required: true, trim: true, maxlength: 2048 },
  verificado: { type: Boolean, default: false, required: true }
}, { timestamps: true });

documentoClienteSchema.index({ tipoDocumento: 1, numeroDocumento: 1 }, { unique: true });

export default mongoose.models.DocumentoCliente
  || mongoose.model('DocumentoCliente', documentoClienteSchema);
