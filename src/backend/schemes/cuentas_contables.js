import mongoose from 'mongoose';

const cuentaContableSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true, unique: true, maxlength: 30 },
  nombre: { type: String, required: true, trim: true, maxlength: 150 },
  tipo: {
    type: String,
    enum: ['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto'],
    required: true
  }
}, { timestamps: true });

export default mongoose.models.CuentaContable
  || mongoose.model('CuentaContable', cuentaContableSchema);
