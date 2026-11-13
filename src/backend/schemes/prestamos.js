import mongoose from 'mongoose';

const prestamoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  solicitudId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudCredito', required: true, unique: true },
  montoPrincipal: { type: Number, required: true, min: 0.01 },
  tasaInteres: { type: Number, required: true, min: 0 },
  tipoTasa: { type: String, enum: ['fija', 'variable'], default: 'fija', required: true },
  sistemaAmortizacion: { type: String, enum: ['frances', 'aleman'], default: 'frances', required: true },
  frecuenciaPago: { type: String, enum: ['mensual', 'quincenal', 'semanal'], default: 'mensual', required: true },
  tipoMora: { type: String, enum: ['fija', 'porcentual'], default: 'fija', required: true },
  multaMoraFija: { type: Number, min: 0, default: 0, required: true },
  multaMoraPorcentaje: { type: Number, min: 0, default: 0, required: true },
  multaMoraTope: { type: Number, min: 0, default: 0, required: true },
  diasGracia: { type: Number, min: 0, default: 0, validate: Number.isInteger, required: true },
  plazoMeses: { type: Number, required: true, min: 1, validate: Number.isInteger },
  estado: {
    type: String,
    enum: ['activo', 'cancelado', 'en_mora', 'saldado'],
    default: 'activo',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Prestamo || mongoose.model('Prestamo', prestamoSchema);
