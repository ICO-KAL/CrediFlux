import mongoose from 'mongoose';

const direccionSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  calle: { type: String, required: true, trim: true, maxlength: 150 },
  numero: { type: String, trim: true, maxlength: 30 },
  ciudad: { type: String, required: true, trim: true, maxlength: 100 },
  provincia: { type: String, required: true, trim: true, maxlength: 100 },
  codigoPostal: { type: String, trim: true, maxlength: 20 },
  pais: { type: String, default: 'República Dominicana', trim: true, maxlength: 100 }
}, { timestamps: true });

export default mongoose.models.Direccion || mongoose.model('Direccion', direccionSchema);
