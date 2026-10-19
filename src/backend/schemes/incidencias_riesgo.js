import mongoose from 'mongoose';

const incidenciaRiesgoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  nivelRiesgo: {
    type: String,
    enum: ['bajo', 'medio', 'alto', 'critico'],
    required: true
  },
  descripcion: { type: String, required: true, trim: true, maxlength: 3000 }
}, { timestamps: true });

export default mongoose.models.IncidenciaRiesgo
  || mongoose.model('IncidenciaRiesgo', incidenciaRiesgoSchema);
